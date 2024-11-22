<script setup lang="ts">
import { inject } from 'vue'

const props = defineProps<{
  bookId: number,
  chapterId: number,
  number: number
}>()

const bible = inject<Bible>('bible')
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
    case book.percentComplete >= 0.9:
      return 'bg-light-blue-darken-3'
    case book.percentComplete >= 0.8:
      return 'bg-light-blue-darken-2'
    case book.percentComplete >= 0.7:
      return 'bg-light-blue-darken-1'
    case book.percentComplete >= 0.6:
      return 'bg-light-blue'
    case book.percentComplete >= 0.5:
      return 'bg-light-blue-lighten-1'
    case book.percentComplete >= 0.4:
      return 'bg-light-blue-lighten-2'
    case book.percentComplete >= 0.3:
      return 'bg-light-blue-lighten-3'
    case book.percentComplete >= 0.15:
      return 'bg-light-blue-lighten-4'
    case book.percentComplete > 0:
      return 'bg-light-blue-lighten-5'
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
      {{ number }}
    </v-card-title>
  </v-card>
</template>

<style>
</style>