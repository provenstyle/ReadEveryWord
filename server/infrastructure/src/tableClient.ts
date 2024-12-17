import { TableClient, RestError } from '@azure/data-tables'

const clients: Record<string, TableClient> = {}

export const cacheTableClient = (connectionString: string, table: string) => {
  if (!clients[table]) {
    clients[table] = TableClient.fromConnectionString(connectionString, table)
  }

  return clients[table]
}

export function resourceDoesNotExist (error: any) {
  return (
    error instanceof RestError &&
    error?.statusCode === 404 &&
    error?.message.includes('The specified resource does not exist.')
  )
}