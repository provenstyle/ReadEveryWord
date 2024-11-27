<script setup lang="ts">
import { useRouter } from 'vue-router'
import { Bible } from '@read-every-word/domain'
import { inject, computed } from 'vue'

const props = defineProps<{
  id: number,
  longName: string,
  shortName: string
}>()

const bible = inject<Bible>('bible')
const book = bible.books[props.id]
const router = useRouter()

const goToBook = () => {
  router.push(`1/book/${props.id}`)
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
  <div
    :class="['pt-2', 'pb-2', 'text-center', color]"
    style="font-weight: 300;"
    @click.prevent="goToBook"
  >
    {{ book.shortName }}
  </div>
</template>

<style>
</style>