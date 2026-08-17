import { Result, err, ok, PersistenceError } from '@read-every-word/foundation'
import { cacheTableClient, resourceDoesNotExist } from '@read-every-word/table-storage'
import { type GetReadingRecord, type ReadingRecord } from '@read-every-word/domain'
import { TableClient } from '@azure/data-tables'
import { type ReadingRecordRow, map } from '../domain.js'
import { Config } from '../../config.js'
import { type Authenticated } from '../../trpc.js'

export class Persistence {
  private tableClient: TableClient

  constructor (config: Config) {
    this.tableClient = cacheTableClient(config.tableStorageConnectionString, 'readingRecord')
  }

  async getReadingRecord(authenticated: Authenticated<GetReadingRecord>): Promise<Result<ReadingRecord[], CreateFailed>> {
    const { request, principal } = authenticated
    try {
      const partitionKey = `${principal.authId}-${request.readingCycleId}`
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
