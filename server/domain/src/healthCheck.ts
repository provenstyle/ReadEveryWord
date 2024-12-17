import { Result, GetFailed } from '@read-every-word/infrastructure'

export interface HealthCheck {
  name: string
  configured: boolean
}

export interface GetHealthCheck {
}

export type GetHealthCheckSucceeded =
  | HealthCheck[]

export type GetHealthCheckFailed =
  | GetFailed

export type GetHealthCheckResult = Result<GetHealthCheckSucceeded, GetHealthCheckFailed>
