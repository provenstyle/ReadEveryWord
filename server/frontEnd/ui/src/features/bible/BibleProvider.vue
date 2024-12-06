<script setup lang="ts">
import { useAuth0 } from '@auth0/auth0-vue'
import { Bible } from '@read-every-word/domain'
import { provide, reactive } from 'vue'
import axios from 'axios'
import { onMounted } from 'vue'

const auth = useAuth0()
const bible = reactive(new Bible())

provide('bible', bible)

onMounted(async () => {
  const token = await auth.getAccessTokenSilently()
  const axiosConfig = {
    headers: {
        Authorization: `Bearer ${token}`
    }
  }

  axios.get('/api/healthCheck', axiosConfig)
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
