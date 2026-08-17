import { isErr, ok } from '@read-every-word/foundation'
import { type DeleteReadingRecord, type DeleteReadingRecordResult } from '@read-every-word/domain'
import { validate } from './validation.js'
import { Persistence } from './persistence.js'
import { authenticatedProcedure, authenticatedRequest } from '../../trpc.js'

export const deleteReadingRecordProcedure = authenticatedProcedure
  .input(r => r as DeleteReadingRecord)
  .mutation(async ({ input, ctx }): Promise<DeleteReadingRecordResult> => {
    const request = authenticatedRequest(input, ctx)

    const validationResponse = await validate(request)
    if(isErr(validationResponse)) {
      return validationResponse
    }

    const persistence = new Persistence(ctx.config)
    const deleteReadingRecordResponse = await persistence.deleteReadingRecord(request)
    if (isErr(deleteReadingRecordResponse)) {
      return deleteReadingRecordResponse
    }
    const readingRecord = deleteReadingRecordResponse.data

    return ok(readingRecord)
  })
