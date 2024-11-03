
export class PersistenceError{
  code = 'persistence-error' as const
  message = 'Unexpected error in persistence'
}