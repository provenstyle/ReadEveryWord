import { Result, GetFailed, CreateFailed, FailedToAcquireDataLock } from '@read-every-word/foundation'
import { ReadingCycle } from './readingCycle.js'
import { ReadingRecord } from './readingRecord.js'

export interface GetReadSummary {
  authId: string
}

export interface ReadingSummary {
  readingCycles: ReadingCycle[]
  readingRecords: ReadingRecord[]
}

export type GetReadSummarySucceeded =
  | ReadingSummary

export type GetReadSummaryFailed =
  | GetFailed
  | CreateFailed
  | FailedToAcquireDataLock

export type GetReadSummaryResult = Result<GetReadSummarySucceeded, GetReadSummaryFailed>
