<script lang="ts" setup>
import { useRoute } from 'vue-router'
import Book from '@/features/bible1/Book.vue'

const route = useRoute('/book/[id]')
</script>

<template>
  <Book :id="route.params?.id" />
</template>

