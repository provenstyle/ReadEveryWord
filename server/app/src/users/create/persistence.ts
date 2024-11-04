import { Result, err, ok, isErr } from '../../infrastructure/Result'
import { TableClient } from '@azure/data-tables'
import { Config } from '../../config'
import { CreateUser, UserData } from './handler'
import { v4 as uuid } from 'uuid'

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

  async createUser(request: CreateUser): Promise<Result<UserData, CreateFailed>> {
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

      await this.getTableClient().createEntity({
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
  ): Promise<Result<UserData[], PersistenceError>> {
    try {
      const allRows: UserRow[] = []
      const allRowsResult = this.getTableClient().listEntities<UserRow>({
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

export const map = (row: UserRow): UserData => {
  console.log(row)
  return {
    id: row.rowKey,
    lastModified: row.timestamp,
    authId: row.partitionKey,
    email: row.email
  }
}

export interface UserRow {
  partitionKey: string,
  rowKey: string,
  timestamp: string,
  email: string
}

export class PersistenceError {
  code = 'persistence-error' as const
  message = 'Unexpected error in persistence'
}

export class DuplicateAuthId {
  code = 'duplicate-auth-id' as const
  message = 'User with authId already exists'
}

export type CreateFailed =
  | PersistenceError
  | DuplicateAuthId
