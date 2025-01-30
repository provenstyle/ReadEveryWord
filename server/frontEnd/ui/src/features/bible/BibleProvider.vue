<script setup lang="ts">
import { isErr } from '@read-every-word/infrastructure'
import { Bible, type ReadingCycle } from '@read-every-word/domain'
import { Client } from '@read-every-word/bff'
import { useAuth0 } from '@auth0/auth0-vue'

import {
  onMounted, provide,
  ref, type Ref,
  reactive, type Reactive,
} from 'vue'

const auth = useAuth0()

export interface BibleContext {
  bible: Reactive<Bible>
  fetch: () => Promise<void>
  readChapter: (bookId: number, chapterId: number) => Promise<boolean>
  unreadChapter: (bookId: number, chapterId: number) => Promise<boolean>
  working: Ref<boolean>
  errorMessage: Ref<string | undefined>
}

const client = new Client(window.location.origin, auth.getAccessTokenSilently)
const bible = reactive(new Bible())
const readingCycle = ref<ReadingCycle | undefined>(undefined)
const working = ref(false)
const errorMessage = ref<string | undefined>()

const fetch = async () => {
  working.value = true
  const readSummaryResult = await client.readSummary.get()
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
    for(const record of readSummary.readingRecords) {
      bible.books[record.bookId].chapters[record.chapterId].read = true
    }
  }
  working.value = false
}

const readChapter = async (bookId: number, chapterId: number): Promise<boolean> => {
  if (!readingCycle.value) return false

  const createResult = await client.readingRecord.create({
    bookId,
    chapterId,
    dateRead: new Date().toISOString(),
    readingCycleId: readingCycle.value.id
  })
  return (isErr(createResult)) ? false : true
}

const unreadChapter = async (bookId: number, chapterId: number): Promise<boolean> => {
  if (!readingCycle.value) return false

  const deleteResult = await client.readingRecord.delete({
    bookId,
    chapterId,
    readingCycleId: readingCycle.value.id
  })
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

</script>

<template>
  <slot />
</template>
