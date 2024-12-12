import * as Factory from 'factory.ts'
import { expectOk, expectErrorMessage } from '@read-every-word/infrastructure'
import { validate } from './validation'
import { CreateReadingRecord } from './handler'
import { v4 as uuid } from 'uuid'

describe('CreateReadingRecord validation', () => {
  const requestFactory = Factory.Sync.makeFactory<CreateReadingRecord>({
    readingCycleId: uuid(),
    dateRead: '2024-11-06T23:01:00Z',
    bookId: 1,
    chapterId: 2
  });

  it('valid request is valid', async () => {
    const response = await validate(requestFactory.build())
    expectOk(response)
  })

  it('readingCycleId is required', async () => {
    const response = await validate(requestFactory.build({
      readingCycleId: undefined
    }))
    expectErrorMessage(response, "must have required property 'readingCycleId'")
  })

  it('readingCycleId is uuid', async () => {
    const response = await validate(requestFactory.build({
      readingCycleId: 'foo'
    }))
    expectErrorMessage(response, 'must match format "uuid"')
  })

  it('dateRead is required', async () => {
    const response = await validate(requestFactory.build({
      dateRead: undefined
    }))
    expectErrorMessage(response, "must have required property 'dateRead'")
  })

  it('dateRead is date-time format', async () => {
    const response = await validate(requestFactory.build({
      dateRead: 'foo'
    }))
    expectErrorMessage(response, 'must match format "date-time"')
  })

  it('bookId is required', async () => {
    const response = await validate(requestFactory.build({
      bookId: undefined
    }))
    expectErrorMessage(response, "must have required property 'bookId'")
  })

  it('bookId is number', async () => {
    const response = await validate(requestFactory.build({
      bookId: 'foo' as any
    }))
    expectErrorMessage(response, "must be number")
  })

  it('bookId is positive', async () => {
    const response = await validate(requestFactory.build({
      bookId: -1
    }))
    expectErrorMessage(response, "must be >= 0")
  })

  it('chapterId is required', async () => {
    const response = await validate(requestFactory.build({
      chapterId: undefined
    }))
    expectErrorMessage(response, "must have required property 'chapterId'")
  })

  it('chapterId is number', async () => {
    const response = await validate(requestFactory.build({
      chapterId: 'foo' as any
    }))
    expectErrorMessage(response, "must be number")
  })

  it('chapter is positive', async () => {
    const response = await validate(requestFactory.build({
      chapterId: -1
    }))
    expectErrorMessage(response, "must be >= 0")
  })
})
