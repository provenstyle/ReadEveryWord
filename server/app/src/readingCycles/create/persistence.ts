import { Result, err, ok } from '../../infrastructure/Result'
import { TableClient } from '@azure/data-tables'
import { Config } from '../../config'
import { CreateReadingCycle } from './handler'
import { v4 as uuid } from 'uuid'
import { ReadingCycle } from '../domain'

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

  async createReadingCycle(request: CreateReadingCycle): Promise<Result<ReadingCycle, CreateFailed>> {
    try {
      const rowKey = uuid()

      await this.getTableClient().createEntity({
        partitionKey: request.authId,
        rowKey,
        dateStarted: request.dateStarted,
        dateCompleted: request.dateCompleted
      })

      return ok({
        id: rowKey,
        lastModified: '',
        authId: request.authId,
        dateStarted: request.dateStarted,
        dateCompleted: request.dateCompleted
      })
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
