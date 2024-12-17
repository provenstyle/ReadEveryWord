import { isErr, ok } from '@read-every-word/infrastructure'
import { GetHealthCheck, GetHealthCheckResult } from '@read-every-word/domain'
import { fromEnv } from '../config'

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
