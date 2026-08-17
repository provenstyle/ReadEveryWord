import jwt, { VerifyOptions, type JwtPayload } from "jsonwebtoken"
import jwksClient from "jwks-rsa"
import { type TokenVerificationConfig } from "./config.js";
import { Result, err, ok } from '@read-every-word/foundation'

export type { JwtPayload }

// https://github.com/auth0/node-jsonwebtoken
// https://github.com/auth0/node-jwks-rsa

// The whole JWKS is cached, not individual keys. Caching per kid means an
// unrecognized kid always misses and always reaches the network, so a caller
// inventing kids controls how many outbound requests we make. Holding the
// complete key set lets an unknown kid be answered from memory instead.
//
// 60 * 60 * 12 is 12 hours
const DOCUMENT_TTL_MS = 60 * 60 * 12 * 1000

// Shortest gap between fetches triggered by an unrecognized kid. This is the
// only throttle needed: however many distinct kids arrive, they cost at most
// one request per issuer per window. It also bounds how long a newly rotated
// key takes to become usable.
const MIN_REFETCH_INTERVAL_MS = 60 * 1000

interface JwksDocument {
  keysByKid: Map<string, string>
  fetchedAt: number
}

const documents: Record<string, JwksDocument> = {}
const lastAttemptAt: Record<string, number> = {}
const inFlight: Record<string, Promise<JwksDocument | undefined>> = {}

// One client per jwksUri. Its own rate limiter is deliberately left off: it is
// a single budget shared by genuine and bogus lookups, so exhausting it with
// invented kids also blocked legitimate keys from ever resolving.
const clients: Record<string, ReturnType<typeof jwksClient>> = {}

const clientFor = (jwksUri: string): ReturnType<typeof jwksClient> => {
  if (!clients[jwksUri]) {
    clients[jwksUri] = jwksClient({ jwksUri, cache: false, rateLimit: false })
  }
  return clients[jwksUri]
}

// Concurrent callers share one request. Failures update lastAttemptAt too, so
// an unreachable issuer is retried on the same schedule rather than on every
// request.
const refreshDocument = (jwksUri: string): Promise<JwksDocument | undefined> => {
  const existing = inFlight[jwksUri]
  if (existing) {
    return existing
  }

  lastAttemptAt[jwksUri] = Date.now()

  const request = clientFor(jwksUri)
    .getSigningKeys()
    .then(keys => {
      const document: JwksDocument = {
        keysByKid: new Map(keys.map(key => [key.kid, key.getPublicKey()])),
        fetchedAt: Date.now()
      }
      documents[jwksUri] = document
      return document
    })
    .catch(e => {
      console.log('Unable to fetch JWKS', e)
      return undefined
    })
    .finally(() => {
      delete inFlight[jwksUri]
    })

  inFlight[jwksUri] = request
  return request
}

// Joins an in-flight fetch, starts one if the throttle window has elapsed, or
// returns what is already cached without touching the network.
const refreshIfDue = (jwksUri: string): Promise<JwksDocument | undefined> => {
  const existing = inFlight[jwksUri]
  if (existing) {
    return existing
  }

  const elapsed = Date.now() - (lastAttemptAt[jwksUri] ?? 0)
  if (elapsed >= MIN_REFETCH_INTERVAL_MS) {
    return refreshDocument(jwksUri)
  }

  return Promise.resolve(documents[jwksUri])
}

export class Authentication {
  constructor(private config: TokenVerificationConfig) {
  }

  private getKey = async (header: jwt.JwtHeader, callback: jwt.SigningKeyCallback) => {
    try {
      const kid = header.kid
      if (!kid) {
        callback(new SigningKeyUnavailable('Token header does not specify a kid'), undefined)
        return
      }

      // Documents are held per jwksUri, so two issuers cannot collide on a kid.
      const jwksUri = this.config.jwksUri
      const document = documents[jwksUri]
      const knownKey = document?.keysByKid.get(kid)

      if (knownKey) {
        // Serve a known kid even from an expired document; the binding from kid
        // to key does not change. Refresh in the background so a key withdrawn
        // upstream stops working, without making this caller wait.
        if (Date.now() - document.fetchedAt >= DOCUMENT_TTL_MS) {
          void refreshIfDue(jwksUri)
        }
        callback(null, knownKey)
        return
      }

      // Unrecognized. Only reach for the network if no request is already in
      // flight and the throttle window has elapsed; otherwise answer from what
      // is already in memory.
      const refreshed = await refreshIfDue(jwksUri)
      const key = refreshed?.keysByKid.get(kid)

      if (key) {
        callback(null, key)
        return
      }

      callback(new SigningKeyUnavailable('Unrecognized kid'), undefined)
    } catch (e) {
      callback(e instanceof Error ? e : new SigningKeyUnavailable('Signing key lookup failed'), undefined)
    }
  }

  validateToken = (token: string): Promise<Result<ValidateTokenSucceeded, ValidateTokenFailed>> => {
    return new Promise(resolve => {
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
            return
          }

          const payload = decoded as JwtPayload

          // Every request is partitioned by the subject, so a token that does
          // not identify one cannot count as authenticated. Falling through
          // would derive an empty authId and put every such caller into a
          // single shared partition.
          if (typeof payload?.sub !== 'string' || payload.sub.trim() === '') {
            console.log('Token verified but carries no usable sub claim')
            resolve(err(new NotAuthenticated()))
            return
          }

          // A sub that cannot produce a legal container name would otherwise
          // fail deep inside Azure on the first write, or slip through the
          // unescaped OData filters. Reject it here instead, where the caller
          // gets a 401 rather than a 500.
          if (!isUsableAuthId(sanitizeAuthId(payload))) {
            console.log('Token verified but its sub does not yield a usable authId')
            resolve(err(new NotAuthenticated()))
            return
          }

          resolve(ok(payload))
        })
      } catch (e) {
        // Resolve rather than reject: failures are values here. Rejecting
        // skipped the isErr check in the trpc middleware, so this branch
        // escaped as a 500 instead of the mapped response.
        console.log('Unexpected authentication exception', e)
        resolve(err(new UnexpectedAuthenticationException()))
      }
    })
  }
}

// Subjects are `auth0|<id>` for database connections, but several connection
// types produce more than one segment, such as `oauth2|<provider>|<id>`. Every
// pipe has to go: the result is used verbatim as an Azure blob container name
// by withLock, and a surviving pipe makes that name illegal.
// validateToken rejects tokens without a sub, so the fallback below is only a
// guard for direct callers rather than a reachable path for verified tokens.
export const sanitizeAuthId = (token: JwtPayload): string => {
  const auth0Id = token.sub ?? ''
  const sanitized = auth0Id.replace(/\|/g, '')
  return sanitized
}

/**
 * Whether an authId is usable as an Azure blob container name.
 *
 * This is the real contract on authId and it was previously only asserted in
 * tests. It matters in two places: withLock passes authId straight to
 * getContainerClient, and the persistence filters interpolate it into OData
 * filter strings without escaping. Enforcing the shape is what makes that
 * interpolation safe by construction rather than by assuming well formed
 * subjects.
 *
 * Deliberately a predicate rather than a normalizer. authId is the live
 * PartitionKey for existing data, so lowercasing or trimming it here would
 * repartition those users and orphan everything they have written. A subject
 * that cannot produce a legal authId is rejected, never rewritten.
 */
export const isUsableAuthId = (authId: string): boolean =>
  /^[a-z0-9][a-z0-9-]{1,61}[a-z0-9]$/.test(authId) && !authId.includes('--')

type ValidateTokenSucceeded =
  | JwtPayload

type ValidateTokenFailed =
  | NotAuthenticated
  | UnexpectedAuthenticationException

// Surfaced through jwt.verify's callback, so it has to be a real Error. It is
// reported as NotAuthenticated like any other verification failure.
export class SigningKeyUnavailable extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'SigningKeyUnavailable'
  }
}

export class NotAuthenticated {
  code = 'not-authenticated' as const
  message = 'Not authenticated'
}

export class UnexpectedAuthenticationException {
  code = 'unexpected-authentication-exception' as const
  message = 'Unexpected authentication exception'
}
