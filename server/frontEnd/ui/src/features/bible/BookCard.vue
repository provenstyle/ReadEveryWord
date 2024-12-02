<script setup lang="ts">
import { useRouter } from 'vue-router'
import { Bible } from '@read-every-word/domain'
import { inject, computed } from 'vue'

const props = defineProps<{
  id: number,
  longName: string,
  shortName: string
}>()

const bible = inject<Bible>('bible')
if (!bible) throw new Error('BibleProvider is required')
const book = bible.books[props.id]
const router = useRouter()

const goToBook = () => {
  router.push(`read/book/${props.id}`)
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