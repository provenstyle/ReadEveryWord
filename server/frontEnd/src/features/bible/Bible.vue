<script setup lang="ts">
import Book from './Book.vue'

import { Bible } from '@read-every-word/domain'

const bible = new Bible()
console.log(bible)

</script>

<template>
  <div class="mx-4 my-2">
    <v-container>
      <v-row>
        <v-col>
          <h2>Old Testament</h2>
        </v-col>
      </v-row>
      <v-row dense>
        <v-col
          v-for="(book, index) in bible.oldTestament"
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
      <v-row>
        <v-col>
          <h2>New Testament</h2>
        </v-col>
      </v-row>
      <v-row dense>
        <v-col
          v-for="(book, index) in bible.newTestament"
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
  </div>
</template>

<style>
</style>