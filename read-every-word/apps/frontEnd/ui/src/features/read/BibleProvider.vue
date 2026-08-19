<script setup lang="ts">
import { isErr } from '@read-every-word/foundation'
import { Bible, type ReadingCycle } from '@read-every-word/domain'
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
const readingCycle = ref<ReadingCycle | undefined>(undefined)
const working = ref(false)
const errorMessage = ref<string | undefined>()

// Mutated in place. BookCard and ChapterCard capture their book/chapter object
// at setup time, so replacing bible or its arrays would detach the whole grid.
const clearReadChapters = () => {
  for (const book of bible.books) {
    for (const chapter of book.chapters) {
      chapter.read = false
    }
  }
}

const fetch = async () => {
  working.value = true
  errorMessage.value = undefined

  const readSummaryResult = await fromTrpc(() => client.readSummary.get.mutate())
  if(isErr(readSummaryResult))
  {
    errorMessage.value = 'Failed to get Read Summary'
  } else {
    const readSummary = readSummaryResult.data
    const defaultReadingCycle = readSummary.readingCycles.find(x => x.default)
    if (!defaultReadingCycle) {
      errorMessage.value = 'No default Reading Cycle'
    }
    readingCycle.value = defaultReadingCycle

    // readSummary.get lazily creates the first cycle, so its list is more
    // current than anything readingCycle.get returned. Share it.
    readingCycles.setAll(readSummary.readingCycles)

    // readSummary only returns records for the default cycle, so a switch means
    // everything previously marked has to come off first.
    clearReadChapters()
    for(const record of readSummary.readingRecords) {
      bible.books[record.bookId].chapters[record.chapterId].read = true
    }
  }
  working.value = false
}

const readChapter = async (bookId: number, chapterId: number): Promise<boolean> => {
  if (!readingCycle.value) return false

  const createResult = await fromTrpc(() => client.readingRecord.create.mutate({
    bookId,
    chapterId,
    dateRead: new Date().toISOString(),
    readingCycleId: readingCycle.value!.id
  }))
  return (isErr(createResult)) ? false : true
}

const unreadChapter = async (bookId: number, chapterId: number): Promise<boolean> => {
  if (!readingCycle.value) return false

  const deleteResult = await fromTrpc(() => client.readingRecord.delete.mutate({
    bookId,
    chapterId,
    readingCycleId: readingCycle.value!.id
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

// Switching cycles changes which records readSummary returns, so the grid has to
// be reloaded. Comparing against the cycle fetch() actually loaded is what stops
// fetch's own setAll from bouncing straight back through here.
watch(() => readingCycles.activeCycle.value?.id, async (activeCycleId) => {
  if (!activeCycleId) return
  if (activeCycleId === readingCycle.value?.id) return
  await fetch()
})

</script>

<template>
  <slot />
</template>
