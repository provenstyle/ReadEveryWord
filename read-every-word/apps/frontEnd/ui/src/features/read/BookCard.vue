<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { inject, computed } from 'vue'
import { type BibleContext } from '@/features/read/BibleProvider.vue'

const props = defineProps<{
  id: number,
  longName: string,
  shortName: string
}>()

const bibleContext = inject<BibleContext>('bible')
if (!bibleContext) throw new Error('BibleContext is required')

const book = bibleContext.bible.books[props.id]
const router = useRouter()
const route = useRoute()

const goToBook = () => {
  // The query carries which cycle is being read, so it has to come along or the
  // book page silently drops back to the default cycle.
  router.push({ path: `/read/book/${props.id}`, query: route.query })
}

const complete = computed(() => {
  if (book.percentComplete === 1) {
      return 'complete'
  }
  return ''
})

const color = computed(() => {
  if (book.percentComplete === 1) {
      return 'bg-green-darken-1'
  }
  return ''
})

const buttonVariant = computed(() => {
  if (book.percentComplete === 1) {
     return 'text'
  }
  if (book.percentComplete > 0) {
    return 'outlined'
  }
  return 'text'
})

</script>

<template>
  <v-btn
    :class="['w-100', color, complete]"
    :variant="buttonVariant"
    @click.prevent="goToBook"
  >
    <span class="d-md-none">
      {{ book.shortName }}
    </span>
    <span class="d-none d-md-flex ">
      {{ book.longName }}
    </span>
    <v-icon
      v-if="book.percentComplete === 1"
      class="check"
      size="x-small"
    >
      mdi-check
    </v-icon>
  </v-btn>
</template>

<style scoped>
.v-btn {
  padding: 0 !important;
  text-transform: none;
  font-weight: 300;
  min-width: unset;
}
::v-deep.v-btn.complete .v-btn__content {
  margin-top: 8px
}
.check {
  position: absolute;
  top: 2px;
}
</style>