import { Result, isErr, ok, InvalidConfiguration } from '@read-every-word/infrastructure'
import { ValidationFailed, InvalidSchema } from '../../infrastructure/Validation'
import { validate } from './validation'
import { Persistence, GetFailed } from './persistence'
import { fromEnv } from '../../config'
import { ReadingCycle } from '../domain'

export async function handleGetReadingCycle(request: GetReadingCycle): Promise<GetReadingCycleResult> {
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
  const getReadingCycleResponse = await persistence.getReadingCycle(request)
  if (isErr(getReadingCycleResponse)) {
    return getReadingCycleResponse
  }
  const readingCycle = getReadingCycleResponse.data

  return ok(readingCycle)
}

export interface GetReadingCycle {
  authId: string
}

export type GetReadingCycleSucceeded =
  | ReadingCycle[]

export type GetReadingCycleFailed =
  | InvalidConfiguration
  | ValidationFailed<InvalidSchema>
  | GetFailed

export type GetReadingCycleResult = Result<GetReadingCycleSucceeded, GetReadingCycleFailed>


