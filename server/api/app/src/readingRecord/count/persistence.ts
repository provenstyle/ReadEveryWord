import { Result, err, ok, cacheTableClient, PersistenceError } from '@read-every-word/infrastructure'
import { CountReadingRecord } from '@read-every-word/domain'
import { TableClient } from '@azure/data-tables'
import { Config } from '../../config'
import { ReadingRecordRow } from '../domain'

export class Persistence {
  private tableClient: TableClient

  constructor (config: Config) {
      this.tableClient = cacheTableClient(config.tableStorageConnectionString, 'readingRecord')
  }

  async countReadingRecords(request: CountReadingRecord): Promise<Result<number, CreateFailed>> {
    try {
      const partitionKey = `${request.authId}-${request.readingCycleId}`
      let count = 0
      const allRowsResult = this.tableClient.listEntities<ReadingRecordRow>({
        queryOptions: {
          filter: `PartitionKey eq '${partitionKey}'`,
          select: ['PartitionKey']
        }
      })
      for await (const row of allRowsResult) {
        count++
      }
      return ok(count)
    } catch (e) {
      console.error('Unexpected error counting readingRecords', e)
      return err(new PersistenceError())
    }
  }
}

export type CreateFailed =
  | PersistenceError
