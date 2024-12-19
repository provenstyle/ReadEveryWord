import { default as axiosStatic, AxiosInstance } from 'axios'
import { ServiceConfig } from './config'
import * as http from 'http'
import * as https from 'https'
import { ReadSummaryClient } from './readSummaryClient'
import { HealthCheckClient } from './healthCheckClient'
import { ReadingRecordClient } from './readingRecordClient'

export class Client {
  private httpAgent: http.Agent = new http.Agent({ keepAlive: true })
  private httpsAgent: https.Agent = new https.Agent({ keepAlive: true })
  private baseUrl: string
  private getAuthToken: () => Promise<string>
  healthCheck: HealthCheckClient
  readSummary: ReadSummaryClient
  readingRecord: ReadingRecordClient

  constructor (serviceConfig: ServiceConfig, getAuthToken: () => Promise<string>) {
    const protocol = process.env.http ? 'http' : 'https'
    this.baseUrl = new URL('api', `${protocol}://${serviceConfig.baseUrl}`).href
    this.getAuthToken = getAuthToken

    this.healthCheck = new HealthCheckClient(this.configureAxios)
    this.readSummary = new ReadSummaryClient(this.configureAxios)
    this.readingRecord = new ReadingRecordClient(this.configureAxios)
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
}
