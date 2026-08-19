<script setup lang="ts">
import { isErr } from '@read-every-word/foundation'
import { type ReadingCycle } from '@read-every-word/domain'
import { createAuthenticatedApiClient } from '@/api/client'
import { fromTrpc } from '@/api/result'
import { useAuth0 } from '@auth0/auth0-vue'

import {
  computed, type ComputedRef,
  provide, ref, type Ref, watch,
} from 'vue'

const auth = useAuth0()

export interface ReadingCycleContext {
  cycles: Ref<ReadingCycle[]>
  activeCycle: ComputedRef<ReadingCycle | undefined>
  working: Ref<boolean>
  errorMessage: Ref<string | undefined>
  fetch: () => Promise<void>
  setAll: (cycles: ReadingCycle[]) => void
  create: (name: string) => Promise<boolean>
  rename: (id: string, name: string) => Promise<boolean>
  markComplete: (id: string) => Promise<boolean>
  setActive: (id: string) => Promise<boolean>
}

const client = createAuthenticatedApiClient(auth)
const cycles = ref<ReadingCycle[]>([])
const working = ref(false)
const errorMessage = ref<string | undefined>()

// Which cycle is active is not stored as a pointer anywhere; it is the one row
// carrying default: true. setDefault guarantees there is exactly one.
const activeCycle = computed(() => cycles.value.find(x => x.default))

const byName = (a: ReadingCycle, b: ReadingCycle) => a.name.localeCompare(b.name)

const setAll = (all: ReadingCycle[]) => {
  cycles.value = [...all].sort(byName)
}

const replace = (updated: ReadingCycle) => {
  setAll(cycles.value.map(c => c.id === updated.id ? updated : c))
}

// A brand new user has no cycles until readSummary.get creates their first one.
// If that landed while this query was in flight, an empty response here is stale
// and must not wipe out what it seeded.
const isStaleEmpty = (fetched: ReadingCycle[]) =>
  fetched.length === 0 && cycles.value.length > 0

const fetch = async () => {
  working.value = true
  errorMessage.value = undefined

  // readingCycle.get is a principalQuery: identity is the whole input, so it
  // takes no argument.
  const result = await fromTrpc(() => client.readingCycle.get.query())
  if (isErr(result)) {
    errorMessage.value = 'Failed to get Reading Cycles'
  } else if (!isStaleEmpty(result.data)) {
    setAll(result.data)
  }
  working.value = false
}

const create = async (name: string): Promise<boolean> => {
  errorMessage.value = undefined

  const result = await fromTrpc(() => client.readingCycle.create.mutate({
    name,
    dateStarted: new Date().toISOString()
  }))
  if (isErr(result)) {
    errorMessage.value = 'Failed to create Reading Cycle'
    return false
  }

  // create only marks a cycle default when it is the user's first, so this does
  // not change which cycle is active.
  setAll([...cycles.value, result.data])
  return true
}

const rename = async (id: string, name: string): Promise<boolean> => {
  errorMessage.value = undefined

  const result = await fromTrpc(() => client.readingCycle.update.mutate({ id, name }))
  if (isErr(result)) {
    errorMessage.value = 'Failed to rename Reading Cycle'
    return false
  }
  replace(result.data)
  return true
}

const markComplete = async (id: string): Promise<boolean> => {
  errorMessage.value = undefined

  const result = await fromTrpc(() => client.readingCycle.update.mutate({
    id,
    dateCompleted: new Date().toISOString()
  }))
  if (isErr(result)) {
    errorMessage.value = 'Failed to complete Reading Cycle'
    return false
  }
  replace(result.data)
  return true
}

const setActive = async (id: string): Promise<boolean> => {
  if (activeCycle.value?.id === id) return true
  errorMessage.value = undefined

  const result = await fromTrpc(() => client.readingCycle.setDefault.mutate({ id }))
  if (isErr(result)) {
    errorMessage.value = 'Failed to switch Reading Cycle'
    return false
  }

  // setDefault clears the flag on every other row server side; mirror that
  // locally rather than paying for another round trip.
  setAll(cycles.value.map(c => ({ ...c, default: c.id === id })))
  return true
}

provide('readingCycles', {
  cycles,
  activeCycle,
  working,
  errorMessage,
  fetch,
  setAll,
  create,
  rename,
  markComplete,
  setActive
} satisfies ReadingCycleContext)

// This provider is mounted in the default layout, which also wraps
// unauthenticated pages, so it cannot fetch on mount: readingCycle.get needs a
// token. Wait for auth0 to report a session instead.
watch(() => auth.isAuthenticated.value, async (isAuthenticated) => {
  if (isAuthenticated) await fetch()
}, { immediate: true })

</script>

<template>
  <slot />
</template>
