import { AxiosInstance } from 'axios'
import {
  Result, ok, err,
  ValidationFailed,
  NotFound, ServerError,
  logAxiosError,
  UnexpectedResponseCode,
  UnexpectedHttpException,
  CreateFailed,
  GetFailed
} from '@read-every-word/infrastructure'

export class UserClient {
  axios: AxiosInstance

  constructor (axios: AxiosInstance) {
    this.axios = axios
  }

  async create(request: CreateUser): Promise<Result<User, CreateFailed>> {
    const uri = 'user'
    try {
      const result = await this.axios.post(uri, request)
      switch(result.status) {
        case 200: return ok(result.data)
        case 400: return err(result.data as ValidationFailed)
        case 500: return err(new ServerError())
        default: return err(new UnexpectedResponseCode(result.status))
      }
    } catch(e) {
      logAxiosError(e, uri)
      return err(new UnexpectedHttpException())

    }
  }

  async get(authId: string): Promise<Result<User, GetFailed>> {
    const uri = `user/${authId}`
    try {
      const result = await this.axios.get(uri)
      switch(result.status) {
        case 200: return ok(result.data)
        case 400: return err(result.data as ValidationFailed)
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

export interface User {
  authId: string
  id: string
  lastModified: string
  email: string
}

export interface CreateUser {
  authId: string
  email: string
}
