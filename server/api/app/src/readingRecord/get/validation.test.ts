import { expectOk, expectErrorMessage } from '@read-every-word/infrastructure'
import { GetReadingRecord } from '@read-every-word/domain'
import * as Factory from 'factory.ts'
import { validate } from './validation'
import { v4 as uuid } from 'uuid'

describe('GetReadingRecord validation', () => {
  const requestFactory = Factory.Sync.makeFactory<GetReadingRecord>({
    authId: 'myAuthId',
    readingCycleId: uuid(),
  });

  it('valid request is valid', async () => {
    const response = await validate(requestFactory.build())
    expectOk(response)
  })

  it('authId is required', async () => {
    const response = await validate(requestFactory.build({
      authId: undefined
    }))
    expectErrorMessage(response, "must have required property 'authId'")
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
