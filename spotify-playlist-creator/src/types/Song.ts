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