import type { Meta, StoryObj } from '@storybook/vue3'
import { provide } from 'vue'
import { Bible } from '@read-every-word/domain'

import ChapterCard from './ChapterCard.vue'

const meta = {
  title: 'Feature/Bible/ChapterCard',
  component: ChapterCard,
  tags: ["autodocs"],
  args: {
    bookId: 0,
    chapterId: 0
  }
} satisfies Meta<typeof ChapterCard>

export default meta
type Story = StoryObj<typeof meta>;

export const Not_Started: Story = {
  render: (args) => ({
    components: { ChapterCard },
    setup () {
      provide('bible', gen_0)
      return { args }
    },
    template: '<ChapterCard v-bind="args" />'
  })
}

export const Started: Story = {
  render: (args) => ({
    components: { ChapterCard },
    setup () {
      provide('bible', gen_1)
      return { args }
    },
    template: '<ChapterCard v-bind="args" />'
  })
}

export const Completed: Story = {
  render: (args) => ({
    components: { ChapterCard },
    setup () {
      provide('bible', gen_all)
      return { args }
    },
    template: '<ChapterCard v-bind="args" />'
  })
}

const gen_0 = new Bible()

const gen_1 = new Bible()
gen_1.books[0].chapters[0].read = true

const gen_all = new Bible()
for (const chapter of gen_all.books[0].chapters) {
  chapter.read = true
}
