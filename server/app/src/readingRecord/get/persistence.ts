import { Result, err, ok, isErr } from '../../infrastructure/Result'
import { TableClient } from '@azure/data-tables'
import { Config } from '../../config'
import { GetReadingRecord } from './handler'
import { ReadingRecord, ReadingRecordRow, map } from '../domain'

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
        'readingRecord'
      )
    }
    return this._tableClient
  }

  async getReadingRecord(request: GetReadingRecord): Promise<Result<ReadingRecord[], CreateFailed>> {
    try {
      const allRows: ReadingRecordRow[] = []
      const allRowsResult = this.getTableClient().listEntities<ReadingRecordRow>({
        queryOptions: {
          filter: `PartitionKey eq '${request.readingCycleId}'`
        }
      })
      for await (const row of allRowsResult) {
        allRows.push(row)
      }
      return ok(allRows.map(u => map(u)))
    } catch (e) {
      console.error('Unexpected error creating readingRecord', e)
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
