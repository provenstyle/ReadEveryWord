import { withCaller } from './scenarios.js';
import { expectOk } from '@read-every-word/foundation';
import { v4 as uuid } from 'uuid';

describe('readingRecord', () => {
  it('count when there are no reading records', async () => {
    const caller = withCaller()
    const result = await caller.readingRecord.count({
      authId: uuid(),
      readingCycleId: '123e4567-e89b-12d3-a456-426614174001'
    })
    const count = expectOk(result)

    expect(count).toBe(0)
  })
})
