import type { Meta, StoryObj } from '@storybook/react';
import { PlaylistControls } from './PlaylistControls';
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
];

// Decorator component to set up different states
const StateDecorator = ({ 
  songs = [], 
  loading = false, 
  loadingType,
  playlistName = '',
  playlistDescription = '',
  isPublic = false 
}: { 
  songs?: Song[]; 
  loading?: boolean; 
  loadingType?: 'generating' | 'refining' | 'creating';
  playlistName?: string;
  playlistDescription?: string;
  isPublic?: boolean;
}) => {
  const { actions } = usePlaylist();
  
  useEffect(() => {
    if (songs.length > 0) {
      actions.setPlaylist(songs, playlistName, playlistDescription);
    }
    actions.setPlaylistMetadata(playlistName, playlistDescription, isPublic);
    if (loading) {
      actions.setLoading(true, loadingType);
    }
  }, [actions, songs, loading, loadingType, playlistName, playlistDescription, isPublic]);
  
  return <PlaylistControls />;
};

const meta: Meta<typeof PlaylistControls> = {
  title: 'Components/PlaylistControls',
  component: PlaylistControls,
  parameters: {
    layout: 'padded',
    backgrounds: {
      default: 'dark',
    },
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <PlaylistProvider>
        <div style={{ 
          width: '500px',
          background: 'linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 50%, #0f0f0f 100%)',
          padding: '20px',
          borderRadius: '16px'
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
  render: () => <PlaylistControls />,
  parameters: {
    docs: {
      description: {
        story: 'Default state with empty form and disabled create button (no songs).',
      },
    },
  },
};

export const WithSongs: Story = {
  render: () => (
    <StateDecorator 
      songs={sampleSongs}
      playlistName="Classic Rock Hits"
      playlistDescription="The greatest rock songs of all time"
    />
  ),
  parameters: {
    docs: {
      description: {
        story: 'Ready to create playlist with songs loaded and metadata filled.',
      },
    },
  },
};

export const PublicPlaylist: Story = {
  render: () => (
    <StateDecorator 
      songs={sampleSongs}
      playlistName="My Public Playlist"
      playlistDescription="A playlist everyone can enjoy"
      isPublic={true}
    />
  ),
  parameters: {
    docs: {
      description: {
        story: 'Playlist configured as public with checkbox checked.',
      },
    },
  },
};

export const EmptyForm: Story = {
  render: () => (
    <StateDecorator songs={sampleSongs} />
  ),
  parameters: {
    docs: {
      description: {
        story: 'Form with empty fields but songs available for creation.',
      },
    },
  },
};

export const LoadingCreation: Story = {
  render: () => (
    <StateDecorator 
      songs={sampleSongs}
      loading={true}
      loadingType="creating"
      playlistName="Creating Playlist"
      playlistDescription="This playlist is being created"
    />
  ),
  parameters: {
    docs: {
      description: {
        story: 'Loading state during playlist creation on Spotify.',
      },
    },
  },
};

export const LongNames: Story = {
  render: () => (
    <StateDecorator 
      songs={sampleSongs}
      playlistName="This is a Very Long Playlist Name That Tests Input Field Behavior"
      playlistDescription="This is an extremely long description that tests how the input field handles overflow text and whether it wraps properly or truncates the content as expected in the user interface design."
    />
  ),
  parameters: {
    docs: {
      description: {
        story: 'Tests form behavior with very long playlist names and descriptions.',
      },
    },
  },
};

export const MinimalSetup: Story = {
  render: () => (
    <StateDecorator 
      songs={[sampleSongs[0]]}
      playlistName="Single Song"
    />
  ),
  parameters: {
    docs: {
      description: {
        story: 'Minimal setup with just one song and basic playlist name.',
      },
    },
  },
};