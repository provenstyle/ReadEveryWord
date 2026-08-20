/**
 * router/index.ts
 *
 * Automatic routes for `./src/pages/*.vue`
 */

// Composables
import { createRouter, createWebHistory } from 'vue-router/auto'
import { setupLayouts } from 'virtual:generated-layouts'
import { routes } from 'vue-router/auto-routes'
import type { RouteNamedMap } from 'vue-router/auto-routes'
import { authGuard } from '@auth0/auth0-vue'

// Handle Routes without a layout
const routesWithoutLayout = [
  '/authorization-error'
]
const routesToRemoveLayout = routes.filter(r => routesWithoutLayout.includes(r.path))
for (const route of routesToRemoveLayout){
  route.meta = {
    ...route.meta,
    layout: false
  }
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    ...setupLayouts(routes),
    {
      path: '/',
      redirect: '/read',
    }
  ]
})

/**
 * Every route requires a session except the ones listed here.
 *
 * Authenticated by default, rather than an allowlist of protected routes. A new
 * page is then guarded the moment it exists instead of when someone remembers to
 * register it, and the list that has to be maintained is the short one that does
 * not grow as the app does.
 *
 * Typed as keyof RouteNamedMap, so renaming or deleting one of these pages is a
 * compile error. The previous version matched path strings with `filter`, where a
 * stale entry matched nothing and quietly left the route public.
 *
 * Matching on the route name rather than the path is what makes the catch-all
 * work: its path is whatever bad url was typed, but its name is stable.
 * setupLayouts wraps each route in an unnamed layout parent and spreads the
 * original into the child, so the name survives on the matched leaf.
 */
const publicRoutes: Array<keyof RouteNamedMap> = [
  '/login/callback/',      // the auth0 redirect target; guarding it would loop
  '/authorization-error/', // has to be reachable exactly when auth has failed
  '/[...path]',            // a bad url should render not-found, not bounce to login
]

const isPublic = new Set<string>(publicRoutes)

// An unnamed or unmatched route falls through to the guard, which is the safe way
// round for anything unrecognised.
router.beforeEach(to => isPublic.has(String(to.name)) ? true : authGuard(to))

// Workaround for https://github.com/vitejs/vite/issues/11804
router.onError((err, to) => {
  if (err?.message?.includes?.('Failed to fetch dynamically imported module')) {
    if (!localStorage.getItem('vuetify:dynamic-reload')) {
      console.log('Reloading page to fix dynamic import error')
      localStorage.setItem('vuetify:dynamic-reload', 'true')
      location.assign(to.fullPath)
    } else {
      console.error('Dynamic import error, reloading page did not fix it', err)
    }
  } else {
    console.error(err)
  }
})

router.isReady().then(() => {
  localStorage.removeItem('vuetify:dynamic-reload')
})

export default router
