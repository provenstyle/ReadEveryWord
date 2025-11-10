import { withCaller } from './scenarios'
import { expectOk } from '@read-every-word/foundation'
import { v4 as uuid } from 'uuid'

describe('readingSummary', () => {

  const readSummaryClient  = withCaller().readSummary

  it('reading summary contains 1 default', async () => {
    const readSummaryResult = await readSummaryClient.get({
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
        readSummaryClient.get({
          authId
        })
      )
    }

    await Promise.all(promises)

    const readSummaryResult = await readSummaryClient.get({
      authId
    })
    const readSummary = expectOk(readSummaryResult)
    expect(readSummary.readingCycles.length).toEqual(1)
    expect(readSummary.readingCycles[0].default).toBe(true)
  })
})

