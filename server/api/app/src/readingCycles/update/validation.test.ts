import { expectOk, expectErrorMessage } from '@read-every-word/infrastructure'
import { UpdateReadingCycle } from '@read-every-word/domain'
import { validate } from './validation'
import { v4 as uuid } from 'uuid'
import * as Factory from 'factory.ts'

describe('UpdateReadingCycle validation', () => {
  const requestFactory = Factory.Sync.makeFactory<UpdateReadingCycle>({
    id: uuid(),
    authId: 'authId',
    name: 'name',
    dateCompleted: '2024-11-04T23:30:00Z',
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

  it('name is optional', async () => {
    const response = await validate(requestFactory.build({
      name: undefined
    }))
    expectOk(response)
  })

  it('dateCompleted is optional', async () => {
    const response = await validate(requestFactory.build({
      dateCompleted: undefined
    }))
    expectOk(response)
  })

  it('for now you can supply nothing to change and it is ok, may want to change this', async () => {
    const response = await validate(requestFactory.build({
      name: undefined,
      dateCompleted: undefined
    }))
    expectOk(response)
  })
})
