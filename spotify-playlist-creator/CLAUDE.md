# CLAUDE.md - Spotify Playlist Creator UI

This file provides guidance to Claude Code when working with the React frontend of the Spotify Playlist Creator system.

## Project Overview

This is the React frontend for an AI-powered Spotify playlist creation system. The UI provides a conversational interface where users can iteratively refine AI-generated song suggestions before creating Spotify playlists.

## Architecture

### Component Structure

```
src/
├── App.tsx                    # Main application with layout and styling
├── context/
│   └── PlaylistContext.tsx    # Global state management with React Context + useReducer
├── components/
│   ├── ChatInterface.tsx      # Conversational UI for playlist generation
│   ├── PlaylistPreview.tsx    # Displays current playlist with drag-and-drop
│   ├── PlaylistControls.tsx   # Playlist metadata and creation controls  
│   ├── SongCard.tsx          # Individual song display component
│   └── VinylLoader.tsx       # Loading animation component
├── services/
│   └── api.ts                # API service layer for n8n integration
└── types/
    ├── Song.ts               # Song data structure
    ├── ChatMessage.ts        # Chat message data structure
    ├── Api.ts                # API request/response interfaces
    └── index.ts              # Type exports
```

### State Management

The application uses React Context with useReducer for state management:

- **PlaylistState**: Central state containing chat history, current playlist, loading states, and metadata
- **PlaylistActions**: Typed actions for state mutations (messages, playlist updates, loading states)
- **PlaylistContext**: Provides state and action dispatchers to components

### Key State Properties

```typescript
interface PlaylistState {
  chatHistory: ChatMessage[];           // Conversation history
  currentPlaylist: Song[];              // Current song selections
  isLoading: boolean;                   // Global loading state
  loadingType?: 'generating' | 'refining' | 'creating';  // Specific operation type
  playlistMetadata: {                   // Playlist configuration
    name: string;
    description: string;
    isPublic: boolean;
  };
  error?: string;                       // Error messages
}
```

## Data Flow

### 1. Initial Playlist Generation
1. User enters prompt in `ChatInterface`
2. `ChatInterface` calls `apiService.generateSuggestions()`
3. API service sends request to n8n webhook `/generate-suggestions`
4. Response containing song suggestions updates playlist state
5. `PlaylistPreview` renders new songs, `ChatInterface` shows assistant response

### 2. Playlist Refinement
1. User provides feedback in `ChatInterface`
2. System detects existing playlist and calls `apiService.refineSuggestions()`
3. Current playlist and feedback sent to n8n webhook `/refine-suggestions`
4. Updated suggestions replace current playlist state
5. UI reflects changes in real-time

### 3. Spotify Playlist Creation
1. User configures metadata in `PlaylistControls`
2. `PlaylistControls` calls `apiService.createPlaylist()`
3. Playlist data sent to n8n webhook `/create-playlist`
4. Success response shows Spotify playlist URL and creation confirmation

## Component Responsibilities

### App.tsx
- **Layout**: Two-column responsive grid layout
- **Styling**: Spotify-inspired dark theme with green accents
- **Provider**: Wraps application in `PlaylistProvider`
- **Animations**: Floating musical note background effects

### ChatInterface.tsx
- **Input Handling**: Message input with Enter key support
- **API Integration**: Manages generation vs refinement logic
- **Message Display**: Animated chat bubbles with timestamps
- **Loading States**: Shows vinyl loading animation during API calls

### PlaylistPreview.tsx
- **Song Display**: Renders current playlist using `SongCard` components
- **Drag & Drop**: Implements reordering with react-dnd
- **Empty States**: Shows helpful instructions when no songs present
- **Real-time Updates**: Reflects state changes immediately

### PlaylistControls.tsx
- **Metadata Form**: Inputs for playlist name, description, and visibility
- **Creation Logic**: Handles Spotify playlist creation workflow
- **Success/Error Handling**: Shows creation results and error messages
- **Reset Functionality**: Allows starting new playlist creation

### SongCard.tsx
- **Song Presentation**: Displays artist, title, album art, and reasoning
- **Interaction**: Remove song functionality
- **Drag Support**: Integrates with playlist reordering
- **Loading States**: Shows shimmer effect during drag operations

## API Integration

### Service Layer (api.ts)

The API service handles all communication with n8n webhooks:

```typescript
// Base URL for all API calls
const API_BASE_URL = 'http://127.0.0.1:5678/webhook';

// Main endpoints
- /generate-suggestions  # Initial AI playlist generation
- /refine-suggestions    # Iterative playlist refinement
- /create-playlist       # Spotify playlist creation
```

### Response Handling

The API service normalizes various response formats from n8n:
- Handles nested response structures (`body.message.content`)
- Parses JSON strings when necessary
- Ensures consistent Song data structure
- Provides proper error handling and user feedback

### Error Management

- **Connection Errors**: Detects n8n server unavailability
- **API Errors**: Handles HTTP error responses
- **Parse Errors**: Manages malformed JSON responses
- **User Feedback**: Shows appropriate error messages in UI

## Styling Architecture

### Theme System
- **Colors**: Spotify green (#1DB954) as primary, dark backgrounds
- **Typography**: Inter font family with various weights
- **Layout**: CSS Grid and Flexbox for responsive design
- **Effects**: Backdrop blur, gradients, and subtle animations

### Responsive Design
- **Breakpoints**: Mobile-first approach with tablet/desktop layouts
- **Grid**: Converts from two-column to single-column on mobile
- **Typography**: Scales font sizes appropriately
- **Spacing**: Adjusts padding and margins for different screen sizes

### Animation System
- **Framer Motion**: Used for component animations and transitions
- **Loading States**: Custom vinyl record spinning animation
- **Interactions**: Hover effects and micro-interactions
- **Page Transitions**: Smooth state changes and component mounting

## Development Patterns

### State Updates
- Always use action dispatchers from context, never direct state mutation
- Update loading states before async operations
- Clear errors when starting new operations
- Maintain chat history across playlist resets

### Error Boundaries
- API service provides consistent error types
- Components handle errors at appropriate levels
- User-friendly error messages replace technical details
- Graceful degradation when services unavailable

### Performance Considerations
- React.memo for expensive re-renders
- useCallback for event handlers
- Lazy loading for large component trees
- Debounced input for real-time features

## Integration Points

### n8n Webhook Communication
- Sends structured JSON requests to webhook endpoints
- Expects consistent response formats with song data
- Handles authentication through n8n workflow
- Manages Spotify OAuth flow server-side

### Spotify Integration
- Uses search queries for song matching
- Handles cases where songs aren't found on Spotify
- Preserves original AI reasoning alongside Spotify metadata
- Creates playlists with proper metadata and privacy settings

## Testing Strategy

### Component Testing
- Test user interactions (form inputs, button clicks)
- Verify state updates through context actions
- Mock API service for isolated component testing
- Test responsive behavior and accessibility

### Integration Testing
- Test complete user flows (generation → refinement → creation)
- Verify API service error handling
- Test drag-and-drop functionality
- Validate form validation and submission

### E2E Testing
- Test full application workflow with real n8n backend
- Verify Spotify integration and playlist creation
- Test error scenarios and recovery
- Validate responsive design across devices