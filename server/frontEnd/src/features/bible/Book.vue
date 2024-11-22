<script setup lang="ts">
  defineProps<{
    name: string,
    shortName: string
  }>()
</script>

<template>
  <v-card>
    <v-card-title class="text-body-2">
      {{ name }}
    </v-card-title>
  </v-card>
</template>

<style>
</style>