<script setup lang="ts">
import {  ref, inject } from 'vue'
import { type NavigationProvider } from './NavigationProvider.vue'

const navigation = inject<NavigationProvider>('navigation')
if (!navigation) throw new Error('NavigationProvider is required')

const open = ref(['ReadingCycles'])
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
      <v-list-group value="ReadingCycles">
        <template #activator="{ props }">
          <v-list-item
            v-bind="props"
            prepend-icon="mdi-book-open-page-variant-outline"
            title="Reading Cycles"
          />
        </template>
        <v-list-item
          link
          title="First Time Through"
        />
        <v-list-item
          link
          title="With Heather"
        />
        <v-list-item
          link
          title="With Atlas"
        />
        <v-list-item
          link
          title="Manage"
          prepend-icon="mdi-pencil"
        />
      </v-list-group>
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
.book {
  flex: 0 0 calc((100% / 9) - 4px);
  margin: 2px 2px;
}
</style>