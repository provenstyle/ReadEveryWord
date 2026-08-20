<script lang="ts" setup>
import LeftDrawer from '@/features/navigation/LeftDrawer.vue'
import NavigationProvider from '@/features/navigation/NavigationProvider.vue'
import ReadingCycleProvider from '@/features/readingCycle/ReadingCycleProvider.vue'
</script>

<!--
  Every provider in the app, and where it lives.

    NavigationProvider    layouts/default.vue   drawer open/closed
    ReadingCycleProvider  layouts/default.vue   the cycle list, and which is active
    BibleProvider         pages/read.vue        the read grid

  A provider is mounted where its consumers are. The two here are global because
  LeftDrawer is global: it renders on every route and reads the cycle list, so
  ReadingCycleProvider is genuinely needed everywhere. BibleProvider is mounted on
  the /read route instead, because only Bible.vue and Book.vue consume it -- see
  pages/read.vue. Adding it here would mean giving it a route check to work out
  whether it should be doing anything, which is what mounting on the route already
  says for free.

  Nesting order here is a dependency order: a provider may only inject from one
  above it.

  These are mounted for unauthenticated routes too (/login/callback, the not-found
  catch-all), so a provider must not fetch merely because it exists.
  ReadingCycleProvider waits for auth0 to report a session.
-->
<template>
  <v-app>
    <NavigationProvider>
      <ReadingCycleProvider>
        <LeftDrawer />
        <v-main>
          <router-view />
        </v-main>
        <!-- <AppFooter /> -->
      </ReadingCycleProvider>
    </NavigationProvider>
  </v-app>
</template>
