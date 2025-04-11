import { Preview } from '@storybook/react';
import React from 'react';

const preview: Preview = {
  parameters: {
    controls: {
      expanded: true,
    },
    options: {
      storySort: {
        method: 'alphabetical',
      },
    },
  },
  tags: ['autodocs'],
};
export default preview;

// export const decorators = [(Story: any) => <Story />];
