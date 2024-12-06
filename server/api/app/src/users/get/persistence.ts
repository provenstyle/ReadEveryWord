import { Result, err, ok, cacheTableClient, PersistenceError } from '@read-every-word/infrastructure'
import { TableClient } from '@azure/data-tables'
import { Config } from '../../config'
import { GetUser } from './handler'
import { User, UserRow, map } from '../domain'

export class Persistence {
  private tableClient: TableClient

  constructor (config: Config) {
    this.tableClient = cacheTableClient(config.tableStorageConnectionString, 'user')
  }

  async getUser(request: GetUser): Promise<Result<User, GetFailed>> {
    try {
      const allRows: UserRow[] = []
      const allRowsResult = this.tableClient.listEntities<UserRow>({
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

export class UserNotFound {
  code = 'user-not-found' as const
  message = 'User was not found'
}

export type GetFailed =
  | PersistenceError
  | UserNotFound
