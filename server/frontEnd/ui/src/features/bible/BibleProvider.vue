<script setup lang="ts">
import { useAuth0 } from '@auth0/auth0-vue'
import { isErr } from '@read-every-word/infrastructure'
import { Bible } from '@read-every-word/domain'
import { Client } from '@read-every-word/bff'
import { provide, reactive } from 'vue'
import { onBeforeMount, ref } from 'vue'

const auth = useAuth0()
const bible = reactive<Bible>(new Bible())
provide('bible', bible)

const errorFetchingData = ref(false)

onBeforeMount(async () => {
  const client = new Client(window.location.origin, auth.getAccessTokenSilently)

  const readSummaryResult = await client.readSummary.get()
  if(isErr(readSummaryResult))
  {
    errorFetchingData.value = true
  } else {
    const readSummary = readSummaryResult.data
    for(const record of readSummary.readingRecords) {
      bible.books[record.bookId].chapters[record.chapterId].read = true
    }
  }
})

</script>

<template>
  <slot />
</template>
