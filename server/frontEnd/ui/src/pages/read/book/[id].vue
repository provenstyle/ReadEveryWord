<script lang="ts" setup>
import { useRoute } from 'vue-router'
import Book from '@/features/bible/Book.vue'

const route = useRoute('/read/book/[id]')
</script>

<template>
  <Book :id="Number(route.params?.id)" />
</template>

