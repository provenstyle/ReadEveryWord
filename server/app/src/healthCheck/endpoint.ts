import { app, type HttpRequest, type HttpResponseInit, type InvocationContext } from '@azure/functions'

app.http('health_check', {
  methods: ['GET'],
  authLevel: 'function',
  handler: handleEndpoint,
  route: 'healthCheck'
})

export async function handleEndpoint (request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  try {
    console.log(`Http request for url "${request.url}"`)

    return {
        status: 200,
    }

  } catch (error) {
    console.error(`Error handling "${request.url}"`, error)
    return ({ status: 500 })
  }
}
