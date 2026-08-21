<script setup lang="ts">
import { computed, inject, ref, watch } from 'vue'
import { BIBLE_CHAPTER_COUNT } from '@read-every-word/domain'
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

/**
 * Completing is what makes a cycle's history read only, so it is only offered once
 * the whole Bible has actually been read -- a cycle should not be freezable halfway.
 *
 * undefined means the count is not known yet rather than zero, which is why this
 * compares for equality instead of testing `>=`: unknown must not read as complete.
 */
const chaptersRead = computed(() => cycle.value
  ? readingCycles.chaptersReadByReadingCycleId.value[cycle.value.id]
  : undefined)

const canComplete = computed(() => chaptersRead.value === BIBLE_CHAPTER_COUNT)

// Says why the row is disabled, so it does not just look broken.
const completeSubtitle = computed(() => {
  if (canComplete.value) return undefined
  if (chaptersRead.value === undefined) return 'Still loading progress'

  const remaining = BIBLE_CHAPTER_COUNT - chaptersRead.value
  return remaining === 1
    ? '1 chapter still to read'
    : `${remaining} chapters still to read`
})

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
  // canComplete rechecked here, not just on the row: the dialog can be sitting open
  // while a chapter is unmarked in another tab.
  if (!cycle.value || !canComplete.value) return
  saving.value = true
  const completed = await readingCycles.markComplete(cycle.value.id)
  saving.value = false
  if (completed) completeOpen.value = false
}

/**
 * Rename and Mark Complete report a failure inside their own dialog. Reopen and Make
 * Default have no dialog to report into, so without this they set the provider's
 * errorMessage and nothing ever renders it -- the row is clicked, the request fails,
 * and the ui looks like it simply ignored you.
 */
const actionError = ref<string | undefined>()

// No confirmation: this only re-enables editing, and it is the way back from an
// accidental Mark Complete, so it should not itself be behind a gate.
const reopen = async () => {
  if (!cycle.value) return
  actionError.value = undefined
  if (!await readingCycles.reopen(cycle.value.id)) {
    actionError.value = readingCycles.errorMessage.value ?? 'Failed to reopen Reading Cycle'
  }
}

const makeDefault = async () => {
  if (!cycle.value) return
  actionError.value = undefined
  if (!await readingCycles.makeDefault(cycle.value.id)) {
    actionError.value = readingCycles.errorMessage.value ?? 'Failed to set the default Reading Cycle'
  }
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
        :subtitle="completeSubtitle"
        :disabled="!canComplete"
        prepend-icon="mdi-flag-checkered"
        @click.prevent="completeOpen = true"
      />
      <!--
        Replaces Mark Complete rather than sitting alongside it: a cycle is either
        finished or being read, and this is the one way back to editing.
      -->
      <v-list-item
        v-if="isCompleted"
        title="Reopen"
        subtitle="Edit the reading history again"
        prepend-icon="mdi-lock-open-variant-outline"
        @click.prevent="reopen()"
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

  <!-- The only feedback the dialog-less rows have, so failures are not swallowed. -->
  <v-snackbar
    :model-value="actionError !== undefined"
    color="error"
    timeout="6000"
    @update:model-value="actionError = undefined"
  >
    {{ actionError }}
  </v-snackbar>

  <!--
    Still confirmed, even though Reopen exists, because completing is what locks the
    reading history. The confirmation is there to say so, not to warn of permanence.
  -->
  <v-dialog
    v-model="completeOpen"
    max-width="420"
  >
    <v-card title="Mark Complete">
      <v-card-text>
        Mark <strong>{{ cycle?.name }}</strong> complete? Its reading history becomes
        read only. You can reopen it later if you need to change something.
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
