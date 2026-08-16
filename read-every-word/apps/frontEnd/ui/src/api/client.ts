import { createTRPCClient, httpBatchLink, type TRPCClient } from '@trpc/client'
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
