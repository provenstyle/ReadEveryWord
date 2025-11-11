import { err, ok, ServerError } from '@read-every-word/foundation'
import { GetHealthCheck, GetHealthCheckResult } from '@read-every-word/domain'
import { publicProcedure } from '../../trpc.js'
import { Config } from '../../config.js'

export const getHealthCheckProcedure = publicProcedure
  .input(r => r as GetHealthCheck)
  .query(async ({ input, ctx }): Promise<GetHealthCheckResult> => {
    return handleGetHealthCheck(input, ctx.config)
  })

export async function handleGetHealthCheck(request: GetHealthCheck, config: Config): Promise<GetHealthCheckResult> {
  if (!config.tableStorageConnectionString) {
    return err(new ServerError('Table storage connection string is not configured'))
  }

  return ok([{
    name: 'Read Every Word Api',
    configured: true
  }])
}
