<script setup lang="ts">
import { computed, inject, ref, watch } from 'vue'
import { type ReadingCycleContext } from '@/features/readingCycle/ReadingCycleProvider.vue'

const readingCycles = inject<ReadingCycleContext>('readingCycles')
if (!readingCycles) throw new Error('ReadingCycleContext is required')

const renameOpen = ref(false)
const completeOpen = ref(false)
const saving = ref(false)
const name = ref('')

// Everything here acts on the cycle currently on screen.
const cycle = computed(() => readingCycles.activeCycle.value)
const isDefault = computed(() => cycle.value?.default === true)
const isCompleted = computed(() => cycle.value?.dateCompleted !== undefined)

const trimmedName = computed(() => name.value.trim())
const nameIsValid = computed(() => trimmedName.value.length > 0)

// The error is provider level, so clear it as a dialog opens rather than show one
// left over from an earlier action.
watch(renameOpen, (isOpen) => {
  if (!isOpen) return
  name.value = cycle.value?.name ?? ''
  readingCycles.errorMessage.value = undefined
})

watch(completeOpen, (isOpen) => {
  if (isOpen) readingCycles.errorMessage.value = undefined
})

const submitRename = async () => {
  if (!nameIsValid.value || !cycle.value) return
  saving.value = true
  const renamed = await readingCycles.rename(cycle.value.id, trimmedName.value)
  saving.value = false
  if (renamed) renameOpen.value = false
}

const submitComplete = async () => {
  if (!cycle.value) return
  saving.value = true
  const completed = await readingCycles.markComplete(cycle.value.id)
  saving.value = false
  if (completed) completeOpen.value = false
}

const makeDefault = async () => {
  if (!cycle.value) return
  await readingCycles.makeDefault(cycle.value.id)
}
</script>

<template>
  <v-menu v-if="cycle">
    <template #activator="{ props: menuProps }">
      <v-btn
        icon
        variant="text"
        v-bind="menuProps"
      >
        <v-icon>mdi-dots-vertical</v-icon>
      </v-btn>
    </template>

    <v-list>
      <v-list-item
        title="Rename"
        prepend-icon="mdi-pencil"
        @click.prevent="renameOpen = true"
      />
      <v-list-item
        v-if="!isDefault"
        title="Make Default"
        subtitle="Start here next time"
        prepend-icon="mdi-star-outline"
        @click.prevent="makeDefault()"
      />
      <v-list-item
        v-if="!isCompleted"
        title="Mark Complete"
        prepend-icon="mdi-flag-checkered"
        @click.prevent="completeOpen = true"
      />
    </v-list>
  </v-menu>

  <v-dialog
    v-model="renameOpen"
    max-width="420"
  >
    <v-card title="Rename Reading Cycle">
      <v-card-text>
        <v-text-field
          v-model="name"
          autofocus
          label="Name"
          @keyup.enter="submitRename()"
        />
        <v-alert
          v-if="readingCycles.errorMessage.value"
          type="error"
          density="compact"
        >
          {{ readingCycles.errorMessage.value }}
        </v-alert>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn
          variant="text"
          @click.prevent="renameOpen = false"
        >
          Cancel
        </v-btn>
        <v-btn
          variant="outlined"
          :disabled="!nameIsValid"
          :loading="saving"
          @click.prevent="submitRename()"
        >
          Rename
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- Confirmed because there is no api to clear dateCompleted again. -->
  <v-dialog
    v-model="completeOpen"
    max-width="420"
  >
    <v-card title="Mark Complete">
      <v-card-text>
        Mark <strong>{{ cycle?.name }}</strong> complete? This cannot be undone.
        <v-alert
          v-if="readingCycles.errorMessage.value"
          type="error"
          density="compact"
          class="mt-4"
        >
          {{ readingCycles.errorMessage.value }}
        </v-alert>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn
          variant="text"
          @click.prevent="completeOpen = false"
        >
          Cancel
        </v-btn>
        <v-btn
          variant="outlined"
          :loading="saving"
          @click.prevent="submitComplete()"
        >
          Mark Complete
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
