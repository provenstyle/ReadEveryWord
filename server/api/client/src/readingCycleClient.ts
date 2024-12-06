import { AxiosInstance } from 'axios'
import {
  Result, ok, err,
  ValidationFailed,
  logAxiosError,
  NotFound, ServerError,
  UnexpectedResponseCode,
  UnexpectedHttpException,
  CreateFailed,
  GetFailed,
  UpdateFailed
} from '@read-every-word/infrastructure'

export class ReadingCycleClient {
  axios: AxiosInstance

  constructor (axios: AxiosInstance) {
    this.axios = axios
  }

  async create(request: CreateReadingCycle): Promise<Result<ReadingCycle, CreateFailed>> {
    const uri = 'readingCycle'
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

  async get(request: GetReadingCycle): Promise<Result<ReadingCycle[], GetFailed>> {
    const uri = `readingCycle/${request.authId}`
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

  async update(request: UpdateReadingCycle): Promise<Result<ReadingCycle, UpdateFailed>> {
    const uri = `readingCycle`
    try {
      const result = await this.axios.patch(uri, request)
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

export interface ReadingCycle {
  authId: string
  id: string
  lastModified: string
  dateStarted: string
  dateCompleted?: string
}

export interface CreateReadingCycle {
  authId: string
  dateStarted: string
  dateCompleted?: string
}

export interface GetReadingCycle {
  authId: string
}

export interface UpdateReadingCycle {
  authId: string
  id: string
  dateCompleted: string
}
