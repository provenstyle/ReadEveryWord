import type { Meta, StoryObj } from '@storybook/vue3'
import { provide } from 'vue'
import { Bible } from '@read-every-word/domain'
import BibleVue from './Bible.vue'

const meta = {
  title: 'Feature/Bible/Bible',
  component: BibleVue,
} satisfies Meta<typeof BibleVue>

export default meta
type Story = StoryObj<typeof meta>;

export const Not_Started: Story = {
  render: (args) => ({
    components: { BibleVue },
    setup () {
      provide('bible', new Bible())
      return { args }
    },
    template: '<BibleVue v-bind="args" />'
  })
}

export const All_Books_Started: Story = {
  render: (args) => ({
    components: { BibleVue },
    setup () {
      provide('bible', allStarted)
      return { args }
    },
    template: '<BibleVue v-bind="args" />'
  })
}

export const All_Books_Read: Story = {
  render: (args) => ({
    components: { BibleVue },
    setup () {
      provide('bible', allRead)
      return { args }
    },
    template: '<BibleVue v-bind="args" />'
  })
}

const allStarted = new Bible()
for (const book of allStarted.books) {
  book.chapters[0].read = true
}

const allRead = new Bible()
for (const book of allRead.books) {
  for (const chapter of book.chapters) {
    chapter.read = true
  }
}
