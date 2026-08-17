import { isErr, ok } from '@read-every-word/foundation'
import { type CreateReadingCycle, type CreateReadingCycleResult } from '@read-every-word/domain'
import { validate } from './validation.js'
import { Persistence } from '../persistence.js'
import { authenticatedMutation, type Authenticated } from '../../trpc.js'
import { Config } from '../../config.js'

export const createReadingCycleProcedure = authenticatedMutation(handleCreateReadingCycle)

export async function handleCreateReadingCycle (
  authenticated: Authenticated<CreateReadingCycle>,
  config: Config
): Promise<CreateReadingCycleResult> {
  const validationResponse = await validate(authenticated.request)
  if(isErr(validationResponse)) {
    return validationResponse
  }

  const persistence = new Persistence(config)
  const createReadingCycleResponse = await persistence.createReadingCycle(authenticated)
  if (isErr(createReadingCycleResponse)) {
    return createReadingCycleResponse
  }
  const readingCycle = createReadingCycleResponse.data

  return ok(readingCycle)
}
