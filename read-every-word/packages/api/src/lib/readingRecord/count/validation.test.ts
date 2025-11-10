import { CountReadingRecord } from '@read-every-word/domain'
import * as Factory from 'factory.ts'
import { v4 as uuid } from 'uuid'

import { router } from '../../trpc.js';
import { countReadingRecordProcedure } from './handle.js'
import { ZodError } from 'zod'
import { TRPCError } from '@trpc/server'
import { expectOk, ok, err, isErr, isOk } from '@read-every-word/foundation'

// Mock the persistence module at the top level
const mockCountReadingRecords = jest.fn().mockResolvedValue(ok(1))
jest.mock('./persistence.js', () => {
  return {
    Persistence: jest.fn().mockImplementation(() => ({
      countReadingRecords: mockCountReadingRecords
    }))
  }
})

describe('CountReadingRecord validation', () => {
  const caller = router({
    target: countReadingRecordProcedure
  }).createCaller({
    config: {
      tableStorageConnectionString: ''
    }
  });

  const requestFactory = Factory.Sync.makeFactory<CountReadingRecord>({
    authId: 'myAuthId',
    readingCycleId: uuid(),
  });

  beforeEach(() => {
    // Reset mock to default behavior before each test
    mockCountReadingRecords.mockResolvedValue(ok(1))
  });

  it('valid request is valid', async () => {
    const response = await caller.target(requestFactory.build())
    const result = expectOk(response)
    expect(result).toBe(1)
  })

  it('can customize mock return value', async () => {
    mockCountReadingRecords.mockResolvedValueOnce(ok(42))

    const response = await caller.target(requestFactory.build())
    const result = expectOk(response)
    expect(result).toBe(42)
  })

  it('can mock error responses', async () => {
    // Mock an error response
    const error = new Error('Database connection failed')
    mockCountReadingRecords.mockResolvedValueOnce(err(error))

    const response = await caller.target(requestFactory.build())
    if(isOk(response)) {
      throw new Error('Expected error response')
    }
  })

  it('authId is required', () => {
    return expectValidationError(async () => {
      await caller.target(requestFactory.build({
        authId: undefined
      }))
    }, 'Invalid input: expected string, received undefined', 'authId')
  })

  it('readingCycleId is required', async () => {
    return expectValidationError(async () => {
      await caller.target(requestFactory.build({
        readingCycleId: undefined
      }))
    }, 'Invalid input: expected string, received undefined', 'readingCycleId')
  })

  it('readingCycleId is uuid', async () => {
    return expectValidationError(async () => {
      await caller.target(requestFactory.build({
        readingCycleId: 'foo'
      }))
    }, 'Invalid UUID', 'readingCycleId')
  })
})

const expectValidationError = async (action: ()=> Promise<void>, message: string, path: string) => {
  try {
    await action()
    throw new Error('Expected function to throw')
  } catch (error) {
    if (error instanceof TRPCError) {
      expect (error.cause).toBeInstanceOf(ZodError)
      expect(error.code).toBe('BAD_REQUEST')
      const zodError = error.cause as ZodError

      // Assert that at least one issue has the expected message
      const issue = zodError.issues.find(issue =>
        issue.message.includes(message)
      )
      if(!issue) {
        console.error(error)
        throw new Error(`Validation issues do not contain expected message: ${message}`)
      }
      const foundPath = issue.path.find(p => String(p).includes(path))
      if(!foundPath) {
        console.error(error)
        throw new Error(`Issue path does not contain expected path: ${path}`)
      }
    } else {
      console.error(error)
      new Error('Expected TRPCError')
    }
  }
}
