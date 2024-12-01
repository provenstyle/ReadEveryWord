import * as Factory from 'factory.ts'
import { expectOk, expectErrorMessage } from '../../infrastructure/ValidationExpectations'
import { validate } from './validation'
import { GetUser } from './handler'

describe('GetUser validation', () => {
  const requestFactory = Factory.Sync.makeFactory<GetUser>({
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
