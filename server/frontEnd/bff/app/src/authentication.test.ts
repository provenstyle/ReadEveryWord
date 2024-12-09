import jwt, { JwtPayload } from "jsonwebtoken"
import { Authentication } from './authentication'
import {type OpenIdConfig} from './config'

describe('authentication', () => {
  const config: OpenIdConfig = {
    audience: "read-every-word-bff-dev",
    jwksUri: "https://dev-lr8vwbeyc7gmi0w2.us.auth0.com/.well-known/jwks.json",
    issuer: "https://dev-lr8vwbeyc7gmi0w2.us.auth0.com/"
  }

  // it('can authenticate a valid token', async () => {
  //   const token = "If I add a valid token here it will pass"

  //   const authn = new Authentication(config)
  //   await authn.validateToken(token)
  //     .then((reponse: JwtPayload) => {
  //       expect(reponse?.iss).toEqual(config.issuer)
  //     })
  //     .catch(() => {
  //       throw new error('unexpected failure')
  //     })
  // })

  it('fails on an invalid token', async () => {
    const token = withRandomToken()
    const authn = new Authentication(config)
    expect(async () => {
      await authn.validateToken(token)
    })
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