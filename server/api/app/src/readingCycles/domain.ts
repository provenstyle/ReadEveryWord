export interface ReadingCycle {
  authId: string
  id: string
  lastModified: string
  dateStarted: string
  dateCompleted?: string
  default: boolean
}

export interface ReadingCycleRow {
  partitionKey: string,
  rowKey: string,
  timestamp: string,
  dateStarted: string
  dateCompleted?: string
  default: boolean
}

export const map = (row: ReadingCycleRow): ReadingCycle => {
  return {
    id: row.rowKey,
    lastModified: row.timestamp,
    authId: row.partitionKey,
    dateStarted: row.dateStarted,
    dateCompleted: row.dateCompleted,
    default: row.default
  }
}