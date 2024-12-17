import { isErr, ok } from '@read-every-word/infrastructure'
import { fromEnv } from '../config'
import { GetHealthCheck, GetHealthCheckResult } from '@read-every-word/domain'

export async function handleGetHealthCheck(request: GetHealthCheck): Promise<GetHealthCheckResult> {
  const configResponse = fromEnv()
  if(isErr(configResponse)) {
    return configResponse
  }

  return ok([
    {
      name: 'Read Every Word Api',
      configured: true
    }
  ])
}
