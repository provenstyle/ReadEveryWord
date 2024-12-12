import { map } from "./domain"

describe('mapping ReadingCycleRow to ReadingCycleData', () => {
  it('valid request is valid', async () => {
    const data = map({
      partitionKey: 'partitionKey',
      rowKey: 'rowKey',
      timestamp: 'timestamp',
      name: 'name',
      dateStarted: 'dateStarted',
      dateCompleted: 'dateCompleted',
      default: true

    })

    expect(data.id).toEqual('rowKey')
    expect(data.authId).toEqual('partitionKey')
    expect(data.lastModified).toEqual('timestamp')
    expect(data.name).toEqual('name')
    expect(data.dateStarted).toEqual('dateStarted')
    expect(data.dateCompleted).toEqual('dateCompleted')
    expect(data.default).toEqual(true)
  })
})
