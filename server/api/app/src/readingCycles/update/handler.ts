import { Result, isErr, ok, InvalidConfiguration, ValidationFailed, UpdateFailed } from '@read-every-word/infrastructure'
import { validate } from './validation'
import { Persistence } from '../persistence'
import { fromEnv } from '../../config'
import { ReadingCycle, UpdateReadingCycle } from '../domain'

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

export type UpdateReadingCycleSucceeded =
  | ReadingCycle

export type UpdateReadingCycleFailed =
  | InvalidConfiguration
  | ValidationFailed
  | UpdateFailed

export type UpdateReadingCycleResult = Result<UpdateReadingCycleSucceeded, UpdateReadingCycleFailed>


