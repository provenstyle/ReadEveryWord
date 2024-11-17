import { AxiosError } from 'axios'
import {
  ValidationFailed,
  NotFound,
  ServerError
} from '@read-every-word/infrastructure'

export type CreateFailed =
  | AxiosError
  | ValidationFailed
  | NotFound
  | ServerError

export type GetFailed =
  | AxiosError
  | ValidationFailed
  | NotFound
  | ServerError

export type UpdateFailed =
  | AxiosError
  | ValidationFailed
  | NotFound
  | ServerError