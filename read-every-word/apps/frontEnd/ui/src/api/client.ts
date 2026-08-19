import { createTRPCClient, httpBatchLink, type TRPCClient } from '@trpc/client'
import type { Auth0VueClient } from '@auth0/auth0-vue'
// Type only. packages/api exports the router type and runtime values from the
// same module, so a value import here would pull @azure/data-tables,
// jsonwebtoken and jwks-rsa into the browser bundle.
import type { AppRouter } from '@read-every-word/api'

export type ApiClient = TRPCClient<AppRouter>

/**
 * The api is reached at the same origin as the app. Cloudflare's worker routes
 * /api/* to the function app in the deployed environments, and vite's dev
 * server proxy stands in for it locally.
 *
 * Pass getAccessToken for authenticated procedures. clientConfig.get runs
 * before auth0 exists, so it is called without one.
 */
// The return type is annotated rather than inferred: composite: true makes
// tsc emit declarations, and it cannot name trpc's inferred client type
// without reaching into packages/api's internals (TS2742).
export function createApiClient (getAccessToken?: () => Promise<string>): ApiClient {
  return createTRPCClient<AppRouter>({
    links: [
      httpBatchLink({
        url: new URL('/api/trpc', window.location.origin).href,
        headers: async () => {
          if (!getAccessToken) return {}
          return { Authorization: `Bearer ${await getAccessToken()}` }
        },
      }),
    ],
  })
}

/**
 * An api client for the signed-in user, for use from a provider component.
 *
 * getAccessTokenSilently rejects once the refresh token expires, which would
 * otherwise surface as an opaque failure on whichever call happened to be next.
 * Redirecting to login is the only useful response, so it is handled here once
 * rather than at every call site.
 */
export function createAuthenticatedApiClient (auth: Auth0VueClient): ApiClient {
  return createApiClient(async () => {
    try {
      return await auth.getAccessTokenSilently()
    } catch (error) {
      console.error('Authentication failed:', error)
      await auth.loginWithRedirect({
        appState: {
          target: window.location.pathname
        }
      })
      throw error
    }
  })
}
