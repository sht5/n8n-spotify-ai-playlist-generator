import type { Song } from '../../types/Song';
import type { 
  GenerateSuggestionsRequest, 
  RefineSuggestionsRequest, 
  CreatePlaylistRequest,
  ApiResponse,
  CreatePlaylistResponse
} from '../../types/Api';

// Sample song data for different genres and moods
const SAMPLE_SONGS = {
  rock: [
    {
      id: 'rock-1',
      artist: 'Queen',
      title: 'Bohemian Rhapsody',
      album: 'A Night at the Opera',
      reasoning: 'A timeless rock opera masterpiece that showcases incredible vocal range and musical complexity, perfect for any rock playlist.',
      spotifySearchQuery: 'Queen Bohemian Rhapsody',
      duration: 355000,
    },
    {
      id: 'rock-2',
      artist: 'Led Zeppelin',
      title: 'Stairway to Heaven',
      album: 'Led Zeppelin IV',
      reasoning: 'An epic 8-minute journey through musical styles, from gentle acoustic beginnings to powerful rock climax.',
      spotifySearchQuery: 'Led Zeppelin Stairway to Heaven',
      duration: 482000,
    },
    {
      id: 'rock-3',
      artist: 'The Beatles',
      title: 'Come Together',
      album: 'Abbey Road',
      reasoning: 'A groove-heavy track with mysterious lyrics and John Lennon\'s distinctive bass-driven composition.',
      spotifySearchQuery: 'The Beatles Come Together',
      duration: 259000,
    },
  ],
  pop: [
    {
      id: 'pop-1',
      artist: 'Dua Lipa',
      title: 'Levitating',
      album: 'Future Nostalgia',
      reasoning: 'An infectious disco-pop anthem with irresistible hooks and a danceable beat that defines modern pop.',
      spotifySearchQuery: 'Dua Lipa Levitating',
      duration: 203000,
    },
    {
      id: 'pop-2',
      artist: 'The Weeknd',
      title: 'Blinding Lights',
      album: 'After Hours',
      reasoning: 'Synthwave-influenced pop perfection with 80s nostalgia and contemporary production excellence.',
      spotifySearchQuery: 'The Weeknd Blinding Lights',
      duration: 200000,
    },
    {
      id: 'pop-3',
      artist: 'Olivia Rodrigo',
      title: 'good 4 u',
      album: 'SOUR',
      reasoning: 'Pop-punk energy meets emotional storytelling in this breakout hit that captured a generation.',
      spotifySearchQuery: 'Olivia Rodrigo good 4 u',
      duration: 178000,
    },
  ],
  chill: [
    {
      id: 'chill-1',
      artist: 'Billie Eilish',
      title: 'ocean eyes',
      album: 'dont smile at me',
      reasoning: 'Dreamy, ethereal vocals over minimalist production create the perfect chill atmosphere.',
      spotifySearchQuery: 'Billie Eilish ocean eyes',
      duration: 200000,
    },
    {
      id: 'chill-2',
      artist: 'Lorde',
      title: 'Ribs',
      album: 'Pure Heroine',
      reasoning: 'Introspective lyrics and atmospheric production make this a perfect contemplative track.',
      spotifySearchQuery: 'Lorde Ribs',
      duration: 244000,
    },
    {
      id: 'chill-3',
      artist: 'Glass Animals',
      title: 'Heat Waves',
      album: 'Dreamland',
      reasoning: 'Hypnotic indie-pop with dreamy vocals and a laid-back groove that became a global phenomenon.',
      spotifySearchQuery: 'Glass Animals Heat Waves',
      duration: 238000,
    },
  ],
  workout: [
    {
      id: 'workout-1',
      artist: 'Eminem',
      title: 'Till I Collapse',
      album: 'The Eminem Show',
      reasoning: 'High-energy motivational rap with driving beats, perfect for pushing through tough workouts.',
      spotifySearchQuery: 'Eminem Till I Collapse',
      duration: 297000,
    },
    {
      id: 'workout-2',
      artist: 'Imagine Dragons',
      title: 'Believer',
      album: 'Evolve',
      reasoning: 'Powerful drums and anthemic vocals create an unstoppable energy boost for fitness routines.',
      spotifySearchQuery: 'Imagine Dragons Believer',
      duration: 204000,
    },
    {
      id: 'workout-3',
      artist: 'Kanye West',
      title: 'Stronger',
      album: 'Graduation',
      reasoning: 'Electronic-infused hip-hop with a relentless beat that embodies determination and power.',
      spotifySearchQuery: 'Kanye West Stronger',
      duration: 311000,
    },
  ],
};

// Utility function to add unique IDs to songs
const addUniqueIds = (songs: Omit<Song, 'id'>[]): Song[] => {
  return songs.map((song, index) => ({
    ...song,
    id: `${song.id || 'song'}-${Date.now()}-${index}`,
  }));
};

// Function to detect playlist genre/mood from user prompt
const detectPlaylistType = (prompt: string): keyof typeof SAMPLE_SONGS => {
  const lowerPrompt = prompt.toLowerCase();
  
  if (lowerPrompt.includes('rock') || lowerPrompt.includes('classic') || lowerPrompt.includes('guitar')) {
    return 'rock';
  }
  if (lowerPrompt.includes('workout') || lowerPrompt.includes('gym') || lowerPrompt.includes('energy') || lowerPrompt.includes('motivat')) {
    return 'workout';
  }
  if (lowerPrompt.includes('chill') || lowerPrompt.includes('relax') || lowerPrompt.includes('study') || lowerPrompt.includes('calm')) {
    return 'chill';
  }
  // Default to pop for general prompts
  return 'pop';
};

// Mock API service class
class MockApiService {
  // Simulate network delay
  private async delay(ms: number = 1500): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async generateSuggestions(request: GenerateSuggestionsRequest): Promise<ApiResponse> {
    console.log('[MockApiService] Generating suggestions for:', request.prompt);
    
    // Simulate loading time
    await this.delay(2000);

    const playlistType = detectPlaylistType(request.prompt);
    const songs = addUniqueIds(SAMPLE_SONGS[playlistType]);

    const playlistNames = {
      rock: 'Classic Rock Legends',
      pop: 'Today\'s Pop Hits',
      chill: 'Chill Vibes Only',
      workout: 'High Energy Workout'
    };

    const playlistDescriptions = {
      rock: 'Timeless rock anthems that defined generations',
      pop: 'The catchiest pop songs dominating the charts',
      chill: 'Perfect background music for relaxation and focus',
      workout: 'High-energy tracks to power your fitness journey'
    };

    return {
      suggestions: songs,
      playlistName: playlistNames[playlistType],
      playlistDescription: playlistDescriptions[playlistType],
    };
  }

  async refineSuggestions(request: RefineSuggestionsRequest): Promise<ApiResponse> {
    console.log('[MockApiService] Refining suggestions based on:', request.feedback);
    
    // Simulate loading time
    await this.delay(1800);

    // Simple refinement logic - mix different genres based on feedback
    let refinedSongs: Song[] = [];
    const feedback = request.feedback.toLowerCase();

    if (feedback.includes('more rock') || feedback.includes('harder')) {
      refinedSongs = addUniqueIds([...SAMPLE_SONGS.rock, SAMPLE_SONGS.workout[0]]);
    } else if (feedback.includes('calmer') || feedback.includes('softer')) {
      refinedSongs = addUniqueIds([...SAMPLE_SONGS.chill, SAMPLE_SONGS.pop[1]]);
    } else if (feedback.includes('newer') || feedback.includes('recent')) {
      refinedSongs = addUniqueIds([...SAMPLE_SONGS.pop, SAMPLE_SONGS.chill[0]]);
    } else {
      // Default refinement - mix current playlist with some variety
      const currentType = detectPlaylistType(request.currentPlaylist[0]?.reasoning || '');
      const otherTypes = Object.keys(SAMPLE_SONGS).filter(type => type !== currentType) as (keyof typeof SAMPLE_SONGS)[];
      const randomOtherType = otherTypes[Math.floor(Math.random() * otherTypes.length)];
      
      refinedSongs = addUniqueIds([
        ...SAMPLE_SONGS[currentType].slice(0, 2),
        ...SAMPLE_SONGS[randomOtherType].slice(0, 2)
      ]);
    }

    return {
      suggestions: refinedSongs,
      playlistName: 'Refined Playlist',
      playlistDescription: 'Updated based on your feedback',
    };
  }

  async createPlaylist(request: CreatePlaylistRequest): Promise<CreatePlaylistResponse> {
    console.log('[MockApiService] Creating playlist:', request.playlistName);
    
    // Simulate creation time
    await this.delay(2500);

    // Simulate successful playlist creation
    return {
      success: true,
      playlistId: 'mock-playlist-' + Date.now(),
      playlistUrl: 'https://open.spotify.com/playlist/mock-playlist-' + Date.now(),
      tracksAdded: request.songs.length,
    };
  }
}

// Export mock instance
export const mockApiService = new MockApiService();

// Export a function to simulate API errors for testing error states
export const createErrorMockApiService = (errorMessage: string = 'Mock API Error') => ({
  generateSuggestions: async () => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    throw new Error(errorMessage);
  },
  refineSuggestions: async () => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    throw new Error(errorMessage);
  },
  createPlaylist: async () => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    throw new Error(errorMessage);
  },
});