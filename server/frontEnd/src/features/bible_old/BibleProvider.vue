<script setup lang="ts">
import { Bible } from '@read-every-word/domain'
import { provide, reactive } from 'vue'

const bible = reactive(new Bible())

provide('bible', bible)
</script>

<template>
  <slot />
</template>
