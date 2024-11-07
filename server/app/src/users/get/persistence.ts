import { Result, err, ok, isErr } from '../../infrastructure/Result'
import { TableClient } from '@azure/data-tables'
import { Config } from '../../config'
import { GetUser } from './handler'
import { User, UserRow, map } from '../domain'

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
        'user'
      )
    }
    return this._tableClient
  }

  async getUser(request: GetUser): Promise<Result<User, GetFailed>> {
    try {
      const allRows: UserRow[] = []
      const allRowsResult = this.getTableClient().listEntities<UserRow>({
        queryOptions: {
          filter: `PartitionKey eq '${request.authId}'`
        }
      })
      for await (const row of allRowsResult) {
        allRows.push(row)
      }
      if (allRows.length < 1) {
        return err(new UserNotFound())
      }

      return ok(map(allRows[0]))
    } catch (e) {
      console.error('Unexpected error getting user', e)
      return err(new PersistenceError())
    }
  }
}

export class PersistenceError {
  code = 'persistence-error' as const
  message = 'Unexpected error in persistence'
}

export class UserNotFound {
  code = 'user-not-found' as const
  message = 'User was not found'
}

export type GetFailed =
  | PersistenceError
  | UserNotFound
