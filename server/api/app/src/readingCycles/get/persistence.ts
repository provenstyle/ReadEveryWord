import { Result, err, ok, cacheTableClient, PersistenceError } from '@read-every-word/infrastructure'
import { TableClient } from '@azure/data-tables'
import { Config } from '../../config'
import { GetReadingCycle } from './handler'
import { ReadingCycle, ReadingCycleRow, map } from '../domain'

export class Persistence {
  private tableClient: TableClient

  constructor (config: Config) {
      this.tableClient = cacheTableClient(config.tableStorageConnectionString, 'readingCycle')
  }

  async getReadingCycle(request: GetReadingCycle): Promise<Result<ReadingCycle[], GetFailed>> {
    try {
      const allRows: ReadingCycleRow[] = []
      const allRowsResult = this.tableClient.listEntities<ReadingCycleRow>({
        queryOptions: {
          filter: `PartitionKey eq '${request.authId}'`
        }
      })
      for await (const row of allRowsResult) {
        allRows.push(row)
      }
      return ok(allRows.map(u => map(u)))
    } catch (e) {
      console.error('Unexpected error creating readingCycle', e)
      return err(new PersistenceError())
    }
  }
}

export type GetFailed =
  | PersistenceError
