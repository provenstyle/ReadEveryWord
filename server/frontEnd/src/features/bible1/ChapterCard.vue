<script setup lang="ts">
import { inject } from 'vue'
import { Bible } from '@read-every-word/domain'

const props = defineProps<{
  bookId: number,
  chapterId: number
}>()

const bible = inject<Bible>('bible')
console.log('*********************')
console.log(bible)
console.log(props)

const book = bible.books[props.bookId]
const chapter = bible.books[props.bookId].chapters[props.chapterId]

const clicked = () => {
  chapter.read = !chapter.read
}

const color = computed(() => {
  console.log(book.percentComplete)
  if (!chapter.read) return ''

  switch(true) {
    case book.percentComplete === 1:
      return 'bg-light-blue-darken-4'
    case book.percentComplete > 0:
      return 'bg-light-blue-lighten-2'
    default:
      return ''
  }
})
</script>

<template>
  <v-card
    :class="color"
    @click="clicked"
  >
    <v-card-title class="text-body-2 text-center">
      {{ chapter.number }}
    </v-card-title>
  </v-card>
</template>

<style>
</style>