<script setup lang="ts">
import { Chapter } from '@read-every-word/domain'
import { inject } from 'vue'
import { useRouter } from 'vue-router'
import ChapterCard from './ChapterCard.vue'
import { chunk } from 'lodash'
import { type BibleContext } from '@/features/read/BibleProvider.vue'

const router = useRouter()

const props = defineProps<{
  id: number
}>()

const bibleContext = inject<BibleContext>('bible')
if (!bibleContext) throw new Error('BibleContext is required')

const book = bibleContext.bible.books[props.id]

const readAll = () => {
  for (const chapter of book.chapters) {
    if (!chapter.read) {
      bibleContext
        .readChapter(book.id, chapter.id)
        .then((result) => {
          if (result) {
            chapter.read = true
          }
        })
    }
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

        <v-spacer />

        <v-menu>
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