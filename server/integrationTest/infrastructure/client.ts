import { default as axiosStatic, AxiosError, AxiosInstance } from 'axios'
import { ServiceConfig } from './config'
import * as http from 'http'
import * as https from 'https'
import { Result, ok, err } from './Result'

export class UserClient {
  axios: AxiosInstance

  constructor (serviceConfig: ServiceConfig) {
    const httpAgent = new http.Agent({ keepAlive: true })
    const httpsAgent = new https.Agent({ keepAlive: true })

    const protocol = process.env.http ? 'http' : 'https'
    const baseURL =  new URL('api', `${protocol}://${serviceConfig.baseUrl}`).href
    console.log('UsersClient baseUrl', baseURL)

    this.axios = axiosStatic.create({
      httpAgent: httpAgent,
      httpsAgent: httpsAgent,
      baseURL,
      headers: {
        'x-functions-key': serviceConfig.subscriptionKey
      },
      validateStatus: (_) => true
    })
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
        case 400: return err(new InvalidRequest())
        case 404: return err(new UserNotFound())
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
  | InvalidRequest
  | UserNotFound
  | ServerError

export interface CreateUser {
  authId: string
  email: string
}

export class InvalidRequest {
  code = 'validation-failed' as const
  message = 'Request failed validation'
}

export class UserNotFound {
  code = 'server-error' as const
  message = 'Unexpected server error'
}

export class ServerError {
  code = 'server-error' as const
  message = 'Unexpected server error'
}