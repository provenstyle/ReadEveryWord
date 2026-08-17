import { expectOk, expectErrorMessage } from '@read-every-word/test-utils'
import { type GetReadingRecord } from '@read-every-word/domain'
import * as Factory from 'factory.ts'
import { validate } from './validation.js'
import { v4 as uuid } from 'uuid'

describe('GetReadingRecord validation', () => {
  const requestFactory = Factory.Sync.makeFactory<GetReadingRecord>({
    readingCycleId: uuid(),
  });

  it('valid request is valid', async () => {
    const response = await validate(requestFactory.build())
    expectOk(response)
  })

  it('readingCycleId is required', async () => {
    const response = await validate(requestFactory.build({
      readingCycleId: undefined
    }))
    expectErrorMessage(response, "must have required property 'readingCycleId'")
  })

  it('readingCycleId is uuid', async () => {
    const response = await validate(requestFactory.build({
      readingCycleId: 'foo'
    }))
    expectErrorMessage(response, 'must match format "uuid"')
  })
})
