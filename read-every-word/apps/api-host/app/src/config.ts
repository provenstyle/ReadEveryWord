import { isErr } from '@read-every-word/foundation'
import { fromEnv, type Config } from '@read-every-word/api'

// Read once at module load. A function app holding invalid configuration
// should fail to start rather than come up and serve errors.
const configResult = fromEnv()
if (isErr(configResult)) {
    throw new Error('Invalid configuration')
}

export const config: Config = configResult.data
