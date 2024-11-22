<script setup lang="ts">

const props = defineProps<{
  bookId: number,
  chapterId: number,
  number: number
}>()

const clicked = () => {
  console.log(`clicked: ${props.number}`)
}
</script>

<template>
  <v-card @click="clicked">
    <v-card-title class="text-body-2 text-center">
      {{ number }}
    </v-card-title>
  </v-card>
</template>

<style>
</style>