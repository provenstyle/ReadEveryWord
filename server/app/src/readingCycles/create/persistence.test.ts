import { map } from "./persistence"

describe('mapping ReadingCycleRow to ReadingCycleData', () => {
  it('valid request is valid', async () => {
    const data = map({
      partitionKey: 'partitionKey',
      rowKey: 'rowKey',
      timestamp: 'timestamp',
      dateStarted: 'dateStarted',
      dateCompleted: 'dateCompleted'
    })

    expect(data.id).toEqual('rowKey')
    expect(data.authId).toEqual('partitionKey')
    expect(data.lastModified).toEqual('timestamp')
    expect(data.dateStarted).toEqual('dateStarted')
    expect(data.dateCompleted).toEqual('dateCompleted')
  })
})
