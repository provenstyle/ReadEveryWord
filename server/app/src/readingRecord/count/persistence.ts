import { Result, err, ok, cacheTableClient } from '@read-every-word/infrastructure'
import { TableClient } from '@azure/data-tables'
import { Config } from '../../config'
import { CountReadingRecord } from './handler'
import { ReadingRecordRow } from '../domain'

export class Persistence {
  private tableClient: TableClient

  constructor (config: Config) {
      this.tableClient = cacheTableClient(config.tableStorageConnectionString, 'readingRecord')
  }

  async countReadingRecords(request: CountReadingRecord): Promise<Result<number, CreateFailed>> {
    try {
      let count = 0
      const allRowsResult = this.tableClient.listEntities<ReadingRecordRow>({
        queryOptions: {
          filter: `PartitionKey eq '${request.readingCycleId}'`,
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

export class PersistenceError {
  code = 'persistence-error' as const
  message = 'Unexpected error in persistence'
}

export type CreateFailed =
  | PersistenceError
