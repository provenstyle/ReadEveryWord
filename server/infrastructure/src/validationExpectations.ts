import { Result, isErr, isOk } from './result'
import { ValidationFailed, InvalidSchema } from './validation'

export function expectOk<T, E> (response: Result<T, E>): T {
  if (isErr(response)) {
    console.log(response.err)
    throw new Error('Expected successful response')
  }
  return response.data
}

export function expectErrorMessage(response: Result<unknown, ValidationFailed>, message: string) {
  if (isOk(response)) {
    throw new Error('Expected Err but is Ok')
  }

  if (response?.err?.failures?.length) {
    const messages = response.err.failures.map(x => x.message)
    expect(messages).toEqual(expect.arrayContaining([message]))
  } else {
    console.log(response)
    throw new Error('unexpected validation response')
  }
}