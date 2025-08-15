# Storybook API Mocking Documentation

## Overview
The ChatInterface component in Storybook now uses a comprehensive mocking system to prevent real backend API calls during development and testing.

## Architecture

### Mock API Service
**Location**: `src/stories/__mocks__/mockApiService.ts`

**Features**:
- ✅ **Realistic Data**: 4+ genres with authentic song metadata
- ✅ **Smart Detection**: Automatically selects appropriate genre based on user prompts  
- ✅ **Realistic Timing**: Simulates actual API response delays (1.5-2.5s)
- ✅ **Error Simulation**: Configurable error states for testing
- ✅ **Type Safety**: Full TypeScript support matching production API

### Storybook-Specific Component
**Location**: `src/stories/ChatInterfaceForStorybook.tsx`

**Purpose**:
- Identical to production `ChatInterface` but accepts mock API service as prop
- Visual "MOCK MODE" indicator (toggleable)
- Maintains all original functionality without backend dependency

## Available Stories

### 1. **Default** - Interactive Empty State
- Clean slate for testing different prompts
- Try: "workout music", "chill indie", "classic rock"

### 2. **EmptyState** - Static Empty State  
- Shows initial user guidance
- Perfect for UI documentation

### 3. **WithConversation** - Pre-populated Chat
- Example conversation with generated playlist
- Demonstrates typical user flow

### 4. **LoadingState** - Active Loading
- Shows vibrant vinyl loader animation
- Demonstrates loading UX during API calls

### 5. **ErrorState** - Error Handling
- Simulates API failures
- Tests error message display and recovery

### 6. **RefinementFlow** - Iterative Improvement
- Multi-turn conversation example
- Shows playlist refinement capabilities

### 7. **WithoutMockIndicator** - Clean Demo
- Same as Default but without "MOCK MODE" label
- For screenshots and presentations

## Sample Data Categories

### 🎸 Rock
- Queen - Bohemian Rhapsody
- Led Zeppelin - Stairway to Heaven  
- The Beatles - Come Together

### 🎵 Pop
- Dua Lipa - Levitating
- The Weeknd - Blinding Lights
- Olivia Rodrigo - good 4 u

### 😌 Chill
- Billie Eilish - ocean eyes
- Lorde - Ribs
- Glass Animals - Heat Waves

### 💪 Workout
- Eminem - Till I Collapse
- Imagine Dragons - Believer
- Kanye West - Stronger

## Prompt Detection Logic

The mock service analyzes user prompts to return appropriate genre:

```typescript
// Examples of prompt detection
"workout music" → workout genre
"chill indie for studying" → chill genre  
"classic rock road trip" → rock genre
"pop songs" → pop genre (default)
```

## Interactive Features

### ✅ Full Conversation Flow
- Send messages and receive AI-like responses
- Realistic loading states with timing
- Proper error handling and recovery

### ✅ Playlist Generation
- Context-aware song suggestions
- Proper metadata (artist, title, reasoning)
- Integration with PlaylistPreview component

### ✅ Refinement Capability
- Follow-up requests modify existing playlist
- Smart mixing of genres based on feedback
- Maintains conversation continuity

## Development Benefits

### 🚀 **Speed**
- No backend dependency
- Instant component loading
- No network timeouts

### 🔧 **Reliability** 
- Consistent mock data
- Predictable responses
- No external service issues

### 🧪 **Testing**
- All UI states covered
- Error scenarios testable
- Loading state validation

### 📱 **Responsive**
- Works offline
- No CORS issues
- Cross-platform compatibility

## Usage in Development

1. **Start Storybook**: `npm run storybook`
2. **Navigate** to Components → ChatInterface
3. **Select** any story variant
4. **Interact** with the interface normally
5. **Test** different prompts and scenarios

## Future Enhancements

- [ ] Additional music genres (jazz, country, electronic)
- [ ] More sophisticated prompt parsing with NLP
- [ ] User preference memory across conversations
- [ ] Playlist export functionality simulation
- [ ] Advanced error scenarios (network timeouts, rate limiting)

## Integration Notes

- **Production Code**: Unchanged - still uses real `apiService`
- **Type Safety**: Mock service implements same interfaces
- **Context**: Full PlaylistProvider integration maintained
- **Styling**: Identical visual appearance with optional mock indicator