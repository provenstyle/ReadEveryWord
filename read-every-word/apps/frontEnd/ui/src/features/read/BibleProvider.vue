<script setup lang="ts">
import { isErr } from '@read-every-word/foundation'
import { Bible, type ReadingRecord } from '@read-every-word/domain'
import { createAuthenticatedApiClient } from '@/api/client'
import { fromTrpc } from '@/api/result'
import { type ReadingCycleContext } from '@/features/readingCycle/ReadingCycleProvider.vue'
import { cycleIdFromQuery } from '@/features/readingCycle/activeCycleUrl'
import { useAuth0 } from '@auth0/auth0-vue'
import { useRoute } from 'vue-router'

import {
  inject, onMounted, provide,
  ref, type Ref,
  reactive, type Reactive, watch,
} from 'vue'

const auth = useAuth0()
const route = useRoute()

const readingCycles = inject<ReadingCycleContext>('readingCycles')
if (!readingCycles) throw new Error('ReadingCycleContext is required')

export interface BibleContext {
  bible: Reactive<Bible>
  fetch: () => Promise<void>
  readChapter: (bookId: number, chapterId: number) => Promise<boolean>
  unreadChapter: (bookId: number, chapterId: number) => Promise<boolean>
  working: Ref<boolean>
  errorMessage: Ref<string | undefined>
}

const client = createAuthenticatedApiClient(auth)
const bible = reactive(new Bible())
// Which cycle the grid currently shows. Tracked separately from the context's
// activeCycleId so the watcher below can tell an actual switch from the echo of
// our own bootstrap.
const loadedCycleId = ref<string | undefined>(undefined)
const working = ref(false)
const errorMessage = ref<string | undefined>()

// Mutated in place. BookCard and ChapterCard capture their book/chapter object
// at setup time, so replacing bible or its arrays would detach the whole grid.
const paintReadChapters = (records: ReadingRecord[]) => {
  for (const book of bible.books) {
    for (const chapter of book.chapters) {
      chapter.read = false
    }
  }
  for (const record of records) {
    bible.books[record.bookId].chapters[record.chapterId].read = true
  }
}

/**
 * The default cycle, painted from the session's shared readSummary rather than a
 * request of our own. readSummary already carries the default's records, so on a
 * first load of /read this costs nothing beyond the call the drawer was making
 * anyway.
 */
const paintFromSummary = async () => {
  const summaryResult = await readingCycles.loadSummary()
  if(isErr(summaryResult))
  {
    errorMessage.value = 'Failed to get Read Summary'
    return
  }

  const summary = summaryResult.data
  const defaultReadingCycle = summary.readingCycles.find(x => x.default)
  if (!defaultReadingCycle) {
    errorMessage.value = 'No default Reading Cycle'
    return
  }

  loadedCycleId.value = defaultReadingCycle.id
  paintReadChapters(summary.readingRecords)
}

/** Any cycle other than the one readSummary would have handed us. */
const loadRecordsFor = async (readingCycleId: string) => {
  // Claimed before awaiting, not after. The cycle list arriving is what lets
  // activeCycleId resolve, and if that happens while this request is still in
  // flight an unclaimed cycle looks to the watcher like a switch to load again.
  loadedCycleId.value = readingCycleId

  const result = await fromTrpc(() => client.readingRecord.get.query({ readingCycleId }))

  // Something newer was asked for while this was in flight, so this answer is no
  // longer the one on screen. Dropping it also keeps out-of-order responses from
  // painting stale progress.
  if (loadedCycleId.value !== readingCycleId) return

  if (isErr(result)) {
    errorMessage.value = 'Failed to get Reading Records'
    return
  }
  paintReadChapters(result.data)
}

const fetch = async () => {
  working.value = true
  errorMessage.value = undefined

  // Once the cycle list is in, activeCycleId is the trustworthy answer: it has
  // already checked the url against what the user actually has, and falls back to
  // the default when the url names something stale.
  //
  // Before then, on a pinned refresh, take the url at face value. Waiting for the
  // list would show the wrong progress in the meantime. If that optimism is wrong
  // the watcher below repairs it as soon as the list lands.
  const cyclesAreKnown = readingCycles.cycles.value.length > 0
  const requestedCycleId = cyclesAreKnown
    ? readingCycles.activeCycleId.value
    : cycleIdFromQuery(route.query)

  // The url names a cycle only when it is not the default, so nothing requested
  // means the default -- exactly what the shared summary already holds. Take it
  // from there on the first paint and spend no request at all.
  //
  // Only the first paint, though: the summary is fetched once and would be stale
  // for anything later, so a return trip to the default reloads for real.
  const isFirstPaint = loadedCycleId.value === undefined
  const wantsDefault = requestedCycleId === undefined
    || requestedCycleId === readingCycles.defaultCycle.value?.id

  if (isFirstPaint && wantsDefault) {
    await paintFromSummary()
  } else if (requestedCycleId) {
    await loadRecordsFor(requestedCycleId)
  }

  working.value = false
}

// Reads are recorded against the cycle on screen, which is the active one and not
// necessarily the default.
const readChapter = async (bookId: number, chapterId: number): Promise<boolean> => {
  const readingCycleId = loadedCycleId.value
  if (!readingCycleId) return false

  const createResult = await fromTrpc(() => client.readingRecord.create.mutate({
    bookId,
    chapterId,
    dateRead: new Date().toISOString(),
    readingCycleId
  }))
  return (isErr(createResult)) ? false : true
}

const unreadChapter = async (bookId: number, chapterId: number): Promise<boolean> => {
  const readingCycleId = loadedCycleId.value
  if (!readingCycleId) return false

  const deleteResult = await fromTrpc(() => client.readingRecord.delete.mutate({
    bookId,
    chapterId,
    readingCycleId
  }))
  return (isErr(deleteResult)) ? false : true
}

provide('bible', {
  bible,
  working,
  errorMessage,
  fetch,
  readChapter,
  unreadChapter
} satisfies BibleContext)

onMounted(async () => {
  await fetch()
})

// Picking a different cycle in the drawer only moves ui state, so reloading the
// grid to match is this provider's job. Comparing against what is already painted
// is what stops bootstrap's own setAll from bouncing straight back through here.
watch(() => readingCycles.activeCycleId.value, async (activeCycleId) => {
  if (!activeCycleId) return
  if (activeCycleId === loadedCycleId.value) return
  await fetch()
})

</script>

<template>
  <slot />
</template>
