import { app } from '@azure/functions'
import { appRouter, createContextFromHeaders } from '@read-every-word/api'
import { createAzureFunctionsHandler } from '@read-every-word/azure-function-adapter'
import { config } from '../config.js'

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
