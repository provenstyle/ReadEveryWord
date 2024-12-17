import { Result, err, ok, cacheTableClient, PersistenceError } from '@read-every-word/infrastructure'
import { TableClient, RestError } from '@azure/data-tables'
import { Config } from '../../config'
import { GetReadingRecord } from './handler'
import { ReadingRecord } from '@read-every-word/domain'
import { ReadingRecordRow, map } from '../domain'

export class Persistence {
  private tableClient: TableClient

  constructor (config: Config) {
    this.tableClient = cacheTableClient(config.tableStorageConnectionString, 'readingRecord')
  }

  async getReadingRecord(request: GetReadingRecord): Promise<Result<ReadingRecord[], CreateFailed>> {
    try {
      const allRows: ReadingRecordRow[] = []
      const allRowsResult = this.tableClient.listEntities<ReadingRecordRow>({
        queryOptions: {
          filter: `PartitionKey eq '${request.readingCycleId}'`
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

function resourceDoesNotExist (error) {
  return (
    error instanceof RestError &&
    error?.statusCode === 404 &&
    error?.message.includes('The specified resource does not exist.')
  )
}

export type CreateFailed =
  | PersistenceError
