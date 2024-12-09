import {type HttpRequest, type HttpResponseInit, type InvocationContext } from '@azure/functions'
import jwt, { VerifyOptions, Jwt, type JwtPayload } from "jsonwebtoken"
import jwksClient from "jwks-rsa"
import NodeCache from "node-cache"
import { fromEnv, type OpenIdConfig } from "./config";
import { isErr, Result, err, ok, assertNever } from '@read-every-word/infrastructure'

export type { JwtPayload }

// https://github.com/auth0/node-jsonwebtoken
// https://github.com/auth0/node-jwks-rsa

const keyCache: NodeCache = new NodeCache({ stdTTL: 600, checkperiod: 0 })
let config: OpenIdConfig

export class Authentication {
  constructor(private config: OpenIdConfig) {
  }

  private getKey = (header: jwt.JwtHeader, callback: jwt.SigningKeyCallback) => {
    const client = jwksClient({
      jwksUri: this.config.jwksUri
    })
    const cachedKey = keyCache.get<string>(header.kid!)
    if (cachedKey) {
      callback(null, cachedKey)
    } else {
      client.getSigningKey(header.kid!, (err, key) => {
        if (err) {
          callback(err, undefined);
        } else {
          const signingKey = key?.getPublicKey()
          if (signingKey) {
            keyCache.set(header.kid!, signingKey)
          }
          callback(null, signingKey);
        }
      })
    }
  }

  validateToken = (token: string): Promise<Result<ValidateTokenSucceeded, ValidateTokenFailed>> => {
    return new Promise((resolve, reject) => {
      try {
        const options: VerifyOptions = {
          audience: this.config.audience,
          issuer: this.config.issuer,
          algorithms: ["RS256"]
        }
        jwt.verify(token, this.getKey, options, (error, decoded) => {
          if (error) {
            console.log(error)
            resolve(err(new NotAuthenticated()))
          } else {
            resolve(ok(decoded as JwtPayload))
          }
        })
      } catch (e) {
        console.log('Unexpected authentication exception', e)
        reject(err(new UnexpectedAuthenticationException()))
      }
    })
  }
}

export const authenticate = (handler: AuthenticatedHandler): EndPointHandler => {
  return async function (request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    if (!config) {
      const configResult = fromEnv()
      if (isErr(configResult)) {
        console.error('Missing environment variable configuration.')
        return ({ status: 500 })
      }
      config = configResult.data.openId
    }

    const authHeader = request.headers.get('Authorization') ?? ''
    const token = authHeader.replace('Bearer ', '').trim()

    const authn = new Authentication(config)
    const validationResult = await authn.validateToken(token)
    if (isErr(validationResult)) {
      const err = validationResult.err
      switch (err.code) {
        case 'unexpected-authentication-exception': return ({ status: 500 })
        case 'not-authenticated': return ({ status: 401 })
        default: return assertNever(err)
      }
    }
    const jwt = validationResult.data

    // Call the original handler
    const response = await handler(request, context, jwt);

    return response;
  };
}

type ValidateTokenSucceeded =
  | JwtPayload

type ValidateTokenFailed =
  | NotAuthenticated
  | UnexpectedAuthenticationException

export class NotAuthenticated {
  code = 'not-authenticated' as const
  message = 'Not authenticated'
}

export class UnexpectedAuthenticationException {
  code = 'unexpected-authentication-exception' as const
  message = 'Unexpected authentication exception'
}

type EndPointHandler = (request: HttpRequest, context: InvocationContext) => Promise<HttpResponseInit>
type AuthenticatedHandler = (request: HttpRequest, context: InvocationContext, token: JwtPayload) => Promise<HttpResponseInit>