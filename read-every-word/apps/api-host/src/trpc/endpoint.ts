import { isErr } from '@read-every-word/foundation'
import { app } from '@azure/functions'
import { appRouter, createContextFromHeaders, fromEnv } from '@read-every-word/api'
import { createAzureFunctionsHandler } from '@read-every-word/azure-function-adapter'

const configResult = fromEnv()
if (isErr(configResult)) {
    throw new Error('Invalid configuration')
}
const config = configResult.data

app.http('trpc', {
    methods: ['GET', 'POST'],
    authLevel: 'anonymous',
    route: 'trpc/{*path}',
    handler: createAzureFunctionsHandler({
        router: appRouter,
        createContext: async ({ httpRequest }) => {
            return createContextFromHeaders({
                config,
                headers: httpRequest.headers
            })
        }
    }),
})
