import { Result, err, ok, isErr } from '../../infrastructure/Result'
import { TableClient, RestError } from '@azure/data-tables'
import { Config } from '../../config'
import { UpdateReadingCycle } from './handler'
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

  async updateReadingCycle(request: UpdateReadingCycle): Promise<Result<ReadingCycle, CreateFailed>> {
    try {
      const client = await this.getTableClient()

      const readingCycleRow = await client
        .getEntity<ReadingCycleRow>(request.authId, request.id)

      readingCycleRow.dateCompleted = request.dateCompleted

      await client.updateEntity<ReadingCycleRow>(readingCycleRow)

      return ok(map(readingCycleRow))

    } catch (e) {
      if (resourceDoesNotExist(e)) {
        return err(new ReadingCycleNotFoundError())
      }
      console.error('Unexpected error creating readingCycle', e)
      return err(new PersistenceError())
    }
  }
}

export class PersistenceError {
  code = 'persistence-error' as const
  message = 'Unexpected error in persistence'
}

export class ReadingCycleNotFoundError {
  code = 'row-not-found-error' as const
  message = 'ReadingCycle was not found'
}

export type CreateFailed =
  | PersistenceError
  | ReadingCycleNotFoundError


function resourceDoesNotExist (error) {
  return (
    error instanceof RestError &&
    error?.statusCode === 404 &&
    error?.message.includes('The specified resource does not exist.')
  )
}