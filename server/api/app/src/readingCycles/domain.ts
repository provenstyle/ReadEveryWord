export interface ReadingCycle {
  authId: string
  id: string
  lastModified: string
  name: string
  dateStarted: string
  dateCompleted?: string
  default: boolean
}

export interface ReadingCycleRow {
  partitionKey: string,
  rowKey: string,
  timestamp: string,
  name: string
  dateStarted: string
  dateCompleted?: string
  default: boolean
}

export const map = (row: ReadingCycleRow): ReadingCycle => {
  return {
    authId: row.partitionKey,
    id: row.rowKey,
    lastModified: row.timestamp,
    name: row.name,
    dateStarted: row.dateStarted,
    dateCompleted: row.dateCompleted,
    default: row.default
  }
}

export interface CreateReadingCycle {
  authId: string
  name: string
  dateStarted: string
}

export interface GetReadingCycle {
  authId: string
}

export interface SetDefaultReadingCycle {
  authId: string
  id: string
}

export interface UpdateReadingCycle {
  authId: string
  id: string
  name?: string
  dateCompleted?: string
}