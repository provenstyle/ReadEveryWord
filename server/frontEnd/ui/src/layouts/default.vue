<script lang="ts" setup>
import LeftDrawer from '@/features/navigation/LeftDrawer.vue'
import NavigationProvider from '@/features/navigation/NavigationProvider.vue'
</script>

<template>
  <v-app>
    <NavigationProvider>
      <LeftDrawer />
      <v-main>
        <router-view />
      </v-main>
      <!-- <AppFooter /> -->
    </NavigationProvider>
  </v-app>
</template>

