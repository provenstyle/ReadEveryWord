import { isErr, ok } from '@read-every-word/foundation'
import { validate } from './validation.js'
import { Persistence } from './persistence.js'
import { CreateReadingRecord, CreateReadingRecordResult } from '@read-every-word/domain'
import { publicProcedure } from '../../trpc.js'

export const createReadingRecordProcedure = publicProcedure
  .input(r => r as CreateReadingRecord)
  .mutation(async ({ input, ctx }): Promise<CreateReadingRecordResult> => {
    const validationResponse = await validate(input)
    if(isErr(validationResponse)) {
      return validationResponse
    }

    const persistence = new Persistence(ctx.config)
    const createReadingRecordResponse = await persistence.createReadingRecord(input)
    if (isErr(createReadingRecordResponse)) {
      return createReadingRecordResponse
    }
    const readingRecord = createReadingRecordResponse.data

    return ok(readingRecord)
  })

