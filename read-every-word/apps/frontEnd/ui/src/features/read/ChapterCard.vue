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

// The provider owns chapter.read and repaints on success, so there is nothing to
// update here.
const clicked = async () => {
  await (chapter.read
    ? bibleContext.unreadChapter(props.bookId, props.chapterId)
    : bibleContext.readChapter(props.bookId, props.chapterId))
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
  <!--
    A completed cycle is read only, but the chapter still has to show whether it was
    read, so this stays a styled button rather than going grey and losing the colour
    the whole grid is read by.
  -->
  <v-btn
    :class="['w-100', color, complete]"
    variant="text"
    :ripple="!bibleContext.readOnly.value"
    :style="bibleContext.readOnly.value ? 'cursor: default' : undefined"
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