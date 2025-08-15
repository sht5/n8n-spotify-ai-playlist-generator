import type { Meta, StoryObj } from '@storybook/react';
import { SongCard } from './SongCard';
import type { Song } from '../types/Song';

const meta: Meta<typeof SongCard> = {
  title: 'Components/SongCard',
  component: SongCard,
  parameters: {
    layout: 'padded',
    backgrounds: {
      default: 'dark',
    },
  },
  tags: ['autodocs'],
  argTypes: {
    song: {
      description: 'The song object containing all track information',
      control: 'object',
    },
    index: {
      description: 'The index of the song in the playlist (affects animation delay)',
      control: { type: 'number', min: 0, max: 10 },
    },
    isDragging: {
      description: 'Whether the song card is currently being dragged',
      control: 'boolean',
    },
    onRemove: {
      description: 'Callback function called when the remove button is clicked',
    },
  },
  args: {
    onRemove: () => console.log('Remove clicked'),
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Sample song data for stories
const sampleSong: Song = {
  id: 'song-1',
  title: 'Bohemian Rhapsody',
  artist: 'Queen',
  album: 'A Night at the Opera',
  reasoning: 'A timeless classic that showcases incredible vocal range and musical complexity, perfect for any rock playlist.',
  spotifySearchQuery: 'Queen Bohemian Rhapsody',
  duration: 355000,
  spotifyId: '4u7EnebtmKWzUH433cf5Qv',
};

const longTitleSong: Song = {
  id: 'song-2',
  title: 'Supercalifragilisticexpialidocious (Extended Dance Mix)',
  artist: 'The Artist with a Really Really Long Name',
  album: 'An Album with an Extraordinarily Long Title That Tests Text Overflow',
  reasoning: 'This song tests how the component handles extremely long text in titles and artist names, ensuring proper truncation.',
  spotifySearchQuery: 'Supercalifragilisticexpialidocious',
};

const shortReasoningSong: Song = {
  id: 'song-3',
  title: 'Hey Jude',
  artist: 'The Beatles',
  reasoning: 'Great song!',
  spotifySearchQuery: 'The Beatles Hey Jude',
};

const noReasoningSong: Song = {
  id: 'song-4',
  title: 'Imagine',
  artist: 'John Lennon',
  reasoning: '',
  spotifySearchQuery: 'John Lennon Imagine',
};

export const Default: Story = {
  args: {
    song: sampleSong,
    index: 0,
    isDragging: false,
  },
};

export const WithLongText: Story = {
  args: {
    song: longTitleSong,
    index: 1,
    isDragging: false,
  },
};

export const WithShortReasoning: Story = {
  args: {
    song: shortReasoningSong,
    index: 2,
    isDragging: false,
  },
};

export const WithoutReasoning: Story = {
  args: {
    song: noReasoningSong,
    index: 3,
    isDragging: false,
  },
};

export const Dragging: Story = {
  args: {
    song: sampleSong,
    index: 0,
    isDragging: true,
  },
};

export const HighIndex: Story = {
  args: {
    song: sampleSong,
    index: 5,
    isDragging: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows how the animation delay increases with higher index values.',
      },
    },
  },
};