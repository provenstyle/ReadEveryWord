<script setup lang="ts">
import {  inject, ref } from 'vue'
import { type NavigationProvider } from './NavigationProvider.vue'
import { type ReadingCycleContext } from '@/features/readingCycle/ReadingCycleProvider.vue'
import { useAuth0 } from '@auth0/auth0-vue'
import { featureFlags } from '@/config/featureFlags'

const auth = useAuth0()

const navigation = inject<NavigationProvider>('navigation')
if (!navigation) throw new Error('NavigationProvider is required')

const readingCycles = inject<ReadingCycleContext>('readingCycles')
if (!readingCycles) throw new Error('ReadingCycleContext is required')

// The group starts open so the active cycle is visible without a click.
const openGroups = ref(['ReadingCycles'])

const logout = async () => {
  await auth.logout({
    logoutParams: {
      returnTo: window.location.origin
    }
  })
}
</script>

<template>
  <v-navigation-drawer
    v-model="navigation.leftDrawer.value"
    location="left"
  >
    <v-list
      v-model:opened="openGroups"
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
      <v-list-group value="ReadingCycles">
        <template #activator="{ props: groupProps }">
          <v-list-item
            v-bind="groupProps"
            nav
            prepend-icon="mdi-book-multiple-outline"
            title="Reading Cycles"
          />
        </template>
        <v-list-item
          v-for="cycle in readingCycles.cycles.value"
          :key="cycle.id"
          nav
          link
          :active="cycle.default"
          :prepend-icon="cycle.default ? 'mdi-check-circle' : 'mdi-circle-outline'"
          :title="cycle.name"
          @click.prevent="readingCycles.setActive(cycle.id)"
        />
        <v-list-item
          nav
          link
          prepend-icon="mdi-pencil"
          title="Manage"
          to="/reading-cycles"
        />
      </v-list-group>
      <v-list-item
        v-if="featureFlags.enablePray"
        nav
        link
        prepend-icon="mdi-hands-pray"
        title="Pray"
        to="/pray"
      />
      <v-list-item
        v-if="featureFlags.enableMemorize"
        nav
        link
        prepend-icon="mdi-head-heart-outline"
        title="Memorize"
        to="/memorize"
      />
      <v-list-item
        v-if="featureFlags.enableJournal"
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
          @click.prevent="logout"
        />
      </v-list>
    </template>
  </v-navigation-drawer>
</template>

<style scoped>
</style>