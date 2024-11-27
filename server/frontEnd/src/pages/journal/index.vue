<script lang="ts" setup>
import { type NavigationProvider } from '@/features/navigation/NavigationProvider.vue'

const navigation = inject<NavigationProvider>('navigation')
if (!navigation) throw new Error('NavigationProvider is required')

</script>

<template>
  <v-toolbar
    border
    density="compact"
    class="sticky-toolbar"
  >
    <v-app-bar-nav-icon
      @click.prevent="navigation.toggleLeftDrawer()"
    />
    <v-spacer />
  </v-toolbar>

  <div class="px-2 mt-4">
    <h2>Journal</h2>
  </div>
</template>
