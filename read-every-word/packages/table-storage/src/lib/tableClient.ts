import { TableClient, RestError } from '@azure/data-tables'

const clients: Record<string, TableClient> = {}

export const cacheTableClient = (connectionString: string, table: string) => {
  if (!clients[table]) {
    clients[table] = TableClient.fromConnectionString(connectionString, table)
  }

  return clients[table]
}

export function resourceDoesNotExist (error: any): boolean {
  return (
    error instanceof RestError &&
    error?.statusCode === 404 &&
    error?.message.includes('The specified resource does not exist.')
  )
}

export function entityAlreadyExist (error: any): boolean {
  return (
    error instanceof RestError &&
    error?.statusCode === 409 &&
    error?.message.includes('The specified entity already exists.')
  )
}