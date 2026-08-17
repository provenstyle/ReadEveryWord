import { isErr, isOk } from '@read-every-word/foundation'
import { createTestIdentityProvider, type TestIdentityProvider } from '@read-every-word/test-utils'
import { Authentication, sanitizeAuthId, isUsableAuthId } from './authentication.js'

describe('Authentication', () => {
  let idp: TestIdentityProvider

  beforeAll(async () => {
    idp = await createTestIdentityProvider()
  })

  afterAll(async () => {
    await idp.close()
  })

  // Mirrors trpc.ts, which constructs Authentication per request.
  const validate = (token: string) =>
    new Authentication({
      jwksUri: idp.jwksUri,
      audience: idp.audience,
      issuer: idp.issuer
    }).validateToken(token)

  const sign = (keyid?: string | null) =>
    idp.signToken({ subject: 'auth0|integration', ...(keyid === undefined ? {} : { keyid }) })

  it('accepts a token signed by the advertised key', async () => {
    const result = await validate(sign())
    expect(isOk(result)).toBe(true)
  })

  it('fetches the JWKS once for a repeated valid kid', async () => {
    // Warm the cache first so this does not depend on test ordering.
    await validate(sign())

    idp.resetRequestCount()
    for (let i = 0; i < 5; i++) {
      await validate(sign())
    }
    expect(idp.requestCount()).toEqual(0)
  })

  it('does not fetch the JWKS for an unknown kid once the document is cached', async () => {
    // Warm the document so this does not depend on test ordering.
    await validate(sign())

    idp.resetRequestCount()
    for (let i = 0; i < 5; i++) {
      const result = await validate(sign('unknown-kid-repeated'))
      expect(isErr(result)).toBe(true)
    }
    // The cached key set already proves the kid does not exist, so an
    // unrecognized kid is answered without touching the network at all.
    expect(idp.requestCount()).toEqual(0)
  })

  it('does not fetch the JWKS for a token with no kid', async () => {
    idp.resetRequestCount()
    const result = await validate(sign(null))
    expect(isErr(result)).toBe(true)
    expect(idp.requestCount()).toEqual(0)
  })

  it('rejects a token with no kid rather than throwing', async () => {
    await expect(validate(sign(null))).resolves.toBeDefined()
  })

  it('rejects a verified token that carries no sub claim', async () => {
    const result = await validate(idp.signToken({ subject: null }))
    expect(isErr(result)).toBe(true)
    if (isErr(result)) {
      expect(result.err.code).toEqual('not-authenticated')
    }
  })

  it('rejects a verified token whose sub is blank', async () => {
    const result = await validate(idp.signToken({ subject: '   ' }))
    expect(isErr(result)).toBe(true)
  })

  it('fetches the JWKS at most once for many DISTINCT unknown kids', async () => {
    const flooded = await createTestIdentityProvider()
    const validateFlooded = (token: string) =>
      new Authentication({
        jwksUri: flooded.jwksUri,
        audience: flooded.audience,
        issuer: flooded.issuer
      }).validateToken(token)

    flooded.resetRequestCount()
    for (let i = 0; i < 30; i++) {
      const result = await validateFlooded(
        flooded.signToken({ subject: 'auth0|x', keyid: `distinct-bogus-${i}` })
      )
      expect(isErr(result)).toBe(true)
    }
    expect(flooded.requestCount()).toEqual(1)

    await flooded.close()
  }, 60 * 1000)

  it('still accepts a legitimate uncached key during a distinct-kid flood', async () => {
    const flooded = await createTestIdentityProvider()
    const validateFlooded = (token: string) =>
      new Authentication({
        jwksUri: flooded.jwksUri,
        audience: flooded.audience,
        issuer: flooded.issuer
      }).validateToken(token)

    for (let i = 0; i < 30; i++) {
      await validateFlooded(flooded.signToken({ subject: 'auth0|x', keyid: `flood-${i}` }))
    }

    // The real key has never been resolved for this issuer. A throttle shared
    // between genuine and bogus lookups used to starve it.
    const result = await validateFlooded(flooded.signToken({ subject: 'auth0|x' }))
    expect(isOk(result)).toBe(true)

    await flooded.close()
  }, 60 * 1000)

  it('coalesces concurrent lookups of the same unknown kid', async () => {
    const concurrent = await createTestIdentityProvider()
    const validateConcurrent = (token: string) =>
      new Authentication({
        jwksUri: concurrent.jwksUri,
        audience: concurrent.audience,
        issuer: concurrent.issuer
      }).validateToken(token)

    concurrent.resetRequestCount()
    const results = await Promise.all(
      Array.from({ length: 8 }, () =>
        validateConcurrent(concurrent.signToken({ subject: 'auth0|x', keyid: 'concurrent-bogus' }))
      )
    )
    expect(results.every(isErr)).toBe(true)
    expect(concurrent.requestCount()).toEqual(1)

    await concurrent.close()
  }, 60 * 1000)

  // The document cache is plain objects rather than a TTL cache, so expiry is
  // hand rolled off fetchedAt. These pin that a key withdrawn upstream really
  // does stop working.
  describe('key withdrawal', () => {
    let withdrawn: TestIdentityProvider
    let validateWithdrawn: (token: string) => ReturnType<Authentication['validateToken']>
    let now: number
    let nowSpy: jest.SpiedFunction<typeof Date.now>

    beforeAll(async () => {
      withdrawn = await createTestIdentityProvider()
      validateWithdrawn = (token: string) =>
        new Authentication({
          jwksUri: withdrawn.jwksUri,
          audience: withdrawn.audience,
          issuer: withdrawn.issuer
        }).validateToken(token)

      // Only Date.now is faked. Timers and sockets stay real so the loopback
      // JWKS fetch still works.
      now = Date.now()
      nowSpy = jest.spyOn(Date, 'now').mockImplementation(() => now)
    })

    afterAll(async () => {
      nowSpy.mockRestore()
      await withdrawn.close()
    })

    it('stops accepting a key once it leaves the JWKS and the document expires', async () => {
      const oldToken = withdrawn.signToken({ subject: 'auth0|rotating', expiresIn: '48h' })
      expect(isOk(await validateWithdrawn(oldToken))).toBe(true)

      // Upstream rotates. The old kid is no longer published.
      withdrawn.rotate()

      // Still served from the cached document, which is the point of caching.
      expect(isOk(await validateWithdrawn(oldToken))).toBe(true)

      // Past the document TTL. The first request still answers from the stale
      // document and kicks off a refresh in the background rather than making
      // this caller wait.
      now += 13 * 60 * 60 * 1000
      expect(isOk(await validateWithdrawn(oldToken))).toBe(true)

      // Let the background refresh land.
      await new Promise(resolve => setTimeout(resolve, 250))

      // Now the withdrawn key is genuinely gone.
      expect(isErr(await validateWithdrawn(oldToken))).toBe(true)

      // And the replacement works.
      const newToken = withdrawn.signToken({ subject: 'auth0|rotating' })
      expect(isOk(await validateWithdrawn(newToken))).toBe(true)
    }, 60 * 1000)
  })

  it('returns a Result rather than rejecting for malformed input', async () => {
    // Failures are values. Anything that rejects here would bypass the isErr
    // check in the trpc middleware and surface as a 500.
    for (const token of ['', 'not-a-jwt', 'a.b.c', '...']) {
      await expect(validate(token)).resolves.toBeDefined()
      expect(isErr(await validate(token))).toBe(true)
    }
  })
})

describe('sanitizeAuthId', () => {
  // Imported rather than redeclared: the container name rule is enforced in
  // production now, so the test and the api cannot drift apart.
  const isLegalContainerName = isUsableAuthId

  it('strips the pipe from a single segment subject', () => {
    expect(sanitizeAuthId({ sub: 'auth0|507f1f77bcf86cd799439011' })).toEqual('auth0507f1f77bcf86cd799439011')
  })

  it('strips every pipe from a multi segment subject', () => {
    expect(sanitizeAuthId({ sub: 'oauth2|facebook|123' })).toEqual('oauth2facebook123')
    expect(sanitizeAuthId({ sub: 'windowslive|x|y|z' })).toEqual('windowslivexyz')
  })

  it('produces a legal blob container name for known subject shapes', () => {
    const subjects = [
      'auth0|507f1f77bcf86cd799439011',
      'google-oauth2|1234567890',
      'oauth2|facebook|123',
      'windowslive|x|y|z'
    ]
    for (const sub of subjects) {
      expect(isLegalContainerName(sanitizeAuthId({ sub }))).toBe(true)
    }
  })
})
