<script setup lang="ts">
import { isErr } from '@read-every-word/foundation'
import { Bible, type ReadingRecord } from '@read-every-word/domain'
import { createAuthenticatedApiClient } from '@/api/client'
import { fromTrpc } from '@/api/result'
import { type ReadingCycleContext } from '@/features/readingCycle/ReadingCycleProvider.vue'
import { useAuth0 } from '@auth0/auth0-vue'

import {
  inject, onMounted, provide,
  ref, type Ref,
  reactive, type Reactive, watch,
} from 'vue'

const auth = useAuth0()

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
 * The first load of the session. readSummary.get is the only call that lazily
 * creates a cycle for a brand new user, so it has to run before there is
 * anything to be active, and it returns the default cycle's records for free.
 */
const bootstrap = async () => {
  const readSummaryResult = await fromTrpc(() => client.readSummary.get.mutate())
  if(isErr(readSummaryResult))
  {
    errorMessage.value = 'Failed to get Read Summary'
    return
  }

  const readSummary = readSummaryResult.data
  const defaultReadingCycle = readSummary.readingCycles.find(x => x.default)
  if (!defaultReadingCycle) {
    errorMessage.value = 'No default Reading Cycle'
    return
  }

  // Claim the cycle before seeding, because setAll makes it active and the
  // watcher below would otherwise see a switch it has to reload for.
  loadedCycleId.value = defaultReadingCycle.id

  // readSummary.get is more current than anything readingCycle.get returned, so
  // share its list. setAll also starts the ui on the default cycle.
  readingCycles.setAll(readSummary.readingCycles)
  paintReadChapters(readSummary.readingRecords)
}

/** Any cycle other than the one readSummary would have handed us. */
const loadRecordsFor = async (readingCycleId: string) => {
  const result = await fromTrpc(() => client.readingRecord.get.query({ readingCycleId }))
  if (isErr(result)) {
    errorMessage.value = 'Failed to get Reading Records'
    return
  }
  loadedCycleId.value = readingCycleId
  paintReadChapters(result.data)
}

const fetch = async () => {
  working.value = true
  errorMessage.value = undefined

  const activeCycleId = readingCycles.activeCycleId.value
  if (activeCycleId) {
    await loadRecordsFor(activeCycleId)
  } else {
    await bootstrap()
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
