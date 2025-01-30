<script setup lang="ts">
import BookCard from './BookCard.vue'
import { Book } from '@read-every-word/domain'
import { inject } from 'vue'
import { chunk } from 'lodash'
import { type NavigationProvider } from '@/features/navigation/NavigationProvider.vue'
import { type BibleContext } from '@/features/bible/BibleProvider.vue'

const bibleContext = inject<BibleContext>('bible')
if (!bibleContext) throw new Error('BibleContext is required')

const navigation = inject<NavigationProvider>('navigation')
if (!navigation) throw new Error('NavigationProvider is required')

</script>

<template>
  <div class="max-width">
    <v-toolbar
      border
      density="compact"
      class="sticky-toolbar"
    >
      <v-app-bar-nav-icon
        @click.prevent="navigation.toggleLeftDrawer()"
      />
      <v-spacer />
    </v-toolbar>

    <div
      class="px-2 mt-4"
    >
      <div
        class="text-center"
        v-if="bibleContext.working.value"
      >
        <v-progress-circular class="mt-4" indeterminate></v-progress-circular>
      </div>
      <div
        class="text-center"
        v-if="bibleContext.errorMessage.value"
      >
        <v-alert
          type="error"
          class="ma-4"
        >
          {{ bibleContext.errorMessage.value }}
        </v-alert>
      </div>
      <div v-if="!bibleContext.working.value && !bibleContext.errorMessage.value">
        <h2 class="">Old Testament</h2>

        <div
          v-for="(rowOfBooks, index1) in chunk<Book>(bibleContext.bible.oldTestament, 9)"
          :key="index1"
          class="d-flex"
        >
          <div
            v-for="(book, index2) in rowOfBooks"
            :key="index2"
            :class="['book']"
          >
            <BookCard
              :id="book.id"
              :long-name="book.longName"
              :short-name="book.shortName"
            />
          </div>
        </div>

        <h2 class="mt-4">New Testament</h2>

        <div
          v-for="(rowOfBooks, index1) in chunk<Book>(bibleContext.bible.newTestament, 9)"
          :key="index1"
          class="d-flex"
        >
          <div
            v-for="(book, index2) in rowOfBooks"
            :key="index2"
            class="book"
          >
            <BookCard
              :id="book.id"
              :long-name="book.longName"
              :short-name="book.shortName"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.book {
  flex: 0 0 calc((100% / 9) - 4px);
  margin: 2px 2px;
}
</style>