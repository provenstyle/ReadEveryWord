import { Result, err, ok, isErr, cacheTableClient, PersistenceError } from '@read-every-word/infrastructure'
import { TableClient } from '@azure/data-tables'
import { Config } from '../../config'
import { CreateUser } from './handler'
import { v4 as uuid } from 'uuid'
import { User, UserRow, map } from '../domain'

export class Persistence {
  private tableClient: TableClient

  constructor (config: Config) {
     this.tableClient = cacheTableClient(config.tableStorageConnectionString, 'user')
  }

  async createUser(request: CreateUser): Promise<Result<User, CreateFailed>> {
    try {
      const rowsResult = await this.getAllRows(request.authId)
      if (isErr(rowsResult)) {
        return rowsResult
      }
      const rows = rowsResult.data

      const existingAuthId = rows.find(x => x.authId === request.authId)
      if (existingAuthId) {
        return err(new DuplicateAuthId())
      }

      const rowKey = uuid()

      await this.tableClient.createEntity({
        partitionKey: request.authId,
        rowKey,
        email: request.email
      })

      return ok({
        id: rowKey,
        lastModified: '',
        authId: request.authId,
        email: request.email
      })
    } catch (e) {
      console.error('Unexpected error creating user', e)
      return err(new PersistenceError())
    }
  }

  async getAllRows (
    authId: string
  ): Promise<Result<User[], PersistenceError>> {
    try {
      const allRows: UserRow[] = []
      const allRowsResult = this.tableClient.listEntities<UserRow>({
        queryOptions: {
          filter: `PartitionKey eq '${authId}'`
        }
      })
      for await (const row of allRowsResult) {
        allRows.push(row)
      }
      return ok(allRows.map(u => map(u)))
    } catch (e) {
      console.error('Unexpected error getting all rows', e)
      return err(new PersistenceError())
    }
  }
}

export class DuplicateAuthId {
  code = 'duplicate-auth-id' as const
  message = 'User with authId already exists'
}

export type CreateFailed =
  | PersistenceError
  | DuplicateAuthId
