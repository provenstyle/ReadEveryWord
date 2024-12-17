import { Result, CreateFailed, GetFailed, UpdateFailed} from '@read-every-word/infrastructure'

export interface ReadingCycle {
  authId: string
  id: string
  lastModified: string
  name: string
  dateStarted: string
  dateCompleted?: string
  default: boolean
}

export interface CreateReadingCycle {
  authId: string
  name: string
  dateStarted: string
}

export type CreateReadingCycleSucceeded =
  | ReadingCycle

export type CreateReadingCycleFailed =
  | CreateFailed

export type CreateReadingCycleResult = Result<CreateReadingCycleSucceeded, CreateReadingCycleFailed>

export interface GetReadingCycle {
  authId: string
}

export type GetReadingCycleSucceeded =
  | ReadingCycle[]

export type GetReadingCycleFailed =
  | GetFailed

export type GetReadingCycleResult = Result<GetReadingCycleSucceeded, GetReadingCycleFailed>

export interface SetDefaultReadingCycle {
  authId: string
  id: string
}

export type SetDefaultReadingCycleSucceeded =
  | ReadingCycle

export type SetDefaultReadingCycleFailed =
  | UpdateFailed

export type SetDefaultReadingCycleResult = Result<SetDefaultReadingCycleSucceeded, SetDefaultReadingCycleFailed>

export interface UpdateReadingCycle {
  authId: string
  id: string
  name?: string
  dateCompleted?: string
}

export type UpdateReadingCycleSucceeded =
  | ReadingCycle

export type UpdateReadingCycleFailed =
  | UpdateFailed

export type UpdateReadingCycleResult = Result<UpdateReadingCycleSucceeded, UpdateReadingCycleFailed>
