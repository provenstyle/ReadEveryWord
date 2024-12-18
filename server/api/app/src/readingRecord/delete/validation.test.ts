import * as Factory from 'factory.ts'
import { expectOk, expectErrorMessage } from '@read-every-word/infrastructure'
import { validate } from './validation'
import { DeleteReadingRecord } from '@read-every-word/domain'
import { v4 as uuid } from 'uuid'

describe('DeleteReadingRecord validation', () => {
  const requestFactory = Factory.Sync.makeFactory<DeleteReadingRecord>({
    authId: 'myAuthId',
    readingCycleId: uuid(),
    bookId: 1,
    chapterId: 2
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
