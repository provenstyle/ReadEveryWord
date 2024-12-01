import { Result, isErr, ok } from '../../infrastructure/Result'
import { ValidationFailed, InvalidSchema } from '../../infrastructure/Validation'
import { validate } from './validation'
import { PersistenceError } from './persistence'

export async function handleCreateUser(request: CreateUser): Promise<CreateUserResult> {
  const validationResponse = await validate(request)
  if(isErr(validationResponse)) {
    return validationResponse
  }

  return ok({
    id: '1'
  })
}

export interface CreateUser {
  authId: string
  email: string
}

export type CreateUserSucceeded =
  | CreateUserData

export type CreateUserFailed =
  | ValidationFailed<InvalidSchema>
  | PersistenceError

export type CreateUserResult = Result<CreateUserSucceeded, CreateUserFailed>

export interface CreateUserData{
  id: string
}

