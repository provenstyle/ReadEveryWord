import * as Factory from 'factory.ts'
import { expectOk, expectErrorMessage } from '@read-every-word/infrastructure'
import { validate } from './validation'
import { v4 as uuid } from 'uuid'
import { SetDefaultReadingCycle } from '../domain'

describe('SetDefaultReadingCycle validation', () => {
  const requestFactory = Factory.Sync.makeFactory<SetDefaultReadingCycle>({
    id: uuid(),
    authId: 'authId'
  });

  it('valid request is valid', async () => {
    const response = await validate(requestFactory.build())
    expectOk(response)
  })

  it('id is required', async () => {
    const response = await validate(requestFactory.build({
      id: undefined
    }))
    expectErrorMessage(response, "must have required property 'id'")
  })

  it('authId is required', async () => {
    const response = await validate(requestFactory.build({
      authId: undefined
    }))
    expectErrorMessage(response, "must have required property 'authId'")
  })
})
