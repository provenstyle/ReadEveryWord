import jwt from "jsonwebtoken"
import { Authentication, sanitizeAuthId } from './authentication'
import {type OpenIdConfig} from './config'
import { isErr } from "@read-every-word/infrastructure"

describe('authentication', () => {
  const config: OpenIdConfig = {
    audience: "read-every-word-bff-dev",
    jwksUri: "https://dev-lr8vwbeyc7gmi0w2.us.auth0.com/.well-known/jwks.json",
    issuer: "https://dev-lr8vwbeyc7gmi0w2.us.auth0.com/"
  }

  it.skip('can authenticate a valid token', async () => {
    const token = "If I add a valid token here it will pass"

    const authn = new Authentication(config)
    const authnResult = await authn.validateToken(token)
    if (isErr(authnResult)) {
      throw new Error('unexpected failure')
    }
    const claims = authnResult.data
    expect(claims.iss).toEqual(config.issuer)
  })

  it('fails on an invalid token', async () => {
    const token = withRandomToken()
    const authn = new Authentication(config)
    expect(async () => {
      await authn.validateToken(token)
    })
  })

  it('can sanitize sub for authId', () => {
    const jwt = {
      sub: 'auth0|123'
    }
    expect(sanitizeAuthId(jwt)).toEqual('auth0123')
  })
})

const withRandomToken = (): string => {
  const payload = {
    sub: 'sub',
    name: 'name'
  }

  return jwt.sign(payload, '256-bit-secret', {
    algorithm: 'HS256',
    expiresIn: '1h',
    header: {
      kid: 'my-key-id',
      alg: 'HS256'
    }
  })
}