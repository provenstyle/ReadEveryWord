import { app, type HttpRequest, type HttpResponseInit, type InvocationContext } from '@azure/functions'
import { json } from '@read-every-word/infrastructure'

app.http('get_config', {
  methods: ['GET'],
  authLevel: 'anonymous',
  handler: handleEndpoint,
  route: 'config'
})

export async function handleEndpoint (request: HttpRequest, context: InvocationContext ): Promise<HttpResponseInit> {
  try {
    console.log(`${request.method} request for url "${request.url}"`)
    return json(200, {
      openId: {
        domain: process.env.OPEN_ID_DOMAIN,
        clientId: process.env.OPEN_ID_CLIENT_ID,
        audience: process.env.OPEN_ID_AUDIENCE,
      }
    })
  } catch (error) {
    console.error(`Error handling "${request.url}"`, error)
    return ({ status: 500 })
  }
}
