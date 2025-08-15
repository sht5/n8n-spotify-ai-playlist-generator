# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an AI-powered Spotify playlist creation system with a React frontend and n8n workflow backend. The system enables conversational playlist curation where users iteratively refine AI-generated song suggestions before automatically creating Spotify playlists.

## Architecture

The system follows a three-tier architecture:
- **React Frontend**: Provides chat interface and playlist management UI
- **n8n Workflow Engine**: Orchestrates API calls and handles webhook endpoints
- **External APIs**: OpenAI for song suggestions, Spotify for playlist creation

### Key Integration Points

The React app communicates with n8n through three main webhook endpoints:
- `/generate-suggestions`: Initial AI playlist generation from user prompt
- `/refine-suggestions`: Iterative refinement of existing suggestions
- `/create-playlist`: Final Spotify playlist creation with approved songs

## Data Flow

1. User provides musical prompt through React chat interface
2. Frontend sends prompt to n8n webhook
3. n8n processes request through OpenAI API
4. Structured JSON response with song suggestions returned to frontend
5. User iterates through conversation until satisfied
6. Final approved playlist sent to Spotify via n8n workflow

## Core Data Models

The system operates on three primary data structures defined in the PRD:

- **Song**: Individual track with metadata (artist, title, reasoning, Spotify ID)
- **Playlist**: Collection of songs with metadata (name, description, public/private)
- **ChatMessage**: Conversation history with optional playlist snapshots

## State Management

React frontend maintains:
- Chat history for conversation continuity
- Current playlist state for real-time updates
- Loading states for async operations
- Playlist metadata (name, description, visibility)

## API Integration Requirements

### OpenAI Integration
- Uses GPT-4 for intelligent music curation
- Expects structured JSON output with song suggestions and reasoning
- Maintains conversation context for iterative refinement

### Spotify Integration
- Requires OAuth 2.0 with `playlist-modify-public` and `playlist-modify-private` scopes
- Handles track searching, playlist creation, and track addition
- Must gracefully handle songs not found on Spotify

## Development Workflow

Since this is a new project repository, initial development should focus on:

1. **React App Setup**: Create chat interface and playlist components
2. **n8n Workflow Configuration**: Set up webhook endpoints and API integrations  
3. **Authentication Setup**: Implement Spotify OAuth flow
4. **Error Handling**: Implement graceful degradation for API failures

## Security Considerations

- API keys and credentials managed within n8n environment
- No persistent user data storage (session-based only)
- Secure OAuth implementation for Spotify access
- Compliance with both OpenAI and Spotify API terms of service