<script setup lang="ts">
import type { Chapter } from '@read-every-word/domain'
import { inject } from 'vue'
import { useRouter } from 'vue-router'
import ChapterCard from './ChapterCard.vue'
import { chunk } from 'lodash-es'
import { type BibleContext } from '@/features/read/BibleProvider.vue'
import { formatPercentComplete } from '@/features/read/percentComplete'

const router = useRouter()

const props = defineProps<{
  id: number
}>()

const bibleContext = inject<BibleContext>('bible')
if (!bibleContext) throw new Error('BibleContext is required')

const book = bibleContext.bible.books[props.id]

// Not awaited, so the chapters fill in as their writes land. readChapter skips what
// is already read and owns the flag, so there is nothing to filter or set here.
const readAll = () => {
  for (const chapter of book.chapters) {
    bibleContext.readChapter(book.id, chapter.id)
  }
}

</script>

<template>
  <div class="max-width">
    <div class="sticky-toolbar">
      <v-toolbar
        border
        density="compact"
      >
        <v-btn icon>
          <v-icon
            @click.prevent="router.back()"
          >
            mdi-arrow-left
          </v-icon>
        </v-btn>

        {{ book.longName }}
        <span class="text-caption text-medium-emphasis ms-2">
          {{ formatPercentComplete(book.percentComplete) }}
        </span>

        <v-spacer />

        <!--
          The only thing in this menu edits the reading history, so a completed cycle
          leaves nothing to show rather than a menu of one disabled row.
        -->
        <v-menu v-if="!bibleContext.readOnly.value">
          <template #activator="{ props: menuProps }">
            <v-btn
              icon
              v-bind="menuProps"
            >
              <v-icon>mdi-dots-vertical</v-icon>
            </v-btn>
          </template>

          <v-list>
            <v-list-item
              title="Mark All As Read"
              @click.prevent="readAll()"
            />
          </v-list>
        </v-menu>
      </v-toolbar>
    </div>

    <div class="px-2 mt-4">
      <div
        v-for="(rowOfChapters, index1) in chunk<Chapter>(book.chapters, 9)"
        :key="index1"
        class="d-flex"
      >
        <div
          v-for="(chapter, index2) in rowOfChapters"
          :key="index2"
          class="chapter"
        >
          <ChapterCard
            :book-id="book.id"
            :chapter-id="chapter.id"
            :number="chapter.number"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.chapter {
  flex: 0 0 calc((100% / 9) - 4px);
  margin: 2px 2px;
}
</style>