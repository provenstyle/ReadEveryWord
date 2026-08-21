import { expectOk, expectErrorMessage } from '@read-every-word/test-utils'
import { UpdateReadingCycle } from '@read-every-word/domain'
import { validate } from './validation'
import { v4 as uuid } from 'uuid'
import * as Factory from 'factory.ts'

describe('UpdateReadingCycle validation', () => {
  const requestFactory = Factory.Sync.makeFactory<UpdateReadingCycle>({
    id: uuid(),
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

  // Reopening a completed cycle. null has to get past the date-time format, which is
  // the whole reason the schema types this as ['string', 'null'] rather than 'string'.
  it('dateCompleted may be null, to clear it', async () => {
    const response = await validate(requestFactory.build({
      dateCompleted: null
    }))
    expectOk(response)
  })

  it('dateCompleted still has to be a date-time when it is a string', async () => {
    const response = await validate(requestFactory.build({
      dateCompleted: 'not a date'
    }))
    expectErrorMessage(response, 'must match format "date-time"')
  })
})
