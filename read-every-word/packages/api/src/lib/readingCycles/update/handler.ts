import { isErr, ok } from '@read-every-word/foundation'
import { type UpdateReadingCycle, type UpdateReadingCycleResult } from '@read-every-word/domain'
import { validate } from './validation.js'
import { Persistence } from '../persistence.js'
import { authenticatedProcedure } from '../../trpc.js'

export const updateReadingCycleProcedure = authenticatedProcedure
  .input(r => r as UpdateReadingCycle)
  .mutation(async ({ input, ctx }): Promise<UpdateReadingCycleResult> => {
    const validationResponse = await validate(input)
    if(isErr(validationResponse)) {
      return validationResponse
    }

    const persistence = new Persistence(ctx.config)
    const updateReadingCycleResponse = await persistence.updateReadingCycle(input)
    if (isErr(updateReadingCycleResponse)) {
      return updateReadingCycleResponse
    }
    const readingCycle = updateReadingCycleResponse.data

    return ok(readingCycle)
  })
