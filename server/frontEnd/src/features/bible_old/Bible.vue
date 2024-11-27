<script setup lang="ts">
import BookCard from './BookCard.vue'
import { Bible } from '@read-every-word/domain'
import { inject } from 'vue'

const bible = inject<Bible>('bible')

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
          <BookCard
            :id="book.id"
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
          <BookCard
            :id="book.id"
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