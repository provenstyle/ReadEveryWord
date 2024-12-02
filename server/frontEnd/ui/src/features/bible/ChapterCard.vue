<script setup lang="ts">
import { inject } from 'vue'
import { Bible } from '@read-every-word/domain'

const props = defineProps<{
  bookId: number,
  chapterId: number
}>()

const bible = inject<Bible>('bible')
if (!bible) throw new Error('BibleProvider is required')
const chapter = bible.books[props.bookId].chapters[props.chapterId]

const clicked = () => {
  chapter.read = !chapter.read
}

const color = computed(() => {
  if (chapter.read) {
    return 'bg-green-darken-1'
  }
  return ''
})

const complete = computed(() => {
  if (chapter.read) {
      return 'complete'
  }
  return ''
})
</script>

<template>
  <v-btn
    :class="['w-100', color, complete]"
    variant="text"
    @click.prevent="clicked"
  >
    <span class="">
      {{ chapter.number }}
    </span>
    <v-icon
      v-if="chapter.read"
      class="check"
      size="x-small"
    >
      mdi-check
    </v-icon>
  </v-btn>
</template>

<style scoped>
.v-btn {
  padding: 0 !important;
  text-transform: none;
  font-weight: 300;
  min-width: unset;
}
::v-deep.v-btn.complete .v-btn__content {
  margin-top: 8px
}
.check {
  position: absolute;
  top: 2px;
}
</style>