# Spotify Playlist Creator

An AI-powered system that creates personalized Spotify playlists through conversational interaction. Users describe their musical preferences in natural language, iteratively refine AI-generated suggestions, and automatically create Spotify playlists.

## Architecture

The system consists of three main components:

- **React Frontend** (`spotify-playlist-creator/`) - Conversational chat interface for playlist curation
- **n8n Workflow Engine** (`n8n_workflows/`) - Backend automation with OpenAI and Spotify API integration
- **External APIs** (within n8n) - OpenAI GPT-4 for music curation, Spotify Web API for playlist creation

## Quick Start

### 1. Prerequisites

- **Docker and Docker Compose** (recommended) OR **Node.js 18+** for local n8n installation
- **OpenAI API Key** from [OpenAI Platform](https://platform.openai.com/)
- **Spotify App** registered at [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)

### 2. n8n Backend Setup

#### Option A: Docker (Recommended)
```bash

# Start n8n with docker-compose
docker-compose up -d

# Or use docker run directly
docker run -it --rm \
 --name n8n \
 -p 5678:5678 \
 -e GENERIC_TIMEZONE="Asia/Jerusalem" \
 -e TZ="Asia/Jerusalem" \
 -e N8N_ENFORCE_SETTINGS_FILE_PERMISSIONS=true \
 -e N8N_RUNNERS_ENABLED=true \
 -e N8N_HOST=127.0.0.1 \
 -v ./n8n-data:/home/node/.n8n \
 docker.n8n.io/n8nio/n8n
```

#### Option B: Local Installation
```bash
# Install n8n globally
npm install n8n -g

# Start n8n (default: http://localhost:5678)
n8n start
```

#### Configure Credentials
1. **OpenAI**: Personal → Credentials → Add → OpenAI
   - Enter your API key
   - Save as "OpenAi account"

2. **Spotify**: Personal → Credentials → Add → Spotify OAuth2 API
   - Client ID and Secret from your Spotify app
   - Redirect URI: `http://127.0.0.1:5678/rest/oauth2-credential/callback`
   - Complete OAuth flow and save as "Spotify account"

#### Import Workflows
1. Open n8n at http://127.0.0.1:5678
2. Go to **Workflows** → **create workflow** -> **three dots** -> **Import from File**
3. Import these workflows in order:
   - `n8n_workflows/spotify_generate.json` - AI playlist generation
   - `n8n_workflows/spotify_refine.json` - Playlist refinement 
   - `n8n_workflows/spotify_create_playlist.json` - Spotify playlist creation
4. if some nodes are red go in them and go out, its a n8n bug. (or maybe you need to add some setting there).

#### Activate Workflows
1. Open each imported workflow
2. Click **Activate** toggle in top-right
3. Verify webhook URLs are available:
   - http://127.0.0.1:5678/webhook/generate-suggestions
   - http://127.0.0.1:5678/webhook/refine-suggestions  
   - http://127.0.0.1:5678/webhook/create-playlist

### 3. React Frontend Setup

```bash
# Navigate to frontend directory
cd spotify-playlist-creator

# Install dependencies
npm install

# Start development server
npm run dev

# Optional: Start Storybook for component development
npm run storybook
```

The frontend will be available at http://localhost:5173

### 4. Verify Complete Setup

Test the system end-to-end:

1. **Generate Playlist**: Open the React app and enter a musical prompt
2. **Refine**: Provide feedback to modify suggestions
3. **Create**: Configure playlist metadata and create on Spotify

## Project Structure

```
spotify_n8n/
├── README.md                          # This file
├── docker-compose.yml                 # Docker setup for n8n
├── CLAUDE.md                          # AI assistant instructions
├── project_md_files/                  # Documentation files
│   ├── PRD.md                         # Product requirements document
│   └── N8N_SETUP_INSTRUCTIONS.md     # Detailed n8n configuration
├── n8n-data/                          # Persistent n8n data (created on first run)
├── n8n_workflows/                     # n8n workflow definitions
│   ├── spotify_generate.json          # AI playlist generation workflow
│   ├── spotify_refine.json            # Playlist refinement workflow
│   └── spotify_create_playlist.json   # Spotify creation workflow
└── spotify-playlist-creator/          # React frontend application
    ├── README.md                      # Frontend-specific documentation
    ├── package.json                   # Dependencies and scripts
    ├── src/
    │   ├── components/                # React components
    │   ├── context/                   # State management
    │   ├── services/                  # API integration
    │   └── types/                     # TypeScript definitions
    └── .storybook/                    # Component development environment
```

## Development Workflow


## Detailed Documentation

- **[N8N_SETUP_INSTRUCTIONS.md](./project_md_files/N8N_SETUP_INSTRUCTIONS.md)** - Comprehensive n8n workflow configuration
- **[Frontend README](./spotify-playlist-creator/README.md)** - React application details and component documentation
- **[CLAUDE.md](./CLAUDE.md)** - Project architecture and AI assistant guidance
- **[PRD.md](./project_md_files/PRD.md)** - Product requirements and technical specifications

## Troubleshooting

## License

This project is for educational and personal use. Ensure compliance with OpenAI, Spotify, and n8n terms of service when deploying.