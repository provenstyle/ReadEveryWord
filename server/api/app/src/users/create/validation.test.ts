import * as Factory from 'factory.ts'
import { expectOk, expectErrorMessage } from '@read-every-word/infrastructure'
import { validate } from './validation'
import { CreateUser } from './handler'

describe('CreateUser validation', () => {
  const requestFactory = Factory.Sync.makeFactory<CreateUser>({
    authId: 'authId',
    email: 'foo@bar.com'
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

  it('email is required', async () => {
    const response = await validate(requestFactory.build({
      email: undefined
    }))
    expectErrorMessage(response, "must have required property 'email'")
  })

  it('must be a valid email', async () => {
    const response = await validate(requestFactory.build({
      email: 'email'
    }))
    expectErrorMessage(response, 'must match format "email"'
    )
  })
})
