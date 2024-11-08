export type Ok<T> = {
  __result: 'OK'
  data: T
};

export type Err<E> = {
  __result: 'ERR'
  err: E
};

export const ok = <T>(data: T): Ok<T> => ({ __result: 'OK', data })
export const err = <E>(err: E): Err<E> => ({ __result: 'ERR', err })

export type Result<T, E> = Ok<T> | Err<E>

export const isOk = <T, E>(r: Result<T, E>): r is Ok<T> => r.__result === 'OK'
export const isErr = <T, E>(r: Result<T, E>): r is Err<E> => r.__result === 'ERR'

export function assertNever (x: never): never {
  throw new Error('Unexpected value. Should have been never.')
}