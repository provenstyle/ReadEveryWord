import { AxiosInstance, AxiosError } from 'axios'
import {
  ok, err,
  logAxiosError,
  ServerError,
  UnexpectedResponseCode,
  UnexpectedHttpException,
  ValidationFailed,
  Unauthorized,
  NotFound
} from '@read-every-word/infrastructure'
import { GetHealthCheckResult } from '@read-every-word/domain'

export class HealthCheckClient {
  private configureAxios: () => Promise<AxiosInstance>

  constructor (configureAxios: () => Promise<AxiosInstance>) {
    this.configureAxios = configureAxios
  }

  async get(): Promise<GetHealthCheckResult> {
    const uri = 'healthCheck'
    try {
      const axios = await this.configureAxios()
      const result = await axios.get(uri)
      switch(result.status) {
        case 200: return ok(result.data)
        case 400: return err(result.data as ValidationFailed)
        case 401: return err(new Unauthorized())
        case 404: return err(new NotFound())
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
