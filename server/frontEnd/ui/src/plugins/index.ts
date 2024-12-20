/**
 * plugins/index.ts
 *
 * Automatically included in `./src/main.ts`
 */

// Plugins
import vuetify from './vuetify'
import pinia from '../stores'
import router from '../router'
import '@/styles/settings.scss';
import { createAuth0 } from '@auth0/auth0-vue'

// Types
import type { App } from 'vue'

const configuration = {
  auth: {
    domain: 'dev-lr8vwbeyc7gmi0w2.us.auth0.com',
    clientId: 'EklZm4b41JEMQtssQciDgZtHtNzE2pBw',
    audience: 'read-every-word-bff-dev'
  }
}

export function registerPlugins (app: App) {
  app
    .use(vuetify)
    .use(router)
    .use(pinia)
    .use(createAuth0({
      domain: configuration.auth.domain,
      clientId: configuration.auth.clientId,
      authorizationParams: {
        redirect_uri: new URL('/login/callback', window.location.origin).href,
        audience: configuration.auth.audience,
        scope: 'openid profile email'
      },
      useRefreshTokens: true,
      cacheLocation: 'localstorage'
    }, {
      errorPath: '/authorization-error'
    }))
}
