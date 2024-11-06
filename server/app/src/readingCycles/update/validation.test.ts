import * as Factory from 'factory.ts'
import { expectOk, expectErrorMessage } from '../../infrastructure/ValidationExpectations'
import { validate } from './validation'
import { UpdateReadingCycle } from './handler'

describe('UpdateReadingCycle validation', () => {
  const requestFactory = Factory.Sync.makeFactory<UpdateReadingCycle>({
    id: '340efe67-fb95-4e70-8b47-8c0ea93f2b68',
    authId: 'authId',
    dateCompleted: '2024-11-04T23:30:00Z'
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

  it('dateCompleted is required', async () => {
    const response = await validate(requestFactory.build({
      dateCompleted: undefined
    }))
    expectErrorMessage(response, "must have required property 'dateCompleted'")
  })
})
