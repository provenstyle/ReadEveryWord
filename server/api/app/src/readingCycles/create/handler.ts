import { Result, isErr, ok, InvalidConfiguration } from '@read-every-word/infrastructure'
import { ValidationFailed, InvalidSchema } from '../../infrastructure/Validation'
import { validate } from './validation'
import { Persistence, CreateFailed } from './persistence'
import { fromEnv } from '../../config'
import { ReadingCycle } from '../domain'

export async function handleCreateReadingCycle(request: CreateReadingCycle): Promise<CreateReadingCycleResult> {
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
  const createReadingCycleResponse = await persistence.createReadingCycle(request)
  if (isErr(createReadingCycleResponse)) {
    return createReadingCycleResponse
  }
  const readingCycle = createReadingCycleResponse.data

  return ok(readingCycle)
}

export interface CreateReadingCycle {
  authId: string
  dateStarted: string
  dateCompleted?: string
  default?: boolean
}

export type CreateReadingCycleSucceeded =
  | ReadingCycle

export type CreateReadingCycleFailed =
  | InvalidConfiguration
  | ValidationFailed<InvalidSchema>
  | CreateFailed

export type CreateReadingCycleResult = Result<CreateReadingCycleSucceeded, CreateReadingCycleFailed>


