import { appRouter, type Config } from '@read-every-word/api'
import { createTestIdentityProvider, testSubjectFor, type TestIdentityProvider } from '@read-every-word/test-utils'

// Exercises the auth middleware through the router, with no Auth0 tenant and
// no storage account. A rejected token throws a TRPCError from the middleware;
// an accepted one reaches the handler and comes back as a Result, so
// "resolves" versus "rejects" cleanly separates the two.

// Well formed but unreachable, so a call that gets past auth fails in
// persistence rather than while constructing the client.
const UNREACHABLE_STORAGE =
  'DefaultEndpointsProtocol=http;AccountName=devstoreaccount1;' +
  'AccountKey=Eby8vdM02xNOcqFlqUwJPLlmEtlCDXJ1OUzFT50uSRZ6IFsuFq2UVErCz4I6tq/K1SZFPTOtr/KBHBeksoGMGw==;' +
  'TableEndpoint=http://127.0.0.1:10002/devstoreaccount1;' +
  'BlobEndpoint=http://127.0.0.1:10000/devstoreaccount1;'

describe('test identity provider', () => {
  let idp: TestIdentityProvider

  const configFor = (provider: TestIdentityProvider): Config => ({
    tableStorageConnectionString: UNREACHABLE_STORAGE,
    openId: {
      jwksUri: provider.jwksUri,
      audience: provider.audience,
      issuer: provider.issuer,
    },
  })

  beforeAll(async () => {
    idp = await createTestIdentityProvider()
  })

  afterAll(async () => {
    await idp.close()
  })

  it('serves a JWKS document containing an RS256 signing key', async () => {
    const response = await fetch(idp.jwksUri)
    expect(response.status).toEqual(200)

    const jwks = (await response.json()) as { keys: Array<Record<string, string>> }
    expect(jwks.keys).toHaveLength(1)
    expect(jwks.keys[0].kty).toEqual('RSA')
    expect(jwks.keys[0].alg).toEqual('RS256')
    expect(jwks.keys[0].kid).toEqual(idp.kid)
  })

  it('accepts a token it signed', async () => {
    const { subject } = testSubjectFor()
    const caller = appRouter.createCaller({
      config: configFor(idp),
      token: idp.signToken({ subject }),
    })

    // Reaching the handler is the assertion. Storage is unreachable, so this
    // resolves to an Err rather than throwing UNAUTHORIZED.
    await expect(caller.readingCycle.get({ authId: 'ignored' })).resolves.toBeDefined()
  }, 30 * 1000)

  it('rejects a request with no token', async () => {
    const caller = appRouter.createCaller({ config: configFor(idp) })
    await expect(caller.readingCycle.get({ authId: 'ignored' })).rejects.toThrow('No token provided')
  })

  it('rejects a token for a different audience', async () => {
    const { subject } = testSubjectFor()
    const caller = appRouter.createCaller({
      config: configFor(idp),
      token: idp.signToken({ subject, audience: 'https://some-other-api.test' }),
    })
    await expect(caller.readingCycle.get({ authId: 'ignored' })).rejects.toThrow('Invalid or expired token')
  })

  it('rejects a token from a different issuer', async () => {
    const { subject } = testSubjectFor()
    const caller = appRouter.createCaller({
      config: configFor(idp),
      token: idp.signToken({ subject, issuer: 'https://some-other-idp.test/' }),
    })
    await expect(caller.readingCycle.get({ authId: 'ignored' })).rejects.toThrow('Invalid or expired token')
  })

  it('rejects an expired token', async () => {
    const { subject } = testSubjectFor()
    const caller = appRouter.createCaller({
      config: configFor(idp),
      token: idp.signToken({ subject, expiresIn: -60 }),
    })
    await expect(caller.readingCycle.get({ authId: 'ignored' })).rejects.toThrow('Invalid or expired token')
  })

  it('mints a subject whose authId is a legal blob container name', () => {
    const { authId } = testSubjectFor()
    expect(authId).toMatch(/^[a-z0-9][a-z0-9-]{1,61}[a-z0-9]$/)
    expect(authId).not.toContain('--')
  })
})
