import { AxiosInstance, AxiosError } from 'axios'
import {
  Result, ok, err,
  ValidationFailed,
  logAxiosError,
  NotFound, ServerError
} from '@read-every-word/infrastructure'
import {
  CreateFailed,
  GetFailed,
  UpdateFailed
} from './httpResults'

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
        default: return err(new ServerError())
      }
    } catch(e) {
      logAxiosError(e, uri)
      return err(e as AxiosError)
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
        default: return err(new ServerError())
      }
    } catch (e) {
      logAxiosError(e, uri)
      return err(e as AxiosError)
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
        default: return err(new ServerError())
      }
    } catch (e) {
      logAxiosError(e, uri)
      return err(e as AxiosError)
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