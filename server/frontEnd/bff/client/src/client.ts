import { default as axiosStatic } from 'axios'
import { ServiceConfig } from './config'
import * as http from 'http'
import * as https from 'https'
import { ReadClient } from './readClient'
import { HealthCheckClient } from './healthCheckClient'

export class Client {
  read: ReadClient
  healthCheck: HealthCheckClient

  constructor (serviceConfig: ServiceConfig, authToken: string) {
    const httpAgent = new http.Agent({ keepAlive: true })
    const httpsAgent = new https.Agent({ keepAlive: true })

    const protocol = process.env.http ? 'http' : 'https'
    const baseURL =  new URL('api', `${protocol}://${serviceConfig.baseUrl}`).href

    const axios = axiosStatic.create({
      httpAgent: httpAgent,
      httpsAgent: httpsAgent,
      baseURL,
      headers: {
        Authorization: `Bearer ${authToken}`
      },
      validateStatus: (_) => true
    })

    this.healthCheck = new HealthCheckClient(axios)
    this.read = new ReadClient(axios)
  }
}
