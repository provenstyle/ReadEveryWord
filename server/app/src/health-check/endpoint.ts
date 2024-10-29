import { app, type HttpRequest, type HttpResponseInit, type InvocationContext } from '@azure/functions'

app.http('health_check', {
  methods: ['GET'],
  authLevel: 'function',
  handler: handle,
  route: 'health-check'
})

export async function handle (request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  try {
    console.log(`Http function processed request for url "${request.url}"`)

    return {
        status: 200,
    }

  } catch (error) {
    console.error('Error getting health check.', error)
    return ({ status: 500 })
  }
}
