import { isErr, ok } from '@read-every-word/foundation'
import { type GetReadingRecord, type GetReadingRecordResult } from '@read-every-word/domain'
import { validate } from './validation.js'
import { Persistence } from './persistence.js'
import { publicProcedure } from '../../trpc.js'

export const getReadingRecordProcedure = publicProcedure
  .input(r => r as GetReadingRecord)
  .mutation(async ({ input, ctx }): Promise<GetReadingRecordResult> => {
    const validationResponse = await validate(input)
    if(isErr(validationResponse)) {
      return validationResponse
    }

    const persistence = new Persistence(ctx.config)
    const getReadingRecordResponse = await persistence.getReadingRecord(input)
    if (isErr(getReadingRecordResponse)) {
      return getReadingRecordResponse
    }
    const readingRecord = getReadingRecordResponse.data

    return ok(readingRecord)
  })
