import type { Song } from './Song';

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