import { isErr, ok } from '@read-every-word/infrastructure'
import { Client, fromEnv } from '@read-every-word/client'
import { GetHealthCheck, GetHealthCheckResult} from '@read-every-word/domain'

export async function handleGetHealthCheck(request: GetHealthCheck): Promise<GetHealthCheckResult> {
  const configResponse = fromEnv()
  if(isErr(configResponse)) {
    return configResponse
  }
  const config = configResponse.data

  const client = new Client(config.service)

  const healthCheckResponse = await client.healthCheck.get()
  if (isErr(healthCheckResponse)) {
    return healthCheckResponse
  }
  const healthCheck = healthCheckResponse.data

  return ok([
    ...healthCheck,
    {
      name: 'Read Every Word BFF',
      configured: true
    }
  ])
}
