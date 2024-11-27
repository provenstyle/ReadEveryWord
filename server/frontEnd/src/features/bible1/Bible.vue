<script setup lang="ts">
import BookCardWithButtons from './BookCardWithButtons.vue'
import { Bible, Book } from '@read-every-word/domain'
import { inject } from 'vue'
import { chunk } from 'lodash'

const bible = inject<Bible>('bible')

</script>

<template>
  <div style="max-width: 1200px;">
    <v-toolbar
      border
      density="compact"
    >
      <v-app-bar-nav-icon />

      <v-spacer />

      <v-btn icon>
        <v-icon>mdi-dots-vertical</v-icon>
      </v-btn>
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
          <BookCardWithButtons
            :id="book.id"
            :long-name="book.longName"
            :short-name="book.shortName"
          />
        </div>
      </div>

      <h2 class="mt-4">New Testament</h2>

      <div
        v-for="(rowOfBooks, index1) in chunk<Bible>(bible.newTestament, 9)"
        :key="index1"
        class="d-flex"
      >
        <div
          v-for="(book, index2) in rowOfBooks"
          :key="index2"
          class="book"
        >
          <BookCardWithButtons
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