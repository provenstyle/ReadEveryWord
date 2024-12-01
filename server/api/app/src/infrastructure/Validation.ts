export class ValidationFailed<T> {
  code = 'validation-failed' as const
  message = 'Request failed validation'
  failures: T[] = []

  constructor (failures: T[]) {
    this.failures = failures
  }
}

export interface InvalidSchemaProps {
  message?: string
  property: string
}

export class InvalidSchema {
  code = 'invalid-schema' as const

  message: string
  property: string

  constructor(data: InvalidSchemaProps) {
    this.message = data?.message ?? 'The request was invalid'
    this.property = data.property
  }
}
