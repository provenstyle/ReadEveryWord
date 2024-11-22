<script setup lang="ts">
import { Bible } from '@read-every-word/domain'
import { inject } from 'vue'
import { useRouter } from 'vue-router'
import ChapterCard from './ChapterCard.vue'

const router = useRouter()

const props = defineProps<{
  id: number
}>()

const bible = inject<Bible>('bible')
const book = bible.books[props.id]

</script>

<template>
  <v-container>
    <v-row>
      <v-col>
        <v-btn
          icon="mdi-arrow-left"
          @click="router.back()"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <h2>{{ book.longName }}</h2>
      </v-col>
    </v-row>
    <v-row dense>
      <v-col
        v-for="(chapter, index) in book.chapters"
        :key="index"
        cols="6"
        sm="3"
        md="2"
        lg="1"
      >
        <ChapterCard
          :book-id="book.id"
          :chapter-id="chapter.id"
          :number="chapter.number"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<style>
</style>