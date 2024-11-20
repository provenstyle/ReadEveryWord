import { TableClient } from '@azure/data-tables'

const clients: Record<string, TableClient> = {}

export const cacheTableClient = (connectionString: string, table: string) => {
  if (!clients[table]) {
    clients[table] = TableClient.fromConnectionString(connectionString, table)
  }

  return clients[table]
}
