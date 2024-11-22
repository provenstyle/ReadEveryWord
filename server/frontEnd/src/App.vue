<script lang="ts" setup>
import BibleProvider from './features/bible/BibleProvider.vue'
</script>

<template>
  <v-app>
    <v-main>
      <bible-provider>
        <router-view />
      </bible-provider>
    </v-main>
  </v-app>
</template>

