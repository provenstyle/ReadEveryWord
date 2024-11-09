import { AxiosInstance, AxiosError } from 'axios'
import { Result, ok, err } from '../Result'
import { ValidationFailed, NotFound, ServerError } from './httpResponses'
import { logAxiosError } from './log'

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
        default: return err(new ServerError())
      }
    } catch(e) {
      logAxiosError(e, uri)
      return err(e as AxiosError)
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
        default: return err(new ServerError())
      }
    } catch (e) {
      logAxiosError(e, uri)
      return err(e as AxiosError)
    }
  }
}

export interface User {
  authId: string
  id: string
  lastModified: string
  email: string
}

export type GetFailed =
  | AxiosError
  | ValidationFailed
  | NotFound
  | ServerError

export interface CreateUser {
  authId: string
  email: string
}

export type CreateFailed =
  | AxiosError
  | ValidationFailed
  | NotFound
  | ServerError