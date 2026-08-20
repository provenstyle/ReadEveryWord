<script setup lang="ts">
import BookCard from './BookCard.vue'
import type { Book } from '@read-every-word/domain'
import { inject } from 'vue'
import { chunk } from 'lodash-es'
import { type NavigationProvider } from '@/features/navigation/NavigationProvider.vue'
import { type BibleContext } from '@/features/read/BibleProvider.vue'
import { type ReadingCycleContext } from '@/features/readingCycle/ReadingCycleProvider.vue'
import ReadingCycleMenu from '@/features/readingCycle/ReadingCycleMenu.vue'
import { formatPercentComplete } from '@/features/read/percentComplete'

const bibleContext = inject<BibleContext>('bible')
if (!bibleContext) throw new Error('BibleContext is required')

const navigation = inject<NavigationProvider>('navigation')
if (!navigation) throw new Error('NavigationProvider is required')

const readingCycles = inject<ReadingCycleContext>('readingCycles')
if (!readingCycles) throw new Error('ReadingCycleContext is required')

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
      <!--
        Hand rolled rather than v-toolbar-title, which ellipsises everything it
        contains as one blob. Only the name should shorten; the star has to
        survive, because a long name is exactly when it would be cut.
      -->
      <div class="cycle">
        <span class="cycle-name">
          {{ readingCycles.activeCycle.value?.name }}
        </span>
        <!-- Marks the default: the cycle the ui starts on next time. -->
        <v-icon
          v-if="readingCycles.activeCycle.value?.default"
          icon="mdi-star"
          size="x-small"
          class="cycle-star"
        />
      </div>
      <ReadingCycleMenu />
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
        <h2 class="">
          Old Testament
          <span class="text-caption text-medium-emphasis">
            {{ formatPercentComplete(bibleContext.bible.oldTestamentPercentComplete) }}
          </span>
        </h2>

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

        <h2 class="mt-4">
          New Testament
          <span class="text-caption text-medium-emphasis">
            {{ formatPercentComplete(bibleContext.bible.newTestamentPercentComplete) }}
          </span>
        </h2>

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

/*
  Takes every pixel the nav icon and the menu are not using. There is no v-spacer
  next to it on purpose: v-spacer also grows, so the two would split the free
  space and the name would shorten at half the width it needs to.
*/
.cycle {
  display: flex;
  align-items: center;
  flex: 1 1 auto;
  min-width: 0;
  margin-inline-start: 4px;
  font-size: 1.1rem;
}

/* min-width:0 is what lets a flex item shrink below its content and ellipsise. */
.cycle-name {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.cycle-star {
  flex: 0 0 auto;
  margin-inline-start: 6px;
}
</style>