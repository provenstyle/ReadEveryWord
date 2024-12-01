import * as Factory from 'factory.ts'
import { expectOk, expectErrorMessage } from '../../infrastructure/ValidationExpectations'
import { validate } from './validation'
import { CreateReadingCycle } from './handler'

describe('CreateReadingCycle validation', () => {
  const requestFactory = Factory.Sync.makeFactory<CreateReadingCycle>({
    authId: 'authId',
    dateStarted: '2024-11-04T23:01:00Z',
    dateCompleted: '2024-11-04T23:30:00Z'
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
})
