# Product Requirements Document: AI-Powered Spotify Playlist Creator

## 1. Product Overview

### 1.1 Vision
Create an intelligent playlist creation system that combines AI-powered music curation with an intuitive web interface, allowing users to iteratively refine song suggestions before automatically creating Spotify playlists.

### 1.2 Objectives
- Enable conversational playlist creation using AI
- Provide rich UI for playlist review and modification
- Automate Spotify playlist creation process
- Support multiple iterations until user satisfaction

## 2. System Architecture

### 2.1 High-Level Architecture
```
React Frontend ↔ n8n Webhook API ↔ OpenAI API + Spotify API
```

### 2.2 Component Overview
- **React Web Application**: User interface and interaction layer
- **n8n Workflow Engine**: API orchestration and business logic
- **OpenAI Integration**: AI-powered music suggestions
- **Spotify Integration**: Playlist creation and management

## 3. Technical Specifications

### 3.1 Frontend (React Application)

#### 3.1.1 Core Features
- **Chat Interface**: Conversational UI for prompt iteration
- **Playlist Preview**: Rich display of suggested songs with metadata
- **Interactive Controls**: Add/remove/reorder songs
- **Real-time Updates**: Live playlist state management

#### 3.1.2 Key Components
- `ChatInterface`: Message history and prompt input
- `PlaylistPreview`: Song list with album art and details
- `SongCard`: Individual song display with controls
- `PlaylistControls`: Final actions (create, save, export)

#### 3.1.3 State Management
```javascript
{
  chatHistory: Message[],
  currentPlaylist: Song[],
  isLoading: boolean,
  playlistMetadata: {
    name: string,
    description: string,
    isPublic: boolean
  }
}
```

### 3.2 Backend (n8n Workflows)

#### 3.2.1 Webhook Endpoints
| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/generate-suggestions` | POST | Initial AI playlist generation |
| `/refine-suggestions` | POST | Iterative prompt refinement |
| `/create-playlist` | POST | Final Spotify playlist creation |

#### 3.2.2 Workflow Structure
```
Webhook Trigger → OpenAI Processing → Response Formatting → JSON Return
```

### 3.3 API Integration Specifications

#### 3.3.1 OpenAI Integration
- **Model**: GPT-4 or latest available
- **Input**: User prompt + conversation history
- **Output**: Structured JSON with song suggestions
```json
{
  "suggestions": [
    {
      "artist": "string",
      "title": "string",
      "reasoning": "string",
      "spotifySearchQuery": "string"
    }
  ],
  "playlistName": "string",
  "playlistDescription": "string"
}
```

#### 3.3.2 Spotify Integration
- **Authentication**: OAuth 2.0 with required scopes
- **Operations**: 
  - Search tracks
  - Create playlist
  - Add tracks to playlist
- **Required Scopes**: `playlist-modify-public`, `playlist-modify-private`

## 4. User Experience Flow

### 4.1 Primary User Journey
1. **Prompt Entry**: User describes desired playlist
2. **AI Generation**: System returns initial suggestions
3. **Review & Iterate**: User refines through conversation
4. **Final Approval**: User confirms playlist creation
5. **Spotify Creation**: Automated playlist creation

### 4.2 Interaction Patterns
- **Conversational Refinement**: "Add more upbeat songs", "Replace song X"
- **Direct Manipulation**: Click to remove, drag to reorder
- **Bulk Operations**: "Keep only rock songs", "Add 5 more similar"

## 5. Data Models

### 5.1 Song Object
```typescript
interface Song {
  id: string;
  artist: string;
  title: string;
  album?: string;
  duration?: number;
  spotifyId?: string;
  reasoning: string;
  albumArt?: string;
  previewUrl?: string;
}
```

### 5.2 Playlist Object
```typescript
interface Playlist {
  id: string;
  name: string;
  description: string;
  songs: Song[];
  isPublic: boolean;
  createdAt: Date;
  spotifyId?: string;
}
```

### 5.3 Chat Message
```typescript
interface ChatMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  playlistSnapshot?: Song[];
}
```

## 6. Error Handling & Edge Cases

### 6.1 API Failures
- OpenAI rate limits or downtime
- Spotify authentication expiration
- Network connectivity issues

### 6.2 Content Issues
- Songs not found on Spotify
- Inappropriate content filtering
- Duplicate song handling

### 6.3 User Experience
- Loading states for all async operations
- Graceful degradation for missing metadata
- Clear error messages and recovery options

## 7. Security & Privacy

### 7.1 Authentication
- Secure Spotify OAuth flow
- API key management in n8n
- Session management in React app

### 7.2 Data Privacy
- No persistent storage of user data
- Temporary session-based data only
- Compliance with Spotify API terms

## 8. Performance Requirements

### 8.1 Response Times
- Initial suggestions: < 10 seconds
- Refinement iterations: < 5 seconds
- Playlist creation: < 15 seconds

### 8.2 Scalability
- Support multiple concurrent users
- Efficient API usage within rate limits
- Optimized frontend rendering

## 9. Future Enhancements

### 9.1 Advanced Features
- Playlist collaboration
- Music taste learning
- Integration with other streaming services
- Playlist analytics and insights

### 9.2 AI Improvements
- Genre-specific fine-tuning
- Mood and tempo analysis
- Seasonal and contextual recommendations