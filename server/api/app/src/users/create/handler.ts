import { Result, isErr, ok, InvalidConfiguration } from '@read-every-word/infrastructure'
import { ValidationFailed, InvalidSchema } from '../../infrastructure/Validation'
import { validate } from './validation'
import { Persistence, CreateFailed } from './persistence'
import { fromEnv } from '../../config'
import { User } from '../domain'

export async function handleCreateUser(request: CreateUser): Promise<CreateUserResult> {
  const configResponse = fromEnv()
  if(isErr(configResponse)) {
    return configResponse
  }
  const config = configResponse.data

  const validationResponse = await validate(request)
  if(isErr(validationResponse)) {
    return validationResponse
  }

  const persistence = new Persistence(config)
  const createUserResponse = await persistence.createUser(request)
  if (isErr(createUserResponse)) {
    return createUserResponse
  }
  const user = createUserResponse.data

  return ok(user)
}

export interface CreateUser {
  authId: string
  email: string
}

export type CreateUserSucceeded =
  | User

export type CreateUserFailed =
  | InvalidConfiguration
  | ValidationFailed<InvalidSchema>
  | CreateFailed

export type CreateUserResult = Result<CreateUserSucceeded, CreateUserFailed>


