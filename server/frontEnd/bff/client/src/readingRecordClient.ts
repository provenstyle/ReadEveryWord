import { AxiosInstance } from 'axios'
import {
  ok, err,
  ValidationFailed,
  logAxiosError,
  NotFound, ServerError,
  UnexpectedResponseCode,
  UnexpectedHttpException,
  Unauthorized,
} from '@read-every-word/infrastructure'
import { CreateReadingRecordResult, DeleteReadingRecordResult } from '@read-every-word/domain'

export class ReadingRecordClient {
  configureAxios: () => Promise<AxiosInstance>

  constructor (configureAxios: () => Promise<AxiosInstance>) {
    this.configureAxios = configureAxios
  }

  async create(request: CreateReadingRecord): Promise<CreateReadingRecordResult> {
    const uri = 'readingRecord'
    try {
      const axios = await this.configureAxios()
      const result = await axios.post(uri, request)
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

  async delete(request: DeleteReadingRecord): Promise<DeleteReadingRecordResult> {
    const uri = 'readingRecord'
    try {
      const axios = await this.configureAxios()
      const result = await axios.delete(uri, {
        data: request
      })
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

// These versions of the requests are slightly different from the domain version as it does not need the authId
// That will be retrieved from the Auth token in Authentication header
export interface CreateReadingRecord {
  readingCycleId: string
  dateRead: string
  bookId: number
  chapterId: number
}

export interface DeleteReadingRecord {
  readingCycleId: string
  bookId: number
  chapterId: number
}
