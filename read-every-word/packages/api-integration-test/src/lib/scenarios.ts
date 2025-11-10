import { fromEnv, appRouter } from '@read-every-word/api';
import { isErr } from '@read-every-word/foundation';
import {config} from 'dotenv'
config()

export function withCaller(): ReturnType<typeof appRouter.createCaller> {
  const configResult = fromEnv()
  if(isErr(configResult)) {
    throw new Error('Failed to create config')
  }
  const config = configResult.data
  return appRouter.createCaller({ config })
}