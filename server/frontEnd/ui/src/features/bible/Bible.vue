<script setup lang="ts">
import BookCard from './BookCard.vue'
import { Bible, Book } from '@read-every-word/domain'
import { inject } from 'vue'
import { chunk } from 'lodash'
import { type NavigationProvider } from '@/features/navigation/NavigationProvider.vue'

const bible = inject<Bible>('bible')
if (!bible) throw new Error('BibleProvider is required')

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

    <div class="px-2 mt-4">
      <h2 class="">Old Testament</h2>

      <div
        v-for="(rowOfBooks, index1) in chunk<Book>(bible.oldTestament, 9)"
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
        v-for="(rowOfBooks, index1) in chunk<Book>(bible.newTestament, 9)"
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
</template>

<style scoped>
.book {
  flex: 0 0 calc((100% / 9) - 4px);
  margin: 2px 2px;
}
</style>