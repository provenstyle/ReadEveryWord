import { Result, isErr, ok } from '../../infrastructure/Result'
import { ValidationFailed, InvalidSchema } from '../../infrastructure/Validation'
import { validate } from './validation'
import { Persistence, GetFailed } from './persistence'
import { fromEnv, type InvalidConfiguration } from '../../config'
import { User } from '../domain'

export async function handleGetUser(request: GetUser): Promise<GetUserResult> {
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
  const getUserResponse = await persistence.getUser(request)
  if (isErr(getUserResponse)) {
    return getUserResponse
  }
  const user = getUserResponse.data

  return ok(user)
}

export interface GetUser {
  authId: string
}

export type GetUserSucceeded =
  | User

export type GetUserFailed =
  | InvalidConfiguration
  | ValidationFailed<InvalidSchema>
  | GetFailed

export type GetUserResult = Result<GetUserSucceeded, GetUserFailed>


