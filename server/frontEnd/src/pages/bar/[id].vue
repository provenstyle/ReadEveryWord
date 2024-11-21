<script lang="ts" setup>
import { useRoute } from 'vue-router'

const route = useRoute('/bar/[id]')
</script>

<template>
  <h1>Bar</h1>
  Id: {{ route.params.id }}
</template>

