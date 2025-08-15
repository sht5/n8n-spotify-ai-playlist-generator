// Song interface
export interface Song {
  id: string;
  artist: string;
  title: string;
  album?: string;
  duration?: number;
  spotifyId?: string;
  reasoning: string;
  albumArt?: string;
  previewUrl?: string;
  spotifySearchQuery: string;
}

// Playlist interface
export interface Playlist {
  id: string;
  name: string;
  description: string;
  songs: Song[];
  isPublic: boolean;
  createdAt: Date;
  spotifyId?: string;
}

// Chat message interface
export interface ChatMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  playlistSnapshot?: Song[];
}

// Application state interface
export interface PlaylistState {
  chatHistory: ChatMessage[];
  currentPlaylist: Song[];
  isLoading: boolean;
  loadingType?: 'generating' | 'refining' | 'creating';
  playlistMetadata: {
    name: string;
    description: string;
    isPublic: boolean;
  };
  error?: string;
}

// API Response interfaces
export interface ApiResponse {
  suggestions: Song[];
  playlistName: string;
  playlistDescription: string;
}

export interface GenerateSuggestionsRequest {
  prompt: string;
}

export interface RefineSuggestionsRequest {
  feedback: string;
  currentPlaylist: Song[];
}

export interface CreatePlaylistRequest {
  playlistName: string;
  playlistDescription?: string;
  isPublic?: boolean;
  songs: Song[];
}

export interface CreatePlaylistResponse {
  success: boolean;
  playlistId: string;
  playlistUrl: string;
  tracksAdded: number;
}