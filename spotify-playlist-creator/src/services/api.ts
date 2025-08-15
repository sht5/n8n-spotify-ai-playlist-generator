import type { Song } from '../types/Song';
import type { 
  GenerateSuggestionsRequest, 
  RefineSuggestionsRequest, 
  CreatePlaylistRequest,
  ApiResponse,
  CreatePlaylistResponse
} from '../types/Api';

const API_BASE_URL = 'http://127.0.0.1:5678/webhook';

class ApiError extends Error {
  constructor(message: string, public status?: number) {
    super(message);
    this.name = 'ApiError';
  }
}

class ApiService {
  private async makeRequest<T>(endpoint: string, data: any): Promise<T> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new ApiError(
          `API request failed: ${response.status} ${response.statusText}`,
          response.status
        );
      }

      const responseData = await response.json();
      return responseData;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new ApiError('Unable to connect to the server. Please ensure n8n is running.');
      }
      
      throw new ApiError(`Request failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async generateSuggestions(request: GenerateSuggestionsRequest): Promise<ApiResponse> {
    const response = await this.makeRequest<any>('/generate-suggestions', request);
    
    try {
      // Handle the nested response structure: body.message.content
      let contentData;
      
      if (response.body?.message?.content) {
        // New structure: { body: { message: { content: {...} } } }
        contentData = response.body.message.content;
      } else if (typeof response.body === 'string') {
        // Old structure: { body: "JSON string" }
        contentData = JSON.parse(response.body);
      } else if (response.body) {
        // Direct structure: { body: {...} }
        contentData = response.body;
      } else {
        // Fallback: response is the content directly
        contentData = response;
      }
      
      // Ensure each song has required fields
      const processedSuggestions: Song[] = contentData.suggestions.map((song: any, index: number) => ({
        id: `song-${Date.now()}-${index}`,
        artist: song.artist || 'Unknown Artist',
        title: song.title || 'Unknown Title',
        reasoning: song.reasoning || 'AI selected this song',
        spotifySearchQuery: song.spotifySearchQuery || `${song.artist} ${song.title}`,
        album: song.album,
        duration: song.duration,
        spotifyId: song.spotifyId,
        albumArt: song.albumArt,
        previewUrl: song.previewUrl,
      }));

      return {
        suggestions: processedSuggestions,
        playlistName: contentData.playlistName || 'AI Generated Playlist',
        playlistDescription: contentData.playlistDescription || 'Created with AI',
      };
    } catch (parseError) {
      console.error('Error parsing response:', parseError);
      throw new ApiError('Invalid response format from server');
    }
  }

  async refineSuggestions(request: RefineSuggestionsRequest): Promise<ApiResponse> {
    const response = await this.makeRequest<any>('/refine-suggestions', {
      feedback: request.feedback,
      currentPlaylist: {
        suggestions: request.currentPlaylist,
        playlistName: 'Current Playlist',
        playlistDescription: 'Current playlist state'
      }
    });
    
    try {
      // Handle multiple response structures for refine suggestions
      let contentData;
      
      if (response.body?.message?.content) {
        // Generate structure: { body: { message: { content: {...} } } }
        contentData = response.body.message.content;
      } else if (response["object Object"]?.message?.content) {
        // Refine structure: { "object Object": { message: { content: {...} } } }
        contentData = response["object Object"].message.content;
      } else if (typeof response.body === 'string') {
        // Old structure: { body: "JSON string" }
        contentData = JSON.parse(response.body);
      } else if (response.body) {
        // Direct structure: { body: {...} }
        contentData = response.body;
      } else {
        // Fallback: response is the content directly
        contentData = response;
      }
      
      const processedSuggestions: Song[] = contentData.suggestions.map((song: any, index: number) => ({
        id: `song-${Date.now()}-${index}`,
        artist: song.artist || 'Unknown Artist',
        title: song.title || 'Unknown Title',
        reasoning: song.reasoning || 'AI refined this song',
        spotifySearchQuery: song.spotifySearchQuery || `${song.artist} ${song.title}`,
        album: song.album,
        duration: song.duration,
        spotifyId: song.spotifyId,
        albumArt: song.albumArt,
        previewUrl: song.previewUrl,
      }));

      return {
        suggestions: processedSuggestions,
        playlistName: contentData.playlistName || 'Refined AI Playlist',
        playlistDescription: contentData.playlistDescription || 'Refined with AI',
      };
    } catch (parseError) {
      console.error('Error parsing refinement response:', parseError);
      throw new ApiError('Invalid response format from server');
    }
  }

  async createPlaylist(request: CreatePlaylistRequest): Promise<CreatePlaylistResponse> {
    const response = await this.makeRequest<CreatePlaylistResponse>('/create-playlist', {
      playlistName: request.playlistName,
      playlistDescription: request.playlistDescription,
      isPublic: request.isPublic || false,
      songs: request.songs.map(song => ({
        artist: song.artist,
        title: song.title,
        spotifySearchQuery: song.spotifySearchQuery,
      }))
    });

    return response;
  }
}

export const apiService = new ApiService();
export { ApiError };