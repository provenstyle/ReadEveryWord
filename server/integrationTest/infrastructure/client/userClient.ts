import { AxiosInstance, AxiosError } from 'axios'
import { Result, ok, err } from '../Result'
import { ValidationFailed, NotFound, ServerError } from './httpResponses'

export class UserClient {
  axios: AxiosInstance

  constructor (axios: AxiosInstance) {
    this.axios = axios
  }

  async create(request: CreateUser): Promise<Result<User, GetFailed>> {
    const result = await this.axios.post(`user`, request)
    return ok(result.data)
  }

  async get(authId: string): Promise<Result<User, GetFailed>> {
    try {
      const result = await this.axios.get(`user/${authId}`)
      switch(result.status) {
        case 200: return ok(result.data)
        case 400: return err(result.data as ValidationFailed)
        case 404: return err(new NotFound())
        default: return err(new ServerError())
      }
    } catch (e) {
      //Do some logging here
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
