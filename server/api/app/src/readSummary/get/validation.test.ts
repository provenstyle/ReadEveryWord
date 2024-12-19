import { expectOk, expectErrorMessage } from '@read-every-word/infrastructure'
import { GetReadSummary } from '@read-every-word/domain'
import * as Factory from 'factory.ts'
import { validate } from './validation'
import { v4 as uuid } from 'uuid'

describe('GetReadSummary validation', () => {
  const requestFactory = Factory.Sync.makeFactory<GetReadSummary>({
    authId: uuid(),
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
})
