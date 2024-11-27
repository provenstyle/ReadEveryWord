<script setup lang="ts">
import { provide, ref, type Ref } from 'vue'

export interface NavigationProvider {
  toggleLeftDrawer: () => void
  leftDrawer: Ref<boolean>
}

const leftDrawer = ref(true)

const navigationProvider = {
  toggleLeftDrawer: () => {
    leftDrawer.value = !leftDrawer.value
  },
  leftDrawer
} satisfies NavigationProvider

provide('navigation', navigationProvider)

</script>

<template>
  <slot />
</template>
