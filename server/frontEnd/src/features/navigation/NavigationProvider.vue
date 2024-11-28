<script setup lang="ts">
import { provide, ref, watchEffect, type Ref } from 'vue'
import { useDisplay } from 'vuetify'

const { xs, sm } = useDisplay();

export interface NavigationProvider {
  toggleLeftDrawer: () => void
  leftDrawer: Ref<boolean>
}

const leftDrawer = ref(false)

watchEffect(() => {
  leftDrawer.value = !(xs.value || sm.value);
})

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
