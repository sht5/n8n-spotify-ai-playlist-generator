import type { Meta, StoryObj } from '@storybook/react';
import { ChatInterfaceForStorybook } from '../stories/ChatInterfaceForStorybook';
import { PlaylistProvider } from '../context/PlaylistContext';
import { mockApiService, createErrorMockApiService } from '../stories/__mocks__/mockApiService';
import { usePlaylist } from '../context/PlaylistContext';
import { useEffect } from 'react';
import type { Song } from '../types/Song';

// Helper component to pre-populate chat history
const ChatWithPreloadedData = ({ 
  apiService, 
  showMockIndicator, 
  messages = [],
  songs = []
}: { 
  apiService: any;
  showMockIndicator?: boolean;
  messages?: Array<{ type: 'user' | 'assistant'; content: string }>;
  songs?: Song[];
}) => {
  const { actions } = usePlaylist();
  
  useEffect(() => {
    // Pre-populate messages
    messages.forEach((msg, index) => {
      setTimeout(() => {
        if (msg.type === 'user') {
          actions.addUserMessage(msg.content);
        } else {
          actions.addAssistantMessage(msg.content, index === messages.length - 1 ? songs : undefined);
        }
      }, index * 100);
    });
    
    // Pre-populate playlist if songs provided
    if (songs.length > 0) {
      setTimeout(() => {
        actions.setPlaylist(songs, 'Sample Playlist', 'Pre-loaded for demonstration');
      }, messages.length * 100 + 100);
    }
  }, [messages, songs]); // Removed actions from dependencies
  
  return <ChatInterfaceForStorybook apiService={apiService} showMockIndicator={showMockIndicator} />;
};

const meta: Meta<typeof ChatInterfaceForStorybook> = {
  title: 'Components/ChatInterface',
  component: ChatInterfaceForStorybook,
  parameters: {
    layout: 'fullscreen',
    backgrounds: {
      default: 'dark',
    },
    docs: {
      description: {
        component: 'ChatInterface component with mocked API calls for Storybook development. All interactions are simulated and do not make real backend requests.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    showMockIndicator: {
      description: 'Whether to show the "MOCK MODE" indicator',
      control: 'boolean',
    },
  },
  decorators: [
    (Story) => (
      <PlaylistProvider>
        <div style={{ 
          height: '600px', 
          width: '500px',
          background: 'linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 50%, #0f0f0f 100%)',
          padding: '20px',
          position: 'relative'
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
  args: {
    apiService: mockApiService,
    showMockIndicator: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Default empty state. Try typing messages like "upbeat workout songs" or "chill indie music" to see the mock API responses.',
      },
    },
  },
};

export const EmptyState: Story = {
  args: {
    apiService: mockApiService,
    showMockIndicator: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'The initial state of the chat interface with no messages and helpful prompts. Fully interactive with mock data.',
      },
    },
  },
};

export const WithConversation: Story = {
  render: (args) => (
    <ChatWithPreloadedData 
      apiService={args.apiService}
      showMockIndicator={args.showMockIndicator}
      messages={[
        { type: 'user', content: 'I want some energetic rock songs for my road trip' },
        { type: 'assistant', content: 'Great! I\'ve created a playlist called "Classic Rock Legends" with 3 song suggestions. Feel free to ask for any changes!' }
      ]}
      songs={[
        {
          id: 'demo-1',
          artist: 'Queen',
          title: 'Bohemian Rhapsody',
          reasoning: 'A timeless rock opera masterpiece perfect for road trips',
          spotifySearchQuery: 'Queen Bohemian Rhapsody',
        },
        {
          id: 'demo-2', 
          artist: 'Led Zeppelin',
          title: 'Stairway to Heaven',
          reasoning: 'An epic journey through musical styles',
          spotifySearchQuery: 'Led Zeppelin Stairway to Heaven',
        }
      ]}
    />
  ),
  args: {
    apiService: mockApiService,
    showMockIndicator: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Chat interface with existing conversation history and generated playlist. Shows how the component looks with active chat data.',
      },
    },
  },
};

export const LoadingState: Story = {
  render: (args) => {
    const LoadingDemo = () => {
      const { actions } = usePlaylist();
      
      useEffect(() => {
        actions.addUserMessage('Create an upbeat workout playlist');
        actions.setLoading(true, 'generating');
      }, []); // Empty dependency array since this only needs to run once
      
      return <ChatInterfaceForStorybook apiService={args.apiService} showMockIndicator={args.showMockIndicator} />;
    };
    
    return <LoadingDemo />;
  },
  args: {
    apiService: mockApiService,
    showMockIndicator: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates the loading state with the new vibrant vinyl loader animation while AI generates the playlist.',
      },
    },
  },
};

export const ErrorState: Story = {
  args: {
    apiService: createErrorMockApiService('Failed to connect to AI service. Please try again later.'),
    showMockIndicator: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows how the component handles API errors. Try sending a message to see the error handling in action.',
      },
    },
  },
};

export const RefinementFlow: Story = {
  render: (args) => (
    <ChatWithPreloadedData 
      apiService={args.apiService}
      showMockIndicator={args.showMockIndicator}
      messages={[
        { type: 'user', content: 'I want some chill music for studying' },
        { type: 'assistant', content: 'I\'ve created "Chill Vibes Only" with 3 perfect study tracks!' },
        { type: 'user', content: 'Can you make it more upbeat?' },
        { type: 'assistant', content: 'I\'ve refined your playlist with more energetic tracks while keeping the chill vibe!' }
      ]}
      songs={[
        {
          id: 'refined-1',
          artist: 'Glass Animals',
          title: 'Heat Waves',
          reasoning: 'Upbeat but still maintains chill study vibes',
          spotifySearchQuery: 'Glass Animals Heat Waves',
        },
        {
          id: 'refined-2',
          artist: 'Dua Lipa', 
          title: 'Levitating',
          reasoning: 'More energetic while remaining focus-friendly',
          spotifySearchQuery: 'Dua Lipa Levitating',
        }
      ]}
    />
  ),
  args: {
    apiService: mockApiService,
    showMockIndicator: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates the playlist refinement flow where users can iteratively improve their playlist through conversation.',
      },
    },
  },
};

export const WithoutMockIndicator: Story = {
  args: {
    apiService: mockApiService,
    showMockIndicator: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Same as default but without the "MOCK MODE" indicator for cleaner screenshots and demos.',
      },
    },
  },
};