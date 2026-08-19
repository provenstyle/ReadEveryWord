<script setup lang="ts">
import { computed, inject, ref } from 'vue'
import { type ReadingCycle } from '@read-every-word/domain'
import { type ReadingCycleContext } from '@/features/readingCycle/ReadingCycleProvider.vue'
import { type NavigationProvider } from '@/features/navigation/NavigationProvider.vue'

const readingCycles = inject<ReadingCycleContext>('readingCycles')
if (!readingCycles) throw new Error('ReadingCycleContext is required')

const navigation = inject<NavigationProvider>('navigation')
if (!navigation) throw new Error('NavigationProvider is required')

const createOpen = ref(false)
const renameOpen = ref(false)
const completeOpen = ref(false)
const saving = ref(false)
const name = ref('')
const target = ref<ReadingCycle | undefined>()

// The api accepts an empty name and then silently ignores it, so the only
// meaningful check happens here.
const trimmedName = computed(() => name.value.trim())
const nameIsValid = computed(() => trimmedName.value.length > 0)

const formatDate = (date?: string) => {
  if (!date) return undefined
  return new Date(date).toLocaleDateString()
}

const subtitleFor = (cycle: ReadingCycle) => {
  const started = `Started ${formatDate(cycle.dateStarted)}`
  return cycle.dateCompleted
    ? `${started} · Completed ${formatDate(cycle.dateCompleted)}`
    : started
}

const openCreate = () => {
  name.value = ''
  createOpen.value = true
}

const openRename = (cycle: ReadingCycle) => {
  target.value = cycle
  name.value = cycle.name
  renameOpen.value = true
}

const openComplete = (cycle: ReadingCycle) => {
  target.value = cycle
  completeOpen.value = true
}

const submitCreate = async () => {
  if (!nameIsValid.value) return
  saving.value = true
  const created = await readingCycles.create(trimmedName.value)
  saving.value = false
  if (created) createOpen.value = false
}

const submitRename = async () => {
  if (!nameIsValid.value || !target.value) return
  saving.value = true
  const renamed = await readingCycles.rename(target.value.id, trimmedName.value)
  saving.value = false
  if (renamed) renameOpen.value = false
}

const submitComplete = async () => {
  if (!target.value) return
  saving.value = true
  const completed = await readingCycles.markComplete(target.value.id)
  saving.value = false
  if (completed) completeOpen.value = false
}
</script>

<template>
  <div>
    <v-toolbar
      border
      density="compact"
      class="sticky-toolbar"
    >
      <v-app-bar-nav-icon
        @click.prevent="navigation.toggleLeftDrawer()"
      />
      <v-spacer />
    </v-toolbar>

    <div class="px-2 mt-4">
      <div class="d-flex align-center">
        <h2>Reading Cycles</h2>
        <v-spacer />
        <v-btn
          variant="outlined"
          prepend-icon="mdi-plus"
          @click.prevent="openCreate()"
        >
          New Cycle
        </v-btn>
      </div>

      <div
        v-if="readingCycles.working.value"
        class="text-center"
      >
        <v-progress-circular
          class="mt-4"
          indeterminate
        />
      </div>

      <v-alert
        v-if="readingCycles.errorMessage.value"
        type="error"
        class="ma-4"
      >
        {{ readingCycles.errorMessage.value }}
      </v-alert>

      <v-list v-if="!readingCycles.working.value">
        <v-list-item
          v-for="cycle in readingCycles.cycles.value"
          :key="cycle.id"
          :title="cycle.name"
          :subtitle="subtitleFor(cycle)"
          :prepend-icon="cycle.default ? 'mdi-check-circle' : 'mdi-circle-outline'"
        >
          <template #append>
            <v-chip
              v-if="cycle.default"
              color="green"
              size="small"
              class="mr-2"
            >
              Active
            </v-chip>
            <v-menu>
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
                  v-if="!cycle.default"
                  title="Make Active"
                  prepend-icon="mdi-check-circle"
                  @click.prevent="readingCycles.setActive(cycle.id)"
                />
                <v-list-item
                  title="Rename"
                  prepend-icon="mdi-pencil"
                  @click.prevent="openRename(cycle)"
                />
                <v-list-item
                  v-if="!cycle.dateCompleted"
                  title="Mark Complete"
                  prepend-icon="mdi-flag-checkered"
                  @click.prevent="openComplete(cycle)"
                />
              </v-list>
            </v-menu>
          </template>
        </v-list-item>
      </v-list>
    </div>

    <v-dialog
      v-model="createOpen"
      max-width="420"
    >
      <v-card title="New Reading Cycle">
        <v-card-text>
          <v-text-field
            v-model="name"
            autofocus
            label="Name"
            placeholder="2nd Time Through"
            @keyup.enter="submitCreate()"
          />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            variant="text"
            @click.prevent="createOpen = false"
          >
            Cancel
          </v-btn>
          <v-btn
            variant="outlined"
            :disabled="!nameIsValid"
            :loading="saving"
            @click.prevent="submitCreate()"
          >
            Create
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

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
          Mark <strong>{{ target?.name }}</strong> complete? This cannot be undone.
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
  </div>
</template>
