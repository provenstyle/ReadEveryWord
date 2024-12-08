import jwt, { VerifyOptions, Jwt, JwtPayload } from "jsonwebtoken"
import jwksClient from "jwks-rsa"
import NodeCache from "node-cache"
import { type OpenIdConfig } from "./config";

// https://github.com/auth0/node-jsonwebtoken
// https://github.com/auth0/node-jwks-rsa

const keyCache: NodeCache = new NodeCache({ stdTTL: 600, checkperiod: 0 }) // Cache keys for 10 minutes

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

  validateToken = (token: string): Promise<string | Jwt | JwtPayload | undefined> => {
    return new Promise((resolve, reject) => {
      const options: VerifyOptions = {
        audience: this.config.audience,
        issuer: this.config.issuer,
        algorithms: ["RS256"]
      }
      jwt.verify(token, this.getKey, options, (err, decoded) => {
        if (err) {
          reject(err)
        } else {
          resolve(decoded)
        }
      })
    })
  }
}
