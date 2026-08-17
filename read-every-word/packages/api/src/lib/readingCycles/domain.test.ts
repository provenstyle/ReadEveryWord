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
    // The partition key is a storage detail and must not be projected back out
    // onto the entity, which is a response payload.
    expect(data).not.toHaveProperty('authId')
    expect(data.lastModified).toEqual('timestamp')
    expect(data.name).toEqual('name')
    expect(data.dateStarted).toEqual('dateStarted')
    expect(data.dateCompleted).toEqual('dateCompleted')
    expect(data.default).toEqual(true)
  })
})
