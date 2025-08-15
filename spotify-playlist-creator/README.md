# Spotify Playlist Creator - Frontend

This is the React frontend for the AI-powered Spotify playlist creation system. The application provides a conversational interface where users can iteratively refine AI-generated song suggestions before creating Spotify playlists.

## Features

- 🎵 **AI-Powered Curation**: Describe your musical preferences and get personalized song suggestions
- 💬 **Conversational Interface**: Refine your playlist through natural language conversations
- 🎨 **Spotify Design**: Dark theme inspired by Spotify's aesthetic
- 🔄 **Drag & Drop**: Reorder songs with smooth animations
- ⚡ **Real-time Updates**: Instant feedback and playlist modifications
- 📱 **Responsive Design**: Works seamlessly on desktop and mobile

## Tech Stack

- **React 19** with TypeScript
- **Vite** for fast development and building  
- **Styled Components** for CSS-in-JS styling
- **Framer Motion** for smooth animations
- **React DnD** for drag-and-drop functionality
- **Storybook** for component development and documentation

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Start Storybook (component development)
npm run storybook

# Build for production
npm run build
```

### Available Scripts

- `npm run dev` - Start the development server at http://localhost:5173
- `npm run build` - Build the application for production
- `npm run preview` - Preview the production build locally
- `npm run storybook` - Launch Storybook at http://localhost:6006
- `npm run build-storybook` - Build Storybook for deployment
- `npm run lint` - Run ESLint for code quality checks

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ChatInterface.tsx       # Conversational playlist interface
│   ├── PlaylistPreview.tsx     # Main playlist display with drag-and-drop
│   ├── PlaylistControls.tsx    # Playlist metadata and creation controls
│   ├── SongCard.tsx           # Individual song display component
│   └── VinylLoader.tsx        # Custom loading animation
├── context/            # React Context providers
│   └── PlaylistContext.tsx    # Global state management
├── services/           # API integration
│   └── api.ts         # n8n webhook communication
├── types/             # TypeScript definitions
│   ├── Song.ts        # Song data structure
│   ├── ChatMessage.ts # Chat message interface
│   └── Api.ts         # API request/response types
└── stories/           # Storybook component stories
```

## Component Development

This project includes Storybook for isolated component development:

- **SongCard**: Individual song display with metadata and interactions
- **VinylLoader**: Animated loading indicator with customizable text
- **ChatInterface**: Conversational UI for playlist generation
- **PlaylistPreview**: Main playlist display with drag-and-drop functionality
- **PlaylistControls**: Form controls for playlist metadata and creation

Browse components at http://localhost:6006 when running Storybook.

## Architecture

The frontend integrates with an n8n workflow backend through three main webhook endpoints:

- `/generate-suggestions` - Initial AI playlist generation from user prompt
- `/refine-suggestions` - Iterative refinement of existing suggestions  
- `/create-playlist` - Final Spotify playlist creation with approved songs

See `CLAUDE.md` for detailed architectural documentation.
