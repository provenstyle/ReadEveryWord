<script setup lang="ts">
import { useRouter } from 'vue-router'
import { Bible } from '@read-every-word/domain'
import { inject, computed } from 'vue'

const props = defineProps<{
  id: number,
  name: string,
  shortName: string
}>()

const bible = inject<Bible>('bible')
const book = bible.books[props.id]
const router = useRouter()

const goToBook = () => {
  router.push(`book/${props.id}`)
}

const color = computed(() => {
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
    @click="goToBook"
    :class="color"
  >
    <v-card-title class="text-body-2">
      {{ name }}
    </v-card-title>
  </v-card>
</template>

<style>
</style>