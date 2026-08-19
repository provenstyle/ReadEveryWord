<script setup lang="ts">
import { computed, inject, ref, watch } from 'vue'
import { type ReadingCycleContext } from '@/features/readingCycle/ReadingCycleProvider.vue'

const open = defineModel<boolean>({ required: true })

const readingCycles = inject<ReadingCycleContext>('readingCycles')
if (!readingCycles) throw new Error('ReadingCycleContext is required')

const name = ref('')
const saving = ref(false)

// The api accepts an empty name and then silently ignores it, so the only
// meaningful check happens here.
const trimmedName = computed(() => name.value.trim())
const nameIsValid = computed(() => trimmedName.value.length > 0)

const submit = async () => {
  if (!nameIsValid.value) return
  saving.value = true
  const created = await readingCycles.create(trimmedName.value)
  saving.value = false
  if (created) open.value = false
}

// Cleared as the dialog opens rather than after it closes, so a cancelled or
// previously created name never flashes on screen.
watch(open, (isOpen) => {
  if (isOpen) name.value = ''
})
</script>

<template>
  <v-dialog
    v-model="open"
    max-width="420"
  >
    <v-card title="New Reading Cycle">
      <v-card-text>
        <v-text-field
          v-model="name"
          autofocus
          label="Name"
          placeholder="2nd Time Through"
          @keyup.enter="submit()"
        />
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn
          variant="text"
          @click.prevent="open = false"
        >
          Cancel
        </v-btn>
        <v-btn
          variant="outlined"
          :disabled="!nameIsValid"
          :loading="saving"
          @click.prevent="submit()"
        >
          Create
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
