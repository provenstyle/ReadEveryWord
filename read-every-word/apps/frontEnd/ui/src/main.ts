import { isErr } from '@read-every-word/foundation'
import { registerPlugins } from '@/plugins'
import { createApiClient } from '@/api/client'
import App from './App.vue'
import { createApp } from 'vue'

// clientConfig.get is public by necessity: it carries the auth0 settings the
// app needs in order to configure auth0 at all, so it runs without a token.
createApiClient().clientConfig.get.query({})
.then( result => {
  if (isErr(result)) {
    console.error('Error fetching configuration:', result.err)
    return
  }
  const app = createApp(App)
  registerPlugins(app, result.data)
  app.mount('#app')
})
.catch( error => {
  console.error('Error fetching configuration:', error)
})
