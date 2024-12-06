import {
  ValidationFailed,
} from './index'

export class NotFound {
  code = 'not-found' as const
  message = 'Request returned not found'
}

export class ServerError {
  code = 'server-error' as const
  message = 'Unexpected server error'
}

export class UnexpectedResponseCode {
  code = 'unexpected-response-code' as const
  message = 'An unexpected response code was returned'
}

export class UnexpectedHttpException {
  code = 'unexpected-http-exception' as const
  message = 'An unexpected exception was thrown during an http request'
}

export class InvalidConfiguration {
    code = 'invalid-server-configuration' as const
    message = 'Unexpected server error'
}

export class PersistenceError {
  code = 'persistence-error' as const
  message = 'Unexpected error in persistence'
}

export type CreateFailed =
  | UnexpectedHttpException
  | UnexpectedResponseCode
  | ValidationFailed
  | NotFound
  | ServerError

export type GetFailed =
  | UnexpectedHttpException
  | UnexpectedResponseCode
  | ValidationFailed
  | NotFound
  | ServerError

export type UpdateFailed =
  | UnexpectedHttpException
  | UnexpectedResponseCode
  | ValidationFailed
  | NotFound
  | ServerError

export type DeleteFailed =
  | UnexpectedHttpException
  | UnexpectedResponseCode
  | ValidationFailed
  | NotFound
  | ServerError
