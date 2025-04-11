import { Meta, StoryObj } from '@storybook/react';

import IconButton from './IconButton';

const meta: Meta<typeof IconButton> = {
  component: IconButton,
  title: 'IconButton',
};

export default meta;

type Story = StoryObj<typeof IconButton>;

export const Primary: Story = {
  args: {
    text: 'Hello World',
  },
};
