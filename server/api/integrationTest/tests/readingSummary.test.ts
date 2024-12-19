import { withConfig, withUser, withReadingCycle } from './scenarios'
import { expectOk } from '@read-every-word/infrastructure'
import { Client } from '@read-every-word/client'
import { v4 as uuid } from 'uuid'
import exp = require('constants')

describe('healthCheck', () => {
  const config= withConfig()

  const client = new Client(config.service)

  it('reading summary contains 1 default', async () => {
    const readSummaryResult = await client.readSummary.get({
      authId: uuid()
    })
    const readSummary = expectOk(readSummaryResult)
    expect(readSummary.readingCycles.length).toEqual(1)
    expect(readSummary.readingCycles[0].default).toBe(true)
  })

  it('concurrent calls only create 1 default summary', async () => {
    const authId = uuid()
    const promises = []
    for (let i = 0; i < 5; i++) {
      promises.push(
        client.readSummary.get({
          authId
        })
      )
    }

    await Promise.all(promises)

    const readSummaryResult = await client.readSummary.get({
      authId
    })
    const readSummary = expectOk(readSummaryResult)
    expect(readSummary.readingCycles.length).toEqual(1)
    expect(readSummary.readingCycles[0].default).toBe(true)
  })
})

