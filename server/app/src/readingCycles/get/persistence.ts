import { Result, err, ok, isErr } from '../../infrastructure/Result'
import { TableClient } from '@azure/data-tables'
import { Config } from '../../config'
import { GetReadingCycle } from './handler'
import { ReadingCycle, ReadingCycleRow, map } from '../domain'

export class Persistence {
  private _tableClient: TableClient | undefined
  private readonly config: Config

  constructor (config: Config) {
      this.config = config
  }

  getTableClient () {
    if (!this._tableClient) {
      this._tableClient = TableClient.fromConnectionString(
        this.config.tableStorageConnectionString,
        'readingCycle'
      )
    }
    return this._tableClient
  }

  async getReadingCycle(request: GetReadingCycle): Promise<Result<ReadingCycle[], CreateFailed>> {
    try {
      const allRows: ReadingCycleRow[] = []
      const allRowsResult = this.getTableClient().listEntities<ReadingCycleRow>({
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

export class PersistenceError {
  code = 'persistence-error' as const
  message = 'Unexpected error in persistence'
}

export type CreateFailed =
  | PersistenceError
