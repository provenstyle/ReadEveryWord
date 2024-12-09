import {type HttpRequest, type HttpResponseInit, type InvocationContext } from '@azure/functions'
import jwt, { VerifyOptions, Jwt, JwtPayload } from "jsonwebtoken"
import jwksClient from "jwks-rsa"
import NodeCache from "node-cache"
import { fromEnv, type OpenIdConfig } from "./config";
import { isErr, Result, err, ok } from '@read-every-word/infrastructure'

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

  validateToken = (token: string): Promise<Result<string | Jwt | JwtPayload | undefined, FailedAuthentication>> => {
    return new Promise((resolve, reject) => {
      const options: VerifyOptions = {
        audience: this.config.audience,
        issuer: this.config.issuer,
        algorithms: ["RS256"]
      }
      jwt.verify(token, this.getKey, options, (error, decoded) => {
        if (error) {
          reject(err({}))
        } else {
          resolve(ok(decoded))
        }
      })
    })
  }
}

export interface FailedAuthentication {
}

type EndPointHandler = (request: HttpRequest, context: InvocationContext) => Promise<HttpResponseInit>

export const authenticate = (handler: EndPointHandler): EndPointHandler => {
  return async function (request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    if (!config) {
      const configResult = fromEnv()
      if (isErr(configResult)) {
        console.error('Missing environment variable configuration.')
        return ({ status: 500 })
      }
      config = configResult.data.openId
    }
    const authn = new Authentication(config)
    
    const token = ''
    const validationResult = await authn.validateToken(token)
    if (isErr(validationResult)) {
      return ({ status: 401 })
    }
    const scopes = validationResult.data

    // Call the original handler
    const response = await handler(request, context);

    return response;
  };
}