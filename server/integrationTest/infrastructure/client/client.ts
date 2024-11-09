import { default as axiosStatic, AxiosInstance } from 'axios'
import { ServiceConfig } from '../config'
import * as http from 'http'
import * as https from 'https'
import { UserClient } from './userClient'

export class Client {
  axios: AxiosInstance
  user: UserClient

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

    this.user = new UserClient(this.axios)
  }
}
