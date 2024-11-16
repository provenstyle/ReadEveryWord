import { Result, isErr} from '@read-every-word/library'

export function expectOk<T, E> (response: Result<T, E>): T {
    if (isErr(response)) {
      console.log(response.err)
      throw new Error('Expected successful response')
    }
    return response.data
  }