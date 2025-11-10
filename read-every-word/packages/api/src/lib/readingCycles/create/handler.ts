import { isErr, ok } from '@read-every-word/foundation'
import { type CreateReadingCycle, type CreateReadingCycleResult } from '@read-every-word/domain'
import { validate } from './validation.js'
import { Persistence } from '../persistence.js'
import { publicProcedure } from '../../trpc.js'
import { Config } from '../../config.js'

export const createReadingCycleProcedure = publicProcedure
  .input(r => r as CreateReadingCycle)
  .mutation(async ({ input, ctx }): Promise<CreateReadingCycleResult> => {
    return handleCreateReadingCycle(input, ctx.config)
  })

export const handleCreateReadingCycle = async (request: CreateReadingCycle, config: Config): Promise<CreateReadingCycleResult> => {
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