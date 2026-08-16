/**
 * router/index.ts
 *
 * Automatic routes for `./src/pages/*.vue`
 */

// Composables
import { createRouter, createWebHistory } from 'vue-router/auto'
import { setupLayouts } from 'virtual:generated-layouts'
import { routes } from 'vue-router/auto-routes'
import { authGuard } from '@auth0/auth0-vue'

// Handle Authenticated Routes
const authenticatedRoutes = [
  '/read',
  '/pray',
  '/memorize',
  '/journal',
]
const routesToAddAuthGuard = routes.filter(r => authenticatedRoutes.includes(r.path))
for (const route of routesToAddAuthGuard){
  route.beforeEnter = authGuard
}

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
