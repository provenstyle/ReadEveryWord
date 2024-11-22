<script setup lang="ts">
import Book from './Book.vue'

import { Bible } from '@read-every-word/domain'

const bible = new Bible()
console.log(bible)

</script>

<template>
  <div class="mx-4 my-2">
    <h2>Old Testament</h2>

    <v-container>
      <v-row dense>
        <v-col
          v-for="(book, index) in bible.books"
          :key="index"
          cols="6"
          sm="3"
          md="2"
          xl="1"
        >
          <Book
            :name="book.longName"
            :short-name="book.shortName"
          />
        </v-col>
      </v-row>
    </v-container>

    <h2>New Testament</h2>

    <v-container>
      <v-row>
        <v-col
          cols="2"
        >
          <Book
            name="Matthew"
            short-name="Mat"
          />
        </v-col>
        <v-col
          cols="2"
        >
          <Book
            name="Revelation"
            short-name="Rev"
          />
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<style>
/* .v-row {
  margin: 0 !important;
}

.v-col {
  padding:  !important;
} */

/* .v-text-field {
    margin: 0;
    padding: 0;
} */
</style>