export class NotFound {
  code = 'not-found' as const
  message = 'Server returned not found'
}

export class ServerError {
  code = 'server-error' as const
  message = 'Unexpected server error'
}

export class ValidationFailed {
  code = 'validation-failed' as const
  message = 'Request failed validation'
  failures: InvalidSchemaProps[] = []

  constructor (failures: InvalidSchemaProps[]) {
    this.failures = failures
  }
}

export interface InvalidSchemaProps {
  message?: string
  property: string
}