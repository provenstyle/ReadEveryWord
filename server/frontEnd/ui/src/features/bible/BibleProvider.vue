<script setup lang="ts">
import { Bible } from '@read-every-word/domain'
import { provide, reactive } from 'vue'
import axios from 'axios'
import { onMounted } from 'vue'

const bible = reactive(new Bible())

provide('bible', bible)

onMounted(() => {
  console.log('**********')
  axios.get('/api/healthCheck')
  .then((r) => {
    console.log(r)
  })
  .catch((e) => {
    console.log(e)
  })
})

</script>

<template>
  <slot />
</template>
