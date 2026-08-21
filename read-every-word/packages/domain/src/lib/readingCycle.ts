import { Result, CreateFailed, GetFailed, UpdateFailed, FailedToAcquireDataLock } from '@read-every-word/foundation'

export interface ReadingCycle {
  id: string
  lastModified: string
  name: string
  dateStarted: string
  dateCompleted?: string
  default: boolean
}

export interface CreateReadingCycle {
  name: string
  dateStarted: string
}

export type CreateReadingCycleSucceeded =
  | ReadingCycle

export type CreateReadingCycleFailed =
  | CreateFailed
  | FailedToAcquireDataLock

export type CreateReadingCycleResult = Result<CreateReadingCycleSucceeded, CreateReadingCycleFailed>

export type GetReadingCycleSucceeded =
  | ReadingCycle[]

export type GetReadingCycleFailed =
  | GetFailed

export type GetReadingCycleResult = Result<GetReadingCycleSucceeded, GetReadingCycleFailed>

export interface SetDefaultReadingCycle {
  id: string
}

export type SetDefaultReadingCycleSucceeded =
  | ReadingCycle

export type SetDefaultReadingCycleFailed =
  | UpdateFailed

export type SetDefaultReadingCycleResult = Result<SetDefaultReadingCycleSucceeded, SetDefaultReadingCycleFailed>

export interface UpdateReadingCycle {
  id: string
  name?: string
  /**
   * Absent leaves the stored value alone; a date sets it; **null clears it**,
   * reopening a completed cycle for editing.
   *
   * The three states are why this is nullable rather than optional-only: absent and
   * "make it empty" have to be tellable apart, and the response type keeps
   * dateCompleted as `string | undefined` because a cleared value comes back missing.
   */
  dateCompleted?: string | null
}

export type UpdateReadingCycleSucceeded =
  | ReadingCycle

export type UpdateReadingCycleFailed =
  | UpdateFailed

export type UpdateReadingCycleResult = Result<UpdateReadingCycleSucceeded, UpdateReadingCycleFailed>
