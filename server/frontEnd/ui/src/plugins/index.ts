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

export interface Config {
  openId: {
    domain: string
    clientId: string
    audience: string
  }
}

export function registerPlugins (app: App, config: Config) {
  app
    .use(vuetify)
    .use(router)
    .use(pinia)
    .use(createAuth0({
      domain: config.openId.domain,
      clientId: config.openId.clientId,
      authorizationParams: {
        redirect_uri: new URL('/login/callback', window.location.origin).href,
        audience: config.openId.audience,
        scope: 'openid profile email'
      },
      useRefreshTokens: true,
      cacheLocation: 'localstorage'
    }, {
      errorPath: '/authorization-error'
    }))
}
