import { AxiosInstance } from 'axios'
import {
  Result, ok, err,
  ValidationFailed,
  NotFound, ServerError,
  logAxiosError,
  UnexpectedResponseCode,
  UnexpectedHttpException,
  CreateFailed,
  GetFailed,
} from '@read-every-word/infrastructure'

export class ReadingRecordClient {
  axios: AxiosInstance

  constructor (axios: AxiosInstance) {
    this.axios = axios
  }

  async create(request: CreateReadingRecord): Promise<Result<ReadingRecord, CreateFailed>> {
    const uri = 'readingRecord'
    try {
      const result = await this.axios.post(uri, request)
      switch(result.status) {
        case 200: return ok(result.data)
        case 400: return err(result.data as ValidationFailed)
        case 500: return err(new ServerError())
        default: return err(new UnexpectedResponseCode())
      }
    } catch(e) {
      logAxiosError(e, uri)
      return err(new UnexpectedHttpException())
    }
  }

  async get(request: GetReadingRecord): Promise<Result<ReadingRecord[], GetFailed>> {
    const uri = `readingRecord/${request.readingCycleId}`
    try {
      const result = await this.axios.get(uri)
      switch(result.status) {
        case 200: return ok(result.data)
        case 400: return err(result.data as ValidationFailed)
        case 404: return err(new NotFound())
        case 500: return err(new ServerError())
        default: return err(new UnexpectedResponseCode())
      }
    } catch (e) {
      logAxiosError(e, uri)
      return err(new UnexpectedHttpException())
    }
  }

  async count(request: CountReadingRecord): Promise<Result<number, GetFailed>> {
    const uri = `readingRecord/${request.readingCycleId}/count`
    try {
      const result = await this.axios.get(uri)
      switch(result.status) {
        case 200: return ok(result.data)
        case 400: return err(result.data as ValidationFailed)
        case 404: return err(new NotFound())
        case 500: return err(new ServerError())
        default: return err(new UnexpectedResponseCode())
      }
    } catch (e) {
      logAxiosError(e, uri)
      return err(new UnexpectedHttpException())
    }
  }
}

export interface ReadingRecord {
  readingCycleId: string
  id: string
  lastModified: string
  dateRead: string
  bookId: number
  chapterId: number
}

export interface CreateReadingRecord {
  readingCycleId: string
  dateRead: string
  bookId: number
  chapterId: number
}

export interface GetReadingRecord {
  readingCycleId: string
}

export interface CountReadingRecord {
  readingCycleId: string
}
