import { Result, isErr, ok, GetFailed } from '@read-every-word/infrastructure'
import { Client, fromEnv } from '@read-every-word/client'

export async function handleGetHealthCheck(): Promise<GetHealthCheckResult> {
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

  return ok({})
}

export class HealthCheck {
}

export type GetHealthCheckSucceeded =
  | HealthCheck

export type GetHealthCheckFailed =
  | GetFailed

export type GetHealthCheckResult = Result<GetHealthCheckSucceeded, GetHealthCheckFailed>


