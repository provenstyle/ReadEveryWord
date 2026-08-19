<script setup lang="ts">
import {  inject, ref } from 'vue'
import { useRouter } from 'vue-router'
import { type NavigationProvider } from './NavigationProvider.vue'
import { type ReadingCycleContext } from '@/features/readingCycle/ReadingCycleProvider.vue'
import { queryForCycle } from '@/features/readingCycle/activeCycleUrl'
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

// Naming the cycle in the url is what switches it, so this one navigation both
// selects the cycle and takes you to the thing it changes.
//
// The default is left unnamed rather than pinned. That keeps the common url clean,
// and it means an unnamed url is always the default -- which is what lets the read
// page paint from the shared summary instead of asking for records again.
const readCycle = async (id: string) => {
  const isDefault = id === readingCycles.defaultCycle.value?.id
  await router.push(isDefault
    ? { path: '/read' }
    : { path: '/read', query: queryForCycle(id) })
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
        class="nested"
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
      <!--
        Last in the list it adds to, and indented with it, so the + reads as
        "another one of these" without needing a heading to explain itself.
      -->
      <v-list-item
        nav
        link
        class="nested"
        density="compact"
        prepend-icon="mdi-plus"
        title="New Reading Cycle"
        @click.prevent="newCycleOpen = true"
      />
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
/* Indents the reading cycles, and the row that adds one, under Read. */
.nested {
  padding-inline-start: 32px !important;
}
</style>
