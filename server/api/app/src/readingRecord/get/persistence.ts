import { Result, err, ok, cacheTableClient, PersistenceError, resourceDoesNotExist } from '@read-every-word/infrastructure'
import { GetReadingRecord } from '@read-every-word/domain'
import { TableClient } from '@azure/data-tables'
import { Config } from '../../config'
import { ReadingRecord } from '@read-every-word/domain'
import { ReadingRecordRow, map } from '../domain'

export class Persistence {
  private tableClient: TableClient

  constructor (config: Config) {
    this.tableClient = cacheTableClient(config.tableStorageConnectionString, 'readingRecord')
  }

  async getReadingRecord(request: GetReadingRecord): Promise<Result<ReadingRecord[], CreateFailed>> {
    try {
      const partitionKey = `${request.authId}-${request.readingCycleId}`
      const allRows: ReadingRecordRow[] = []
      const allRowsResult = this.tableClient.listEntities<ReadingRecordRow>({
        queryOptions: {
          filter: `PartitionKey eq '${partitionKey}'`
        }
      })
      for await (const row of allRowsResult) {
        allRows.push(row)
      }
      return ok(allRows.map(u => map(u)))
    } catch (e) {
      if (resourceDoesNotExist(e)) {
        return ok([])
      }
      console.error('Unexpected error creating readingRecord', e)
      return err(new PersistenceError())
    }
  }
}

export type CreateFailed =
  | PersistenceError
