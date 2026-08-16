// Plugins
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import Fonts from 'unplugin-fonts/vite'
import Layouts from 'vite-plugin-vue-layouts'
import Vue from '@vitejs/plugin-vue'
import VueRouter from 'unplugin-vue-router/vite'
import Vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'

// Utilities
import { defineConfig } from 'vite'
import { fileURLToPath, URL } from 'node:url'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    VueRouter({
      dts: 'src/typed-router.d.ts',
    }),
    Layouts(),
    AutoImport({
      imports: [
        'vue',
        {
          'vue-router/auto': ['useRoute', 'useRouter'],
        }
      ],
      dts: 'src/auto-imports.d.ts',
      eslintrc: {
        enabled: true,
      },
      vueTemplate: true,
    }),
    Components({
      dts: 'src/components.d.ts',
    }),
    Vue({
      template: { transformAssetUrls },
    }),
    // https://github.com/vuetifyjs/vuetify-loader/tree/master/packages/vite-plugin#readme
    Vuetify({
      autoImport: true,
      styles: {
        configFile: 'src/styles/settings.scss',
      },
    }),
    Fonts({
      google: {
        families: [ {
          name: 'Roboto',
          styles: 'wght@100;300;400;500;700;900',
        }],
      },
    }),
  ],
  define: { 'process.env': {} },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
    // @read-every-word/* are consumed as typescript source rather than built
    // dist, matching customConditions in tsconfig.base.json. This is a runtime
    // concern, not just a typing one: Bible/Book/Chapter are classes and isErr
    // is a function. Vite replaces this list rather than appending to it, so
    // the defaults have to be spelled out.
    conditions: [
      '@read-every-word/source',
      'module',
      'browser',
      'development|production',
    ],
    extensions: [
      '.js',
      '.json',
      '.jsx',
      '.mjs',
      '.ts',
      '.tsx',
      '.vue',
    ],
  },
  // Workspace packages shipped as source; prebundling them would defeat the
  // source condition above.
  optimizeDeps: {
    exclude: ['@read-every-word/domain', '@read-every-word/foundation'],
  },
  build: {
    // apps/frontEnd/cicd/publishFrontend.sh uploads ./dist to blob storage.
    outDir: 'dist',
    emptyOutDir: true,
  },
  server: {
    port: 3000,
    // The app calls the api at window.location.origin, which cloudflare's
    // worker routes in the deployed environments. Locally this stands in for
    // it, against the port apps/api-host's func start listens on.
    proxy: {
      '/api': {
        target: 'http://localhost:7074',
        changeOrigin: true,
      },
    },
  },
  css: {
    preprocessorOptions: {
      sass: {
        api: 'modern-compiler',
      },
    },
  },
})
