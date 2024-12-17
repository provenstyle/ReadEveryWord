import { expectOk, expectErrorMessage } from '@read-every-word/infrastructure'
import { GetReadingCycle } from '@read-every-word/domain'
import * as Factory from 'factory.ts'
import { validate } from './validation'

describe('GetReadingCycle validation', () => {
  const requestFactory = Factory.Sync.makeFactory<GetReadingCycle>({
    authId: 'authId',
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
