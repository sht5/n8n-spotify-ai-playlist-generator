import type { Meta, StoryObj } from '@storybook/react';
import { VinylLoader } from './VinylLoader';

const meta: Meta<typeof VinylLoader> = {
  title: 'Components/VinylLoader',
  component: VinylLoader,
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'dark',
    },
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      description: 'Size of the vinyl record in pixels',
      control: { type: 'range', min: 20, max: 200, step: 10 },
    },
    text: {
      description: 'Loading text displayed below the vinyl record',
      control: 'text',
    },
    className: {
      description: 'Additional CSS class name',
      control: 'text',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    size: 80,
    text: 'Loading...',
  },
};

export const Small: Story = {
  args: {
    size: 40,
    text: 'Processing...',
  },
};

export const Large: Story = {
  args: {
    size: 120,
    text: 'Creating your playlist...',
  },
};

export const ExtraLarge: Story = {
  args: {
    size: 160,
    text: 'Almost done!',
  },
};

export const WithoutText: Story = {
  args: {
    size: 80,
    text: '',
  },
};

export const GeneratingPlaylist: Story = {
  args: {
    size: 60,
    text: 'Generating your playlist...',
  },
};

export const RefiningPlaylist: Story = {
  args: {
    size: 60,
    text: 'Refining your playlist...',
  },
};

export const CreatingOnSpotify: Story = {
  args: {
    size: 60,
    text: 'Creating playlist on Spotify...',
  },
};

export const CustomText: Story = {
  args: {
    size: 80,
    text: '🎵 Finding the perfect songs for you...',
  },
};

export const Minimal: Story = {
  args: {
    size: 30,
    text: 'Wait...',
  },
};

export const ExtraSmall: Story = {
  args: {
    size: 20,
    text: '',
  },
};

export const Massive: Story = {
  args: {
    size: 200,
    text: 'Creating your ultimate playlist...',
  },
};

export const VibrantDemo: Story = {
  args: {
    size: 100,
    text: '✨ AI is curating your perfect mix...',
  },
  parameters: {
    docs: {
      description: {
        story: 'Showcases the new vibrant design with colorful Spotify green rim, glowing effects, and smooth spinning animation.',
      },
    },
  },
};