<script setup lang="ts">
import { useRouter } from 'vue-router'
const router = useRouter()
const props = defineProps<{
  id: number,
  name: string,
  shortName: string
}>()
const goToBook = () => {
  router.push(`book/${props.id}`)
}
</script>

<template>
  <v-card @click="goToBook">
    <v-card-title class="text-body-2">
      {{ name }}
    </v-card-title>
  </v-card>
</template>

<style>
</style>