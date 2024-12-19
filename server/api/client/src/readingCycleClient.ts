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
  CreateReadingCycle, CreateReadingCycleResult,
  GetReadingCycle, GetReadingCycleResult,
  SetDefaultReadingCycle, SetDefaultReadingCycleResult,
  UpdateReadingCycle, UpdateReadingCycleResult
} from '@read-every-word/domain'

export class ReadingCycleClient {
  private axios: AxiosInstance

  constructor (axios: AxiosInstance) {
    this.axios = axios
  }

  async create(request: CreateReadingCycle): Promise<CreateReadingCycleResult> {
    const uri = 'readingCycle'
    try {
      const result = await this.axios.post(uri, request)
      switch(result.status) {
        case 200: return ok(result.data)
        case 400: return err(result.data as ValidationFailed)
        case 401: return err(new Unauthorized())
        case 404: return err(new NotFound())
        case 409: return err(new FailedToAcquireDataLock())
        case 500: return err(new ServerError())
        default: return err(new UnexpectedResponseCode(result.status))
      }
    } catch(e) {
      logAxiosError(e, uri)
      return err(new UnexpectedHttpException())
    }
  }

  async get(request: GetReadingCycle): Promise<GetReadingCycleResult> {
    const uri = `readingCycle/${request.authId}`
    try {
      const result = await this.axios.get(uri)
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

  async setDefault(request: SetDefaultReadingCycle): Promise<SetDefaultReadingCycleResult> {
    const uri = `readingCycle/default`
    try {
      const result = await this.axios.post(uri, request)
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

  async update(request: UpdateReadingCycle): Promise<UpdateReadingCycleResult> {
    const uri = `readingCycle`
    try {
      const result = await this.axios.patch(uri, request)
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
