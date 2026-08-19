<script lang="ts" setup>
import LeftDrawer from '@/features/navigation/LeftDrawer.vue'
import NavigationProvider from '@/features/navigation/NavigationProvider.vue'
import ReadingCycleProvider from '@/features/readingCycle/ReadingCycleProvider.vue'
</script>

<template>
  <v-app>
    <NavigationProvider>
      <!--
        Reading cycles are provided here rather than under /read, because the
        drawer lists them and the drawer is a sibling of the router view.
      -->
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

