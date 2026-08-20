<script lang="ts" setup>
import BibleProvider from '@/features/read/BibleProvider.vue';
</script>

<!--
  BibleProvider is mounted here, not with the other providers in
  layouts/default.vue, because its consumers (Bible.vue, Book.vue) only exist
  under /read. Mounting it on the route makes its lifetime match its purpose:
  entering mounts and loads, leaving unmounts and discards. In the layout it would
  outlive its relevance and need a route check to ask whether it should act.

  This file is also what makes /read the parent route of /read/book/:id, which is
  what lets router/index.ts guard the subtree with a single beforeEnter.
-->
<template>
  <bible-provider>
    <router-view />
  </bible-provider>
</template>
