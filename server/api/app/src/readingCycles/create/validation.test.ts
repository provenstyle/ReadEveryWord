import * as Factory from 'factory.ts'
import { expectOk, expectErrorMessage } from '@read-every-word/infrastructure'
import { validate } from './validation'
import { CreateReadingCycle } from '../domain'

describe('CreateReadingCycle validation', () => {
  const requestFactory = Factory.Sync.makeFactory<CreateReadingCycle>({
    authId: 'authId',
    dateStarted: '2024-11-04T23:01:00Z',
    name: 'name'
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

  it('dateStarted is required', async () => {
    const response = await validate(requestFactory.build({
      dateStarted: undefined
    }))
    expectErrorMessage(response, "must have required property 'dateStarted'")
  })

  it('name is required', async () => {
    const response = await validate(requestFactory.build({
      name: undefined
    }))
    expectErrorMessage(response, "must have required property 'name'")
  })
})
