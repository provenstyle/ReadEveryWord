import { AxiosInstance } from 'axios'
import {
  ok, err,
  ValidationFailed,
  logAxiosError,
  NotFound, ServerError,
  UnexpectedResponseCode,
  UnexpectedHttpException,
  Unauthorized,
  FailedToAcquireDataLock
} from '@read-every-word/infrastructure'

import {
  GetReadSummaryResult
} from '@read-every-word/domain'

export class ReadSummaryClient {
  private configureAxios: () => Promise<AxiosInstance>

  constructor (configureAxios: () => Promise<AxiosInstance>) {
    this.configureAxios = configureAxios
  }

  async get(): Promise<GetReadSummaryResult> {
    const uri = 'read'
    try {
      const axios = await this.configureAxios()
      const result = await axios.get(uri)
      switch(result.status) {
        case 200: return ok(result.data)
        case 400: return err(result.data as ValidationFailed)
        case 401: return err(new Unauthorized())
        case 404: return err(new NotFound())
        case 409: return err(new FailedToAcquireDataLock())
        case 500: return err(new ServerError())
        default: return err(new UnexpectedResponseCode(result.status))
      }
    } catch (e) {
      logAxiosError(e, uri)
      return err(new UnexpectedHttpException())
    }
  }
}
