import { map } from "./domain"

describe('mapping UserRow to UserData', () => {
  it('valid request is valid', async () => {
    const data = map({
      partitionKey: 'partitionKey',
      rowKey: 'rowKey',
      timestamp: 'timestamp',
      email: 'email@email.com'
    })

    expect(data.id).toEqual('rowKey')
    expect(data.authId).toEqual('partitionKey')
    expect(data.lastModified).toEqual('timestamp')
    expect(data.email).toEqual('email@email.com')
  })
})
