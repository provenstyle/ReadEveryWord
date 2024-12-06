import { Result, isErr, isOk } from '@read-every-word/infrastructure'
import { ValidationFailed, InvalidSchema } from './Validation'

export function expectOk(validationResponse) {
  if (isErr(validationResponse)) {
    console.log(validationResponse.err)
  }
  expect(isOk(validationResponse)).toEqual(true)
}

export function expectErrorMessage(response: Result<unknown, ValidationFailed<InvalidSchema>>, message) {
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