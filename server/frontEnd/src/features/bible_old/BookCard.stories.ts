import type { Meta, StoryObj } from '@storybook/vue3'

import BookCard from './BookCard.vue'

const meta = {
  title: 'Feature/Bible/BookCard',
  component: BookCard,
} satisfies Meta<typeof BookCard>

export default meta
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    name: 'Matthew',
    shortName: 'Mat'
  }
}
