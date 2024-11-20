import { Result, err, ok, cacheTableClient } from '@read-every-word/infrastructure'
import { TableClient, RestError } from '@azure/data-tables'
import { Config } from '../../config'
import { UpdateReadingCycle } from './handler'
import { ReadingCycle, ReadingCycleRow, map } from '../domain'

export class Persistence {
  private readonly tableClient: TableClient

  constructor (config: Config) {
    this.tableClient = cacheTableClient(config.tableStorageConnectionString, 'readingCycle')
  }

  async updateReadingCycle(request: UpdateReadingCycle): Promise<Result<ReadingCycle, CreateFailed>> {
    try {
      const readingCycleRow = await this.tableClient
        .getEntity<ReadingCycleRow>(request.authId, request.id)

      readingCycleRow.dateCompleted = request.dateCompleted

      await this.tableClient.updateEntity<ReadingCycleRow>(readingCycleRow)

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