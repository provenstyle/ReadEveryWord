import { default as axiosStatic, AxiosInstance } from 'axios'
import { ServiceConfig } from './config'
import * as http from 'http'
import * as https from 'https'
import { ReadClient } from './readClient'
import { HealthCheckClient } from './healthCheckClient'
import { ReadingRecordClient } from './readingRecordClient'

export class Client {
  httpAgent: http.Agent = new http.Agent({ keepAlive: true })
  httpsAgent: https.Agent = new https.Agent({ keepAlive: true })
  baseUrl: string
  getAuthToken: () => Promise<string>

  constructor (serviceConfig: ServiceConfig, getAuthToken: () => Promise<string>) {
    const protocol = process.env.http ? 'http' : 'https'
    this.baseUrl = new URL('api', `${protocol}://${serviceConfig.baseUrl}`).href
    this.getAuthToken = getAuthToken
  }

  configureAxios = async (): Promise<AxiosInstance> => {
    const authToken = await this.getAuthToken()
    return axiosStatic.create({
      httpAgent: this.httpAgent,
      httpsAgent: this.httpsAgent,
      baseURL: this.baseUrl,
      headers: {
        Authorization: `Bearer ${authToken}`
      },
      validateStatus: (_) => true
    })
  }

  healthCheck = (): HealthCheckClient => {
    return new HealthCheckClient(this.configureAxios)
  }

  readClient = (): ReadClient => {
    return new ReadClient(this.configureAxios)
  }

  readingRecordClient = (): ReadingRecordClient => {
    return new ReadingRecordClient(this.configureAxios)
  }
}
