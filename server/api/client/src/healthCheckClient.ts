import { AxiosInstance, AxiosError } from 'axios'
import {
  Result, ok, err,
  logAxiosError,
  GetFailed,
  ServerError,
  UnexpectedResponseCode,
  UnexpectedHttpException
} from '@read-every-word/infrastructure'

export class HealthCheckClient {
  axios: AxiosInstance

  constructor (axios: AxiosInstance) {
    this.axios = axios
  }

  async get(): Promise<Result<HealthCheckSucceeded, GetFailed>> {
    const uri = 'healthCheck'
    try {
      const result = await this.axios.get(uri)
      switch(result.status) {
        case 200: return ok(new HealthCheckSucceeded())
        case 500: return err(new ServerError())
        default: return err(new UnexpectedResponseCode(result.status))
      }
    } catch (e) {
      logAxiosError(e, uri)
      return err(new UnexpectedHttpException())
    }
  }
}

export class HealthCheckSucceeded {
}
