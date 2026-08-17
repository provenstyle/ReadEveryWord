import { isErr, ok } from '@read-every-word/foundation'
import { type GetReadingCycleResult } from '@read-every-word/domain'
import { Persistence } from '../persistence.js'
import { principalQuery, type Principal } from '../../trpc.js'
import { Config } from '../../config.js'

export const getAllReadingCyclesProcedure = principalQuery(handleGetReadingCycles)

// No request to validate: the caller's identity is the whole input, and it comes
// from the verified token rather than from anything they sent.
export async function handleGetReadingCycles (principal: Principal, config: Config): Promise<GetReadingCycleResult> {
  const persistence = new Persistence(config)
  const getReadingCycleResponse = await persistence.getAllReadingCycles(principal)
  if (isErr(getReadingCycleResponse)) {
    return getReadingCycleResponse
  }
  const readingCycle = getReadingCycleResponse.data
  return ok(readingCycle)
}
