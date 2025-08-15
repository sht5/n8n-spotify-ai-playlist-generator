import type { Meta, StoryObj } from '@storybook/react';
import { PlaylistPreview } from './PlaylistPreview';
import { PlaylistProvider } from '../context/PlaylistContext';
import React, { useEffect } from 'react';
import { usePlaylist } from '../context/PlaylistContext';
import type { Song } from '../types/Song';

// Sample songs for stories
const sampleSongs: Song[] = [
  {
    id: 'song-1',
    title: 'Bohemian Rhapsody',
    artist: 'Queen',
    album: 'A Night at the Opera',
    reasoning: 'A timeless classic that showcases incredible vocal range and musical complexity.',
    spotifySearchQuery: 'Queen Bohemian Rhapsody',
    duration: 355000,
  },
  {
    id: 'song-2',
    title: 'Stairway to Heaven',
    artist: 'Led Zeppelin',
    album: 'Led Zeppelin IV',
    reasoning: 'An epic journey through musical styles, from gentle acoustic to powerful rock.',
    spotifySearchQuery: 'Led Zeppelin Stairway to Heaven',
    duration: 482000,
  },
  {
    id: 'song-3',
    title: 'Hotel California',
    artist: 'Eagles',
    album: 'Hotel California',
    reasoning: 'Iconic guitar work and mysterious lyrics make this a must-have classic.',
    spotifySearchQuery: 'Eagles Hotel California',
    duration: 391000,
  },
];

// Decorator component to set playlist state
const PlaylistStateDecorator = ({ songs, name, description }: { songs: Song[]; name?: string; description?: string }) => {
  const { actions } = usePlaylist();
  
  useEffect(() => {
    if (songs.length > 0) {
      actions.setPlaylist(songs, name || 'Sample Playlist', description || 'A collection of great songs');
    }
  }, [songs, name, description]); // Removed actions from dependencies
  
  return <PlaylistPreview />;
};

const meta: Meta<typeof PlaylistPreview> = {
  title: 'Components/PlaylistPreview',
  component: PlaylistPreview,
  parameters: {
    layout: 'fullscreen',
    backgrounds: {
      default: 'dark',
    },
  },
  tags: ['autodocs'],
  decorators: [
    (Story, { args }) => (
      <PlaylistProvider>
        <div style={{ 
          height: '600px', 
          width: '500px',
          background: 'linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 50%, #0f0f0f 100%)',
          padding: '20px'
        }}>
          <Story />
        </div>
      </PlaylistProvider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <PlaylistPreview />,
};

export const EmptyPlaylist: Story = {
  render: () => <PlaylistPreview />,
  parameters: {
    docs: {
      description: {
        story: 'The empty state shown when no songs have been added to the playlist yet.',
      },
    },
  },
};

export const WithSongs: Story = {
  render: () => (
    <PlaylistStateDecorator 
      songs={sampleSongs} 
      name="Classic Rock Hits" 
      description="The greatest rock songs of all time"
    />
  ),
  parameters: {
    docs: {
      description: {
        story: 'Playlist preview with multiple songs, showing drag-and-drop functionality.',
      },
    },
  },
};

export const SingleSong: Story = {
  render: () => (
    <PlaylistStateDecorator 
      songs={[sampleSongs[0]]} 
      name="Single Song Test" 
      description="Testing with just one song"
    />
  ),
  parameters: {
    docs: {
      description: {
        story: 'Playlist with only one song to test singular/plural text handling.',
      },
    },
  },
};

export const LongPlaylist: Story = {
  render: () => {
    const longSongList = Array.from({ length: 10 }, (_, i) => ({
      ...sampleSongs[i % 3],
      id: `song-${i}`,
      title: `${sampleSongs[i % 3].title} ${i + 1}`,
    }));
    
    return (
      <PlaylistStateDecorator 
        songs={longSongList} 
        name="Extended Playlist" 
        description="A longer playlist to test scrolling behavior"
      />
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'A longer playlist to demonstrate scrolling behavior and performance with many items.',
      },
    },
  },
};

export const WithLongNames: Story = {
  render: () => {
    const longNameSongs: Song[] = [
      {
        id: 'song-long-1',
        title: 'This is a Really Really Long Song Title That Tests Text Overflow Behavior',
        artist: 'An Artist with an Extremely Long Name That Should Be Truncated',
        reasoning: 'This song has an extraordinarily long title and artist name to test how the component handles text overflow and ensures the UI remains clean and readable.',
        spotifySearchQuery: 'Long title song',
      },
      {
        id: 'song-long-2',
        title: 'Another Super Long Title',
        artist: 'The Band',
        reasoning: 'Short reason.',
        spotifySearchQuery: 'Another long song',
      },
    ];

    return (
      <PlaylistStateDecorator 
        songs={longNameSongs} 
        name="Text Overflow Test Playlist" 
        description="Testing how the component handles very long song titles and artist names"
      />
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Tests how the component handles very long song titles and artist names with proper text truncation.',
      },
    },
  },
};