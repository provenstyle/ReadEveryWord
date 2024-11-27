<script setup lang="ts">
import BookCardWithButtons from './BookCardWithButtons.vue'
import { Bible, Book } from '@read-every-word/domain'
import { inject, ref } from 'vue'
import { chunk } from 'lodash'

const bible = inject<Bible>('bible')

const leftDrawer = ref(false)
const open = ref(['ReadingCycles'])
</script>

<template>
  <div class="max-width">
    <v-toolbar
      border
      density="compact"
      class="sticky-toolbar"
    >
      <v-app-bar-nav-icon
        @click="leftDrawer = !leftDrawer"
      />
      <v-spacer />
    </v-toolbar>

    <v-navigation-drawer
      v-model="leftDrawer"
      location="left"
    >
      <v-list
        v-model:opened="open"
        nav
        density="compact"
      >
        <v-list-group value="ReadingCycles">
          <template #activator="{ props }">
            <v-list-item
              v-bind="props"
              prepend-icon="mdi-book-open-page-variant-outline"
              title="Reading Cycles"
            />
          </template>
          <v-list-item
            link
            title="First Time Through"
          />
          <v-list-item
            link
            title="With Heather"
          />
          <v-list-item
            link
            title="With Atlas"
          />
          <v-list-item
            link
            title="Manage"
            prepend-icon="mdi-pencil"
          />
        </v-list-group>
      </v-list>
      <template v-slot:append>
        <v-list
          nav
          density="comfortable"
        >
          <v-list-item
            link
            prepend-icon="mdi-logout"
            title="Sign Out"
          />
        </v-list>
      </template>
    </v-navigation-drawer>

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