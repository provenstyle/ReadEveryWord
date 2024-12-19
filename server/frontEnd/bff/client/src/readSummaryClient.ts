import { AxiosInstance } from 'axios'
import {
  Result, ok, err,
  ValidationFailed,
  logAxiosError,
  NotFound, ServerError,
  UnexpectedResponseCode,
  UnexpectedHttpException,
  Unauthorized,
  GetFailed,
} from '@read-every-word/infrastructure'

export class ReadSummaryClient {
  private configureAxios: () => Promise<AxiosInstance>

  constructor (configureAxios: () => Promise<AxiosInstance>) {
    this.configureAxios = configureAxios
  }

  async get(): Promise<Result<ReadingSummary, GetFailed>> {
    const uri = 'read'
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

export interface ReadingSummary {
  readingCycles: ReadingCycle[]
  readingRecords: ReadingRecord[]
}

export interface ReadingCycle {
  authId: string
  id: string
  lastModified: string
  name: string
  dateStarted: string
  dateCompleted?: string
  default: boolean
}

export interface ReadingRecord {
  readingCycleId: string
  id: string
  lastModified: string
  dateRead: string
  bookId: number
  chapterId: number
}