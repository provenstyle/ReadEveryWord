import type { Meta, StoryObj } from '@storybook/vue3'

import Book from './Book.vue'

const meta = {
  title: 'Feature/Bible/Book',
  component: Book,
} satisfies Meta<typeof Book>

export default meta
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    name: 'Matthew',
    shortName: 'Mat'
  }
}
