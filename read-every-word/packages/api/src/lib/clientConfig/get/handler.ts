import { ok } from '@read-every-word/foundation'
import { GetClientConfig, GetClientConfigResult } from '@read-every-word/domain'
import { publicProcedure } from '../../trpc.js'
import { Config } from '../../config.js'

// Public by necessity: this is what the SPA reads in order to configure its
// Auth0 client, so it runs before any token exists.
export const getClientConfigProcedure = publicProcedure
  .input(r => r as GetClientConfig)
  .query(async ({ input, ctx }): Promise<GetClientConfigResult> => {
    return handleGetClientConfig(input, ctx.config)
  })

export async function handleGetClientConfig(request: GetClientConfig, config: Config): Promise<GetClientConfigResult> {
  // Each field is named explicitly. Spreading config.openId would leak jwksUri
  // and issuer, and spreading config would leak the storage connection string.
  return ok({
    openId: {
      domain: config.openId.domain,
      clientId: config.openId.clientId,
      audience: config.openId.audience
    }
  })
}
