import { Result, GetFailed } from '@read-every-word/foundation'

// The subset of configuration that is safe to hand to a browser, and that the
// SPA needs before it can authenticate at all. Its shape is fixed by the
// consumer, which passes it straight into createAuth0.
export interface ClientConfig {
  openId: {
    domain: string
    clientId: string
    audience: string
  }
}

// A record rather than an empty interface, which lint rejects.
export type GetClientConfig = Record<string, never>

export type GetClientConfigSucceeded =
  | ClientConfig

export type GetClientConfigFailed =
  | GetFailed

export type GetClientConfigResult = Result<GetClientConfigSucceeded, GetClientConfigFailed>
