import { ReadingCycle } from '@read-every-word/domain'

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
