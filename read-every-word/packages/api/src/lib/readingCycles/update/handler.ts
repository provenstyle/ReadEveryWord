import { isErr, ok } from '@read-every-word/foundation'
import { type UpdateReadingCycle, type UpdateReadingCycleResult } from '@read-every-word/domain'
import { validate } from './validation.js'
import { Persistence } from '../persistence.js'
import { authenticatedMutation, type Authenticated } from '../../trpc.js'
import { Config } from '../../config.js'

export const updateReadingCycleProcedure = authenticatedMutation(handleUpdateReadingCycle)

export async function handleUpdateReadingCycle (
  authenticated: Authenticated<UpdateReadingCycle>,
  config: Config
): Promise<UpdateReadingCycleResult> {
  const validationResponse = await validate(authenticated.request)
  if(isErr(validationResponse)) {
    return validationResponse
  }

  const persistence = new Persistence(config)
  const updateReadingCycleResponse = await persistence.updateReadingCycle(authenticated)
  if (isErr(updateReadingCycleResponse)) {
    return updateReadingCycleResponse
  }
  const readingCycle = updateReadingCycleResponse.data

  return ok(readingCycle)
}
