import { Result, isErr, ok, InvalidConfiguration } from '@read-every-word/infrastructure'
import { ValidationFailed, InvalidSchema } from '../../infrastructure/Validation'
import { validate } from './validation'
import { Persistence, CreateFailed } from './persistence'
import { fromEnv } from '../../config'
import { ReadingCycle } from '../domain'

export async function handleUpdateReadingCycle(request: UpdateReadingCycle): Promise<UpdateReadingCycleResult> {
  const configResponse = fromEnv()
  if(isErr(configResponse)) {
    return configResponse
  }
  const config = configResponse.data

  const validationResponse = await validate(request)
  if(isErr(validationResponse)) {
    return validationResponse
  }

  const persistence = new Persistence(config)
  const updateReadingCycleResponse = await persistence.updateReadingCycle(request)
  if (isErr(updateReadingCycleResponse)) {
    return updateReadingCycleResponse
  }
  const readingCycle = updateReadingCycleResponse.data

  return ok(readingCycle)
}

export interface UpdateReadingCycle {
  authId: string
  id: string
  dateCompleted: string
}

export type UpdateReadingCycleSucceeded =
  | ReadingCycle

export type UpdateReadingCycleFailed =
  | InvalidConfiguration
  | ValidationFailed<InvalidSchema>
  | CreateFailed

export type UpdateReadingCycleResult = Result<UpdateReadingCycleSucceeded, UpdateReadingCycleFailed>


