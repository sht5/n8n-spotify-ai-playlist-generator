import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import type { Song } from '../types/Song';
import type { ChatMessage } from '../types/ChatMessage';
import { v4 as uuidv4 } from 'uuid';

interface PlaylistState {
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

type PlaylistAction =
  | { type: 'SET_LOADING'; payload: { isLoading: boolean; loadingType?: 'generating' | 'refining' | 'creating' } }
  | { type: 'ADD_MESSAGE'; payload: ChatMessage }
  | { type: 'SET_PLAYLIST'; payload: { songs: Song[]; name: string; description: string } }
  | { type: 'UPDATE_SONG'; payload: { index: number; song: Song } }
  | { type: 'REMOVE_SONG'; payload: number }
  | { type: 'REORDER_SONGS'; payload: { fromIndex: number; toIndex: number } }
  | { type: 'SET_PLAYLIST_METADATA'; payload: { name: string; description: string; isPublic: boolean } }
  | { type: 'SET_ERROR'; payload: string | undefined }
  | { type: 'RESET_PLAYLIST' };

const initialState: PlaylistState = {
  chatHistory: [],
  currentPlaylist: [],
  isLoading: false,
  playlistMetadata: {
    name: '',
    description: '',
    isPublic: false,
  },
  error: undefined,
};

const playlistReducer = (state: PlaylistState, action: PlaylistAction): PlaylistState => {
  switch (action.type) {
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload.isLoading,
        loadingType: action.payload.loadingType,
        error: action.payload.isLoading ? undefined : state.error, // Clear error when starting new operation
      };

    case 'ADD_MESSAGE':
      return {
        ...state,
        chatHistory: [...state.chatHistory, action.payload],
      };

    case 'SET_PLAYLIST':
      return {
        ...state,
        currentPlaylist: action.payload.songs,
        playlistMetadata: {
          ...state.playlistMetadata,
          name: action.payload.name,
          description: action.payload.description,
        },
      };

    case 'UPDATE_SONG':
      const updatedSongs = [...state.currentPlaylist];
      updatedSongs[action.payload.index] = action.payload.song;
      return {
        ...state,
        currentPlaylist: updatedSongs,
      };

    case 'REMOVE_SONG':
      return {
        ...state,
        currentPlaylist: state.currentPlaylist.filter((_, index) => index !== action.payload),
      };

    case 'REORDER_SONGS':
      const songs = [...state.currentPlaylist];
      const [movedSong] = songs.splice(action.payload.fromIndex, 1);
      songs.splice(action.payload.toIndex, 0, movedSong);
      return {
        ...state,
        currentPlaylist: songs,
      };

    case 'SET_PLAYLIST_METADATA':
      return {
        ...state,
        playlistMetadata: action.payload,
      };

    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      };

    case 'RESET_PLAYLIST':
      return {
        ...initialState,
        chatHistory: state.chatHistory, // Keep chat history
      };

    default:
      return state;
  }
};

interface PlaylistContextType {
  state: PlaylistState;
  dispatch: React.Dispatch<PlaylistAction>;
  actions: {
    setLoading: (isLoading: boolean, loadingType?: 'generating' | 'refining' | 'creating') => void;
    addUserMessage: (content: string) => void;
    addAssistantMessage: (content: string, playlistSnapshot?: Song[]) => void;
    setPlaylist: (songs: Song[], name: string, description: string) => void;
    updateSong: (index: number, song: Song) => void;
    removeSong: (index: number) => void;
    reorderSongs: (fromIndex: number, toIndex: number) => void;
    setPlaylistMetadata: (name: string, description: string, isPublic: boolean) => void;
    setError: (error: string | undefined) => void;
    resetPlaylist: () => void;
  };
}

const PlaylistContext = createContext<PlaylistContextType | undefined>(undefined);

interface PlaylistProviderProps {
  children: ReactNode;
}

export const PlaylistProvider: React.FC<PlaylistProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(playlistReducer, initialState);

  const actions = {
    setLoading: (isLoading: boolean, loadingType?: 'generating' | 'refining' | 'creating') => {
      dispatch({ type: 'SET_LOADING', payload: { isLoading, loadingType } });
    },

    addUserMessage: (content: string) => {
      const message: ChatMessage = {
        id: uuidv4(),
        type: 'user',
        content,
        timestamp: new Date(),
      };
      dispatch({ type: 'ADD_MESSAGE', payload: message });
    },

    addAssistantMessage: (content: string, playlistSnapshot?: Song[]) => {
      const message: ChatMessage = {
        id: uuidv4(),
        type: 'assistant',
        content,
        timestamp: new Date(),
        playlistSnapshot,
      };
      dispatch({ type: 'ADD_MESSAGE', payload: message });
    },

    setPlaylist: (songs: Song[], name: string, description: string) => {
      dispatch({ type: 'SET_PLAYLIST', payload: { songs, name, description } });
    },

    updateSong: (index: number, song: Song) => {
      dispatch({ type: 'UPDATE_SONG', payload: { index, song } });
    },

    removeSong: (index: number) => {
      dispatch({ type: 'REMOVE_SONG', payload: index });
    },

    reorderSongs: (fromIndex: number, toIndex: number) => {
      dispatch({ type: 'REORDER_SONGS', payload: { fromIndex, toIndex } });
    },

    setPlaylistMetadata: (name: string, description: string, isPublic: boolean) => {
      dispatch({ type: 'SET_PLAYLIST_METADATA', payload: { name, description, isPublic } });
    },

    setError: (error: string | undefined) => {
      dispatch({ type: 'SET_ERROR', payload: error });
    },

    resetPlaylist: () => {
      dispatch({ type: 'RESET_PLAYLIST' });
    },
  };

  return (
    <PlaylistContext.Provider value={{ state, dispatch, actions }}>
      {children}
    </PlaylistContext.Provider>
  );
};

export const usePlaylist = () => {
  const context = useContext(PlaylistContext);
  if (context === undefined) {
    throw new Error('usePlaylist must be used within a PlaylistProvider');
  }
  return context;
};