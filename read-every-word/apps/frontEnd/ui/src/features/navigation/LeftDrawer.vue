<script setup lang="ts">
import {  inject, ref } from 'vue'
import { useRouter } from 'vue-router'
import { type NavigationProvider } from './NavigationProvider.vue'
import { type ReadingCycleContext } from '@/features/readingCycle/ReadingCycleProvider.vue'
import NewCycleDialog from '@/features/readingCycle/NewCycleDialog.vue'
import { useAuth0 } from '@auth0/auth0-vue'
import { featureFlags } from '@/config/featureFlags'

const auth = useAuth0()
const router = useRouter()

const navigation = inject<NavigationProvider>('navigation')
if (!navigation) throw new Error('NavigationProvider is required')

const readingCycles = inject<ReadingCycleContext>('readingCycles')
if (!readingCycles) throw new Error('ReadingCycleContext is required')

const newCycleOpen = ref(false)

// Picking a cycle is only ui state, so it also takes you to the thing it changes.
const readCycle = async (id: string) => {
  readingCycles.setActive(id)
  await router.push('/read')
}

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
      <!--
        The cycles sit under Read rather than behind a "Reading Cycles" heading:
        a cycle is just which set of progress you are reading against, not a
        separate part of the app.
      -->
      <v-list-item
        v-for="cycle in readingCycles.cycles.value"
        :key="cycle.id"
        nav
        link
        class="cycle"
        density="compact"
        :active="cycle.id === readingCycles.activeCycleId.value"
        :title="cycle.name"
        @click.prevent="readCycle(cycle.id)"
      >
        <template #append>
          <!-- Marks the default: the cycle the ui starts on next time. -->
          <v-icon
            v-if="cycle.default"
            icon="mdi-star"
            size="x-small"
          />
        </template>
      </v-list-item>
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
    <template #append>
      <v-list
        nav
        density="comfortable"
      >
        <v-list-item
          link
          prepend-icon="mdi-plus"
          title="New Cycle"
          @click.prevent="newCycleOpen = true"
        />
        <v-list-item
          link
          prepend-icon="mdi-logout"
          title="Sign Out"
          @click.prevent="logout"
        />
      </v-list>
    </template>
  </v-navigation-drawer>

  <NewCycleDialog v-model="newCycleOpen" />
</template>

<style scoped>
.cycle {
  padding-inline-start: 32px !important;
}
</style>
