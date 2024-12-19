import { default as axiosStatic } from 'axios'
import { ServiceConfig } from './config'
import * as http from 'http'
import * as https from 'https'
import { UserClient } from './userClient'
import { ReadingCycleClient } from './readingCycleClient'
import { ReadingRecordClient } from './readingRecordClient'
import { HealthCheckClient } from './healthCheckClient'
import { ReadSummaryClient } from './readSummaryClient'

export class Client {
  user: UserClient
  readingCycle: ReadingCycleClient
  readingRecord: ReadingRecordClient
  healthCheck: HealthCheckClient
  readSummary: ReadSummaryClient

  constructor (serviceConfig: ServiceConfig) {
    const httpAgent = new http.Agent({ keepAlive: true })
    const httpsAgent = new https.Agent({ keepAlive: true })

    const protocol = process.env.http ? 'http' : 'https'
    const baseURL =  new URL('api', `${protocol}://${serviceConfig.baseUrl}`).href

    const axios = axiosStatic.create({
      httpAgent: httpAgent,
      httpsAgent: httpsAgent,
      baseURL,
      headers: {
        'x-functions-key': serviceConfig.subscriptionKey
      },
      validateStatus: (_) => true
    })

    this.user = new UserClient(axios)
    this.readingRecord = new ReadingRecordClient(axios)
    this.readingCycle = new ReadingCycleClient(axios)
    this.readSummary = new ReadSummaryClient(axios)
    this.healthCheck = new HealthCheckClient(axios)
  }
}
