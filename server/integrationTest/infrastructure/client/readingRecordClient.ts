import { AxiosInstance, AxiosError } from 'axios'
import { NotFound, ServerError } from './httpResponses'
import { logAxiosError } from './log'
import { Result, ok, err, ValidationFailed} from '@read-every-word/library'

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
        default: return err(new ServerError())
      }
    } catch(e) {
      logAxiosError(e, uri)
      return err(e as AxiosError)
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
        default: return err(new ServerError())
      }
    } catch (e) {
      logAxiosError(e, uri)
      return err(e as AxiosError)
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

export type CreateFailed =
  | AxiosError
  | ValidationFailed
  | NotFound
  | ServerError

export interface GetReadingRecord {
  readingCycleId: string
}

export type GetFailed =
  | AxiosError
  | ValidationFailed
  | NotFound
  | ServerError