import { isErr, ok } from '@read-every-word/foundation'
import { type CreateReadingCycle, type CreateReadingCycleResult } from '@read-every-word/domain'
import { validate } from './validation.js'
import { Persistence } from '../persistence.js'
import { publicProcedure } from 'src/lib/trpc.js'

export const createReadingCycleProcedure = publicProcedure
  .input(r => r as CreateReadingCycle)
  .mutation(async ({ input, ctx }): Promise<CreateReadingCycleResult> => {

    const validationResponse = await validate(input)
    if(isErr(validationResponse)) {
      return validationResponse
    }

    const persistence = new Persistence(ctx.config)
    const createReadingCycleResponse = await persistence.createReadingCycle(input)
    if (isErr(createReadingCycleResponse)) {
      return createReadingCycleResponse
    }
    const readingCycle = createReadingCycleResponse.data

    return ok(readingCycle)
  })
