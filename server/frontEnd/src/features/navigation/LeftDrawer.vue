<script setup lang="ts">
import {  inject } from 'vue'
import { type NavigationProvider } from './NavigationProvider.vue'

const navigation = inject<NavigationProvider>('navigation')
if (!navigation) throw new Error('NavigationProvider is required')

</script>

<template>
  <v-navigation-drawer
    v-model="navigation.leftDrawer.value"
    location="left"
  >
    <v-list
      v-model:opened="open"
      nav
      density="comfortable"
    >
      <v-list-item
        nav
        link
        prepend-icon="mdi-book-open-page-variant-outline"
        title="Read"
        to="/read"
      />
      <v-list-item
        nav
        link
        prepend-icon="mdi-hands-pray"
        title="Pray"
        to="/pray"
      />
      <v-list-item
        nav
        link
        prepend-icon="mdi-head-heart-outline"
        title="Memorize"
        to="/memorize"
      />
      <v-list-item
        nav
        link
        prepend-icon="mdi-notebook-outline"
        title="Journal"
        to="/journal"
      />
    </v-list>
    <template v-slot:append>
      <v-list
        nav
        density="comfortable"
      >
        <v-list-item
          link
          prepend-icon="mdi-logout"
          title="Sign Out"
        />
      </v-list>
    </template>
  </v-navigation-drawer>
</template>

<style scoped>
</style>