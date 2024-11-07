export interface User {
  authId: string
  id: string
  lastModified: string
  email: string
}

export interface UserRow {
  partitionKey: string,
  rowKey: string,
  timestamp: string,
  email: string
}

export const map = (row: UserRow): User=> {
  return {
    id: row.rowKey,
    lastModified: row.timestamp,
    authId: row.partitionKey,
    email: row.email
  }
}
