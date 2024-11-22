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
    case book.percentComplete == 1:
      return 'bg-light-blue-darken-4'
    case book.percentComplete > .9:
      return 'bg-light-blue-darken-3'
    case book.percentComplete > .8:
      return 'bg-light-blue-darken-2'
    case book.percentComplete > .7:
      return 'bg-light-blue-darken-1'
    case book.percentComplete > .6:
      return 'bg-light-blue'
    case book.percentComplete > .5:
      return 'bg-light-blue-lighten-1'
    case book.percentComplete > .4:
      return 'bg-light-blue-lighten-2'
    case book.percentComplete > .3:
      return 'bg-light-blue-lighten-3'
    case book.percentComplete > .2:
      return 'bg-light-blue-lighten-4'
    case book.percentComplete > 0:
      return 'bg-light-blue-lighten-5'
    default:
      return ''
  }
})
//      return 'bg-light-blue-lighten-5'
//      return 'bg-light-blue-lighten-4'
//      return 'bg-light-blue-lighten-3'
//      return 'bg-light-blue-lighten-2'
//      return 'bg-light-blue-lighten-1'
//      return 'bg-light-blue'
//      return 'bg-light-blue-darken-1'
//      return 'bg-light-blue-darken-2'
//      return 'bg-light-blue-darken-3'
//      return 'bg-light-blue-darken-4'

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