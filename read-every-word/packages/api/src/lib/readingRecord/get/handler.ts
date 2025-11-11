import { isErr, ok } from '@read-every-word/foundation'
import { type GetReadingRecord, type GetReadingRecordResult } from '@read-every-word/domain'
import { validate } from './validation.js'
import { Persistence } from './persistence.js'
import { publicProcedure } from '../../trpc.js'
import { Config } from 'src/lib/config.js'

export const getReadingRecordProcedure = publicProcedure
  .input(r => r as GetReadingRecord)
  .query(async ({ input, ctx }): Promise<GetReadingRecordResult> => {
    return handleGetReadingRecord(input, ctx.config)
  })

export const handleGetReadingRecord = async (request: GetReadingRecord, config: Config): Promise<GetReadingRecordResult> => {
  const validationResponse = await validate(request)
  if(isErr(validationResponse)) {
    return validationResponse
  }

  const persistence = new Persistence(config)
  const getReadingRecordResponse = await persistence.getReadingRecord(request)
  if (isErr(getReadingRecordResponse)) {
    return getReadingRecordResponse
  }
  const readingRecord = getReadingRecordResponse.data

  return ok(readingRecord)
}