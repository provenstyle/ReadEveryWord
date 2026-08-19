<script setup lang="ts">
import { isErr, type Result } from '@read-every-word/foundation'
import {
  type GetReadSummaryFailed,
  type ReadingCycle,
  type ReadingSummary,
} from '@read-every-word/domain'
import { createAuthenticatedApiClient } from '@/api/client'
import { fromTrpc, type TransportFailed } from '@/api/result'
import { cycleIdFromQuery } from '@/features/readingCycle/activeCycleUrl'
import { useAuth0 } from '@auth0/auth0-vue'
import { useRoute } from 'vue-router'

import {
  computed, type ComputedRef,
  provide, ref, type Ref, watch,
} from 'vue'

const auth = useAuth0()
const route = useRoute()

/**
 * Active and default are deliberately different things.
 *
 * `active` is which cycle the ui is currently showing. It is not persisted cycle
 * state; it is read out of the url (see activeCycleUrl.ts), so it survives a
 * refresh but belongs to the address rather than to the user's data. Change it by
 * navigating with the cycle query key.
 *
 * `default` is the persisted flag on the row. It decides which cycle the ui
 * starts on when the url names none, and it is the one readSummary.get reads.
 * Changing it is an explicit user action (makeDefault), not a side effect of
 * looking at another cycle.
 */
export type ReadSummaryResult = Result<ReadingSummary, GetReadSummaryFailed | TransportFailed>

export interface ReadingCycleContext {
  cycles: Ref<ReadingCycle[]>
  activeCycleId: ComputedRef<string | undefined>
  activeCycle: ComputedRef<ReadingCycle | undefined>
  defaultCycle: ComputedRef<ReadingCycle | undefined>
  working: Ref<boolean>
  errorMessage: Ref<string | undefined>
  loadSummary: () => Promise<ReadSummaryResult>
  create: (name: string) => Promise<boolean>
  rename: (id: string, name: string) => Promise<boolean>
  markComplete: (id: string) => Promise<boolean>
  makeDefault: (id: string) => Promise<boolean>
}

const client = createAuthenticatedApiClient(auth)
const cycles = ref<ReadingCycle[]>([])
const working = ref(false)
const errorMessage = ref<string | undefined>()

const defaultCycle = computed(() => cycles.value.find(c => c.default))

/**
 * The url wins, but only once it names a cycle the user actually has. An id that
 * is stale, hand-edited, or from another account falls back to the default rather
 * than leaving the ui pointed at nothing.
 */
const activeCycleId = computed(() => {
  const requestedId = cycleIdFromQuery(route.query)
  const requestIsUsable = requestedId !== undefined
    && cycles.value.some(c => c.id === requestedId)

  return requestIsUsable
    ? requestedId
    : defaultCycle.value?.id ?? cycles.value[0]?.id
})

const activeCycle = computed(() => cycles.value.find(c => c.id === activeCycleId.value))

const byName = (a: ReadingCycle, b: ReadingCycle) => a.name.localeCompare(b.name)

const setAll = (all: ReadingCycle[]) => {
  cycles.value = [...all].sort(byName)
}

const replace = (updated: ReadingCycle) => {
  setAll(cycles.value.map(c => c.id === updated.id ? updated : c))
}

/**
 * The one readSummary.get of the session, shared by everyone who needs it.
 *
 * readingCycle.get would return the same list, but readSummary is not optional:
 * it is the only call that creates a first cycle for a brand new user, and it
 * hands back the default cycle's records at the same time. Fetching both would
 * mean asking for the cycle list twice.
 *
 * Memoising the promise rather than the result is what makes this
 * order-independent: whoever asks first starts the request and everyone after
 * awaits that same one, so no caller has to know whether another already ran.
 */
let summaryRequest: Promise<ReadSummaryResult> | undefined

const loadSummary = (): Promise<ReadSummaryResult> => {
  summaryRequest ??= (async () => {
    working.value = true
    const result = await fromTrpc(() => client.readSummary.get.mutate())
    if (isErr(result)) {
      errorMessage.value = 'Failed to get Reading Cycles'
    } else {
      setAll(result.data.readingCycles)
    }
    working.value = false
    return result
  })()

  return summaryRequest
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

  // Creating a cycle neither switches the ui to it nor changes the default; the
  // user picks it from the drawer when they want to read it.
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

const makeDefault = async (id: string): Promise<boolean> => {
  if (defaultCycle.value?.id === id) return true
  errorMessage.value = undefined

  const result = await fromTrpc(() => client.readingCycle.setDefault.mutate({ id }))
  if (isErr(result)) {
    errorMessage.value = 'Failed to set the default Reading Cycle'
    return false
  }

  // setDefault clears the flag on every other row server side; mirror that
  // locally rather than paying for another round trip. Which cycle is active is
  // untouched.
  setAll(cycles.value.map(c => ({ ...c, default: c.id === id })))
  return true
}

provide('readingCycles', {
  cycles,
  activeCycleId,
  activeCycle,
  defaultCycle,
  working,
  errorMessage,
  loadSummary,
  create,
  rename,
  markComplete,
  makeDefault
} satisfies ReadingCycleContext)

// This provider is mounted in the default layout, which also wraps
// unauthenticated pages, so it cannot fetch on mount: readSummary.get needs a
// token. Wait for auth0 to report a session instead.
//
// The drawer needs cycle names on every page, so this runs even where there is no
// Bible grid. On /read the grid asks for the same summary and gets this one.
watch(() => auth.isAuthenticated.value, async (isAuthenticated) => {
  if (isAuthenticated) await loadSummary()
}, { immediate: true })

</script>

<template>
  <slot />
</template>
