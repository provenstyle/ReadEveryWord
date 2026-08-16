import { withCaller, withUser } from './scenarios'
import { expectOk } from '@read-every-word/test-utils'
import { v4 as uuid } from 'uuid'

describe('readingSummary', () => {

  it('reading summary contains 1 default', async () => {
    const user = await withUser()
    const caller = await withCaller(user)

    const readSummaryResult = await caller.readSummary.get({
      authId: user.authId
    })
    const readSummary = expectOk(readSummaryResult)
    expect(readSummary.readingCycles.length).toEqual(1)
    expect(readSummary.readingCycles[0].default).toBe(true)
  }, 10 * 1000)

  it('concurrent calls only create 1 default summary', async () => {
    // One user for all six calls, so they contend for the same blob lock.
    const user = await withUser()
    const caller = await withCaller(user)

    const promises = []
    for (let i = 0; i < 5; i++) {
      promises.push(
        caller.readSummary.get({
          authId: user.authId
        })
      )
    }

    await Promise.all(promises)

    const readSummaryResult = await caller.readSummary.get({
      authId: user.authId
    })
    const readSummary = expectOk(readSummaryResult)
    expect(readSummary.readingCycles.length).toEqual(1)
    expect(readSummary.readingCycles[0].default).toBe(true)
  }, 10 * 1000)

  it('rejects an unauthenticated caller', async () => {
    const caller = await withCaller()

    await expect(caller.readSummary.get({ authId: uuid() }))
      .rejects.toThrow('No token provided')
  })
})
