import type { Meta, StoryObj } from '@storybook/vue3'

import Bible from './Bible.vue'

const meta = {
  title: 'Feature/Bible/Bible',
  component: Bible,
} satisfies Meta<typeof Bible>

export default meta
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
}
