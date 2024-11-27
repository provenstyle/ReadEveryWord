<script setup lang="ts">
import BookCard from './BookCard.vue'
import BookCardWithButtons from './BookCardWithButtons.vue'
import { Bible, Book } from '@read-every-word/domain'
import { inject } from 'vue'
import { chunk } from 'lodash'

const bible = inject<Bible>('bible')
const oldTestamentRows = chunk<Book>(bible.oldTestament, 9)

// const spacer = new Book(99, 'spacer', 'spacer', 1)
// oldTestamentRows[4].push(spacer)
// console.log(oldTestamentRows[4])

</script>

<template>
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
      v-for="(rowOfBooks, index1) in oldTestamentRows"
      :key="index1"
      class="d-flex"
    >
      <div
        v-for="(book, index2) in rowOfBooks"
        :key="index2"
        :class="['book', `book-row-${index1}`]"
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
        style="flex: 1 0 calc(100% / 9 - 110px);"
        class=""
      >
        <BookCard
          :id="book.id"
          :long-name="book.longName"
          :short-name="book.shortName"
        />
      </div>
    </div>
  </div>

</template>

<style scoded>
.book {
  flex: 0 0 calc((100% / 9) - 4px);
  margin: 2px 2px;
  flex-shrink: 0;
}
.book-row-4 {
  flex: 0 0 calc((100% / 9) - 4px);
  margin: 2px 2px;
}
</style>