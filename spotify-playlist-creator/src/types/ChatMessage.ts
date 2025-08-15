import type { Song } from './Song';

export interface ChatMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  playlistSnapshot?: Song[];
}