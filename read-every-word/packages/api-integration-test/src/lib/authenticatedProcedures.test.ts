import { appRouter, type Caller } from '@read-every-word/api'
import { createTestIdentityProvider, testSubjectFor, type TestIdentityProvider } from '@read-every-word/test-utils'
import { withAuthOnlyConfig } from './scenarios.js'

// Every authenticated procedure must reject every kind of bad token.
//
// testIdentityProvider.test.ts proves the middleware itself behaves, but only
// through readingCycle.get. A procedure that forgets authenticatedProcedure is
// invisible to that test, so this suite sweeps all of them.
//
// The authenticated set is derived as "every procedure except the public
// allowlist" rather than hand listed, so a newly added procedure is covered the
// moment it is registered on the router. Adding a public one without recording
// it here fails loudly, which is the direction the mistake should fail in.

const PUBLIC_PROCEDURES = [
  'clientConfig.get',
  'healthCheck.get'
]

const allProcedurePaths = (): string[] => Object.keys(appRouter._def.procedures)

const authenticatedProcedurePaths = (): string[] =>
  allProcedurePaths().filter(path => !PUBLIC_PROCEDURES.includes(path))

/**
 * Resolves a dotted procedure path against a caller.
 *
 * Called through its parent router object so the procedure keeps its `this`.
 */
const invoke = (caller: Caller, path: string) => {
  const segments = path.split('.')
  const name = segments.pop() as string
  const parent = segments.reduce<any>((node, key) => node?.[key], caller)
  if (typeof parent?.[name] !== 'function') {
    throw new Error(`No procedure at ${path}`)
  }
  return (input: unknown) => parent[name](input)
}

// Auth runs before the handler, so the input is irrelevant here - these tests
// only ever get as far as the token check. Procedures that take no input ignore
// it entirely.
const ANY_INPUT = {}

describe('authenticated procedures reject invalid tokens', () => {
  let idp: TestIdentityProvider
  // A second provider with the same issuer and audience but its own keypair.
  // Tokens it signs look right in every claim and carry a kid that is absent
  // from the real JWKS, which is what a forged token looks like.
  let foreignIdp: TestIdentityProvider

  beforeAll(async () => {
    idp = await createTestIdentityProvider()
    foreignIdp = await createTestIdentityProvider()
  })

  afterAll(async () => {
    await Promise.all([idp.close(), foreignIdp.close()])
  })

  const callerWith = (token?: string): Caller =>
    appRouter.createCaller({ config: withAuthOnlyConfig(idp), token })

  // Each case yields the token to present, or undefined to present none.
  const invalidTokens: Array<{ name: string; message: string; token: () => string | undefined }> = [
    {
      name: 'no token',
      message: 'No token provided',
      token: () => undefined
    },
    {
      name: 'a malformed token',
      message: 'Invalid or expired token',
      token: () => 'not-a-json-web-token'
    },
    {
      name: 'a token with no subject',
      message: 'Invalid or expired token',
      token: () => idp.signToken({ subject: null })
    },
    {
      name: 'a token for a different audience',
      message: 'Invalid or expired token',
      token: () => idp.signToken({ subject: testSubjectFor().subject, audience: 'https://some-other-api.test' })
    },
    {
      name: 'a token from a different issuer',
      message: 'Invalid or expired token',
      token: () => idp.signToken({ subject: testSubjectFor().subject, issuer: 'https://some-other-idp.test/' })
    },
    {
      name: 'an expired token',
      message: 'Invalid or expired token',
      token: () => idp.signToken({ subject: testSubjectFor().subject, expiresIn: -60 })
    },
    {
      name: 'a token signed by an unknown key',
      message: 'Invalid or expired token',
      token: () => foreignIdp.signToken({ subject: testSubjectFor().subject })
    }
  ]

  describe.each(authenticatedProcedurePaths())('%s', path => {
    it.each(invalidTokens)('rejects $name', async ({ token, message }) => {
      const caller = callerWith(token())

      await expect(invoke(caller, path)(ANY_INPUT)).rejects.toThrow(message)
    })
  })

  it('rejects a token the middleware would otherwise accept only because of its claims, not its signature', async () => {
    // Guards the case above from passing for the wrong reason: the same claims
    // signed by the trusted key are accepted, so the rejection really is about
    // the signing key.
    const subject = testSubjectFor().subject
    const caller = callerWith(idp.signToken({ subject }))

    await expect(invoke(caller, 'readingCycle.get')(ANY_INPUT)).resolves.toBeDefined()
  }, 30 * 1000)
})

describe('procedure classification', () => {
  it('every public procedure in the allowlist still exists on the router', () => {
    expect(allProcedurePaths()).toEqual(expect.arrayContaining(PUBLIC_PROCEDURES))
  })

  it('covers every procedure the router exposes', () => {
    expect([...PUBLIC_PROCEDURES, ...authenticatedProcedurePaths()].sort())
      .toEqual([...allProcedurePaths()].sort())
  })

  it.each(PUBLIC_PROCEDURES)('%s is reachable with no token', async path => {
    const idp = await createTestIdentityProvider()
    try {
      const caller = appRouter.createCaller({ config: withAuthOnlyConfig(idp) })

      await expect(invoke(caller, path)({})).resolves.toBeDefined()
    } finally {
      await idp.close()
    }
  })
})
