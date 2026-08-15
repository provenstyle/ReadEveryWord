import { createServer, type Server } from 'node:http'
import { type AddressInfo } from 'node:net'
import { generateKeyPairSync, createHash } from 'node:crypto'
import jwt, { type SignOptions } from 'jsonwebtoken'
import { v4 as uuid } from 'uuid'

// A throwaway OpenID identity provider for tests.
//
// It generates an RSA keypair in-process and serves the matching public key as
// a JWKS document over loopback HTTP. Because the api validates tokens by
// fetching the JWKS at config.openId.jwksUri, pointing that at this server
// exercises the real jsonwebtoken + jwks-rsa RS256 path with no Auth0 tenant,
// no m2m application, and no client secret.
//
// The win over a real m2m token is control of `sub`: the auth middleware
// overwrites input.authId with the token subject, so a single fixed token
// would force every test onto one shared identity. Here each test can mint its
// own user and stay isolated.

export const TEST_ISSUER = 'https://local-test-idp.readeveryword.test/'
export const TEST_AUDIENCE = 'https://api.readeveryword.test'

export interface SignTokenOptions {
  /** Pass null to sign without a sub claim, which callers use to probe identity handling. */
  subject?: string | null
  audience?: string
  issuer?: string
  expiresIn?: SignOptions['expiresIn']
  /** Pass null to sign without a kid header, which callers use to probe key lookup. */
  keyid?: string | null
}

export interface TestIdentityProvider {
  jwksUri: string
  issuer: string
  audience: string
  /** The kid currently advertised in the JWKS document. */
  readonly kid: string
  signToken: (options?: SignTokenOptions) => string
  /**
   * Replaces the advertised key, withdrawing the previous one. Tokens already
   * signed by the old key keep a valid signature but its kid is gone from the
   * document, which is what key revocation looks like from the api's side.
   * Returns the new kid.
   */
  rotate: () => string
  /** JWKS documents served since the last reset, for asserting fetch suppression. */
  requestCount: () => number
  resetRequestCount: () => void
  close: () => Promise<void>
}

/**
 * Starts an identity provider on an ephemeral loopback port.
 *
 * Each call returns an independent provider with its own keypair, port and
 * request counter, so suites that count JWKS fetches do not interfere. The
 * server is unref'd, so a suite that forgets to close it will not hang jest.
 */
export async function createTestIdentityProvider(): Promise<TestIdentityProvider> {
  // Derive the kid from the key itself, so a fresh key can never reuse a
  // previous key's kid.
  const generate = () => {
    const { publicKey, privateKey } = generateKeyPairSync('rsa', { modulusLength: 2048 })
    const publicJwk = publicKey.export({ format: 'jwk' }) as { n: string; e: string }
    const kid = createHash('sha256').update(publicJwk.n).digest('base64url').slice(0, 16)
    return {
      kid,
      signingKey: privateKey.export({ type: 'pkcs8', format: 'pem' }) as string,
      document: JSON.stringify({
        keys: [{ kty: 'RSA', use: 'sig', alg: 'RS256', kid, n: publicJwk.n, e: publicJwk.e }],
      }),
    }
  }

  let current = generate()
  let requests = 0

  // Answer on every path so it does not matter whether the caller asks for
  // /.well-known/jwks.json or anything else.
  const server: Server = createServer((_request, response) => {
    requests++
    response.writeHead(200, { 'content-type': 'application/json' })
    response.end(current.document)
  })

  await new Promise<void>(resolve => server.listen(0, '127.0.0.1', resolve))

  // Do not hold the event loop open, so jest can exit even without teardown.
  server.unref()

  const { port } = server.address() as AddressInfo

  return {
    jwksUri: `http://127.0.0.1:${port}/.well-known/jwks.json`,
    issuer: TEST_ISSUER,
    audience: TEST_AUDIENCE,
    get kid() {
      return current.kid
    },
    signToken: ({
      subject = 'auth0|test-subject',
      audience = TEST_AUDIENCE,
      issuer = TEST_ISSUER,
      expiresIn = '1h',
      keyid = current.kid,
    } = {}) =>
      jwt.sign({}, current.signingKey, {
        algorithm: 'RS256',
        audience,
        issuer,
        expiresIn,
        ...(subject === null ? {} : { subject }),
        ...(keyid === null ? {} : { keyid }),
      }),
    rotate: () => {
      current = generate()
      return current.kid
    },
    requestCount: () => requests,
    resetRequestCount: () => {
      requests = 0
    },
    close: () =>
      new Promise<void>(resolve => {
        server.close(() => resolve())
      }),
  }
}

/**
 * Mints a subject and the authId the api will derive from it.
 *
 * Auth0 subjects look like `auth0|<id>`, and sanitizeAuthId strips the pipes to
 * produce the authId. That authId is used verbatim as an Azure blob container
 * name by withLock, so it has to survive as lowercase alphanumerics and
 * hyphens. `auth0|<uuid>` satisfies that; an m2m subject (`<clientId>@clients`)
 * does not.
 */
export function testSubjectFor(id: string = uuid()): { subject: string; authId: string } {
  const subject = `auth0|${id}`
  return { subject, authId: subject.replace(/\|/g, '') }
}
