import { Result, CreateFailed, DeleteFailed, GetFailed } from '@read-every-word/foundation'

export interface ReadingRecord {
  authId: string
  id?: string
  lastModified?: string
  readingCycleId?: string
  dateRead?: string
  bookId: number
  chapterId: number
}

export interface CreateReadingRecord {
  authId: string
  readingCycleId: string
  dateRead: string
  bookId: number
  chapterId: number
}

export type CreateReadingRecordSucceeded =
  | ReadingRecord

export type CreateReadingRecordFailed =
  | CreateFailed

export type CreateReadingRecordResult = Result<CreateReadingRecordSucceeded, CreateReadingRecordFailed>

export interface GetReadingRecord {
  authId: string
  readingCycleId: string
}

export type GetReadingRecordSucceeded =
  | ReadingRecord[]

export type GetReadingRecordFailed =
  | GetFailed

export type GetReadingRecordResult = Result<GetReadingRecordSucceeded, GetReadingRecordFailed>

export interface CountReadingRecord {
  authId: string
  readingCycleId: string
}

export type CountReadingRecordSucceeded =
  | number

export type CountReadingRecordFailed =
  | GetFailed

export type CountReadingRecordResult = Result<CountReadingRecordSucceeded, CountReadingRecordFailed>

export interface DeleteReadingRecord {
  authId: string
  readingCycleId: string
  bookId: number
  chapterId: number
}

export interface DeletedReadingRecord {
  authId: string
  readingCycleId?: string
  id?: string
  deleted: boolean
}

export type DeleteReadingRecordSucceeded =
  | DeletedReadingRecord

export type DeleteReadingRecordFailed =
  | DeleteFailed

export type DeleteReadingRecordResult = Result<DeleteReadingRecordSucceeded, DeleteReadingRecordFailed>
