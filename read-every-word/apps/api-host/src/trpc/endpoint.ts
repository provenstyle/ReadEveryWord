import { app, type HttpRequest, type HttpResponseInit, type InvocationContext } from '@azure/functions'
// import { appRouter } from '@read-every-word/api'

app.http('get_health_check', {
    methods: ['GET'],
    authLevel: 'function',
    handler: handleEndpoint,
    route: 'healthCheck'
})

export async function handleEndpoint (request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    return {
        status: 200
    }
}