export class NotFound {
  code = 'not-found' as const
  message = 'Server returned not found'
}

export class ServerError {
  code = 'server-error' as const
  message = 'Unexpected server error'
}