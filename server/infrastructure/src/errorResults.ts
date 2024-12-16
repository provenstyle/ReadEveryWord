import {
  ValidationFailed,
} from './index'

export class NotFound {
  code = 'not-found' as const
  message = 'Request returned not found'
  constructor (public data?: any){}
}

export class ServerError {
  code = 'server-error' as const
  message = 'Unexpected server error'
  constructor (public data?: any){}
}

export class UnexpectedResponseCode {
  code = 'unexpected-response-code' as const
  message = 'An unexpected response code was returned'
  constructor (public data?: any){}
}

export class UnexpectedHttpException {
  code = 'unexpected-http-exception' as const
  message = 'An unexpected exception was thrown during an http request'
  constructor (public data?: any){}
}

export class InvalidConfiguration {
  code = 'invalid-server-configuration' as const
  message = 'Unexpected server error'
  constructor (public data?: any){}
}

export class PersistenceError {
  code = 'persistence-error' as const
  message = 'Unexpected error in persistence'
  constructor (public data?: any){}
}

export class Unauthorized {
  code = 'unauthorized' as const
  message = 'Unauthorized'
  constructor (public data?: any){}
}

export type CreateFailed =
  | UnexpectedHttpException
  | UnexpectedResponseCode
  | ValidationFailed
  | NotFound
  | ServerError
  | PersistenceError
  | Unauthorized
  | InvalidConfiguration

export type GetFailed =
  | UnexpectedHttpException
  | UnexpectedResponseCode
  | ValidationFailed
  | NotFound
  | ServerError
  | PersistenceError
  | Unauthorized
  | InvalidConfiguration

export type UpdateFailed =
  | UnexpectedHttpException
  | UnexpectedResponseCode
  | ValidationFailed
  | NotFound
  | ServerError
  | PersistenceError
  | Unauthorized
  | InvalidConfiguration

export type DeleteFailed =
  | UnexpectedHttpException
  | UnexpectedResponseCode
  | ValidationFailed
  | NotFound
  | ServerError
  | PersistenceError
  | Unauthorized
  | InvalidConfiguration
