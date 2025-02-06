<script setup lang="ts">
import { inject } from 'vue'
import { type BibleContext } from '@/features/read/BibleProvider.vue'

const props = defineProps<{
  bookId: number,
  chapterId: number
}>()

const bibleContext = inject<BibleContext>('bible')
if (!bibleContext) throw new Error('BibleContext is required')

const chapter = bibleContext.bible.books[props.bookId].chapters[props.chapterId]

const clicked = async () => {
  if (!chapter.read) {
    const result = await bibleContext.readChapter(props.bookId, props.chapterId)
    if (result) {
      chapter.read = true
    }
  } else {
    const result = await bibleContext.unreadChapter(props.bookId, props.chapterId)
    if (result) {
      chapter.read = false
    }
  }
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