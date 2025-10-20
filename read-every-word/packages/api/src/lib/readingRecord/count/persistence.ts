import { Result, err, ok, PersistenceError  } from '@read-every-word/foundation'
import { cacheTableClient } from '@read-every-word/table-storage'
import { CountReadingRecord } from '@read-every-word/domain'
import { TableClient } from '@azure/data-tables'
import { Config } from '../../config.js' 
import { ReadingRecordRow } from '../domain.js'

export class Persistence {
  private tableClient: TableClient

  constructor (config: Config) {
      this.tableClient = cacheTableClient(config.tableStorageConnectionString, 'readingRecord')
  }

  async countReadingRecords(request: CountReadingRecord): Promise<Result<number, PersistenceError>> {
    try {
      const partitionKey = `${request.authId}-${request.readingCycleId}`
      let count = 0
      const allRowsResult = this.tableClient.listEntities<ReadingRecordRow>({
        queryOptions: {
          filter: `PartitionKey eq '${partitionKey}'`,
          select: ['PartitionKey']
        }
      })
      for await (const _ of allRowsResult) {
        count++
      }
      return ok(count)
    } catch (e) {
      console.error('Unexpected error counting readingRecords', e)
      return err(new PersistenceError())
    }
  }
}
