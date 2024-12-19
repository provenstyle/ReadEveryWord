import { default as axiosStatic, AxiosInstance } from 'axios'
import { ReadSummaryClient } from './readSummaryClient'
import { HealthCheckClient } from './healthCheckClient'
import { ReadingRecordClient } from './readingRecordClient'

// this client is optimized for the fronted web browser environment
// if has no concept of process.env or http.Agent
export class Client {
  private baseUrl: string
  private getAuthToken: () => Promise<string>
  healthCheck: HealthCheckClient
  readSummary: ReadSummaryClient
  readingRecord: ReadingRecordClient

  constructor (baseUrl: string, getAuthToken: () => Promise<string>) {
    this.baseUrl = new URL('api', baseUrl).href
    this.getAuthToken = getAuthToken

    this.healthCheck = new HealthCheckClient(this.configureAxios)
    this.readSummary = new ReadSummaryClient(this.configureAxios)
    this.readingRecord = new ReadingRecordClient(this.configureAxios)
  }

  configureAxios = async (): Promise<AxiosInstance> => {
    const authToken = await this.getAuthToken()
    return axiosStatic.create({
      baseURL: this.baseUrl,
      headers: {
        Authorization: `Bearer ${authToken}`
      },
      validateStatus: (_) => true
    })
  }
}
