<script setup lang="ts">
import { Bible, Chapter } from '@read-every-word/domain'
import { inject } from 'vue'
import { useRouter } from 'vue-router'
import ChapterCard from './ChapterCard.vue'
import { chunk } from 'lodash'

const router = useRouter()

const props = defineProps<{
  id: number
}>()

const bible = inject<Bible>('bible')
const book = bible.books[props.id]

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