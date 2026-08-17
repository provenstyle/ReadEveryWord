import { expectOk, expectErrorMessage } from '@read-every-word/test-utils'
import { type CreateReadingCycle } from '@read-every-word/domain'
import * as Factory from 'factory.ts'
import { validate } from './validation.js'

describe('CreateReadingCycle validation', () => {
  const requestFactory = Factory.Sync.makeFactory<CreateReadingCycle>({
    dateStarted: '2024-11-04T23:01:00Z',
    name: 'name'
  });

  it('valid request is valid', async () => {
    const response = await validate(requestFactory.build())
    expectOk(response)
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
