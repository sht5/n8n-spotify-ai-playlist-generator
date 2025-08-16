# n8n Workflow Setup Instructions

This guide walks you through setting up the three n8n workflows for the AI-powered Spotify playlist creator.

## Prerequisites

1. **n8n Installation**: Ensure n8n is installed and running
2. **OpenAI API Key**: Obtain from OpenAI platform
3. **Spotify App Credentials**: Create app at Spotify Developer Dashboard
4. **Base URL**: Note your n8n instance URL (e.g., `http://localhost:5678`)

## Initial Setup

### 1. Configure Credentials

#### OpenAI Credentials
1. Go to **Settings** → **Credentials** in n8n
2. Click **Add Credential** → **OpenAI**
3. Enter your OpenAI API key
4. Test the connection
5. Save as "OpenAI-Playlist-Creator"

#### Spotify Credentials
1. In n8n, add **Spotify OAuth2 API** credential
2. From your Spotify app dashboard, copy:
   - **Client ID**
   - **Client Secret**
3. Set **Redirect URI** to: `{your-n8n-url}/rest/oauth2-credential/callback`
4. Add scopes: `playlist-modify-public,playlist-modify-private,user-read-private`
5. Complete OAuth flow and save as "Spotify-Playlist-Creator"

## Workflow 1: Generate Suggestions

### Create New Workflow
1. Click **New Workflow**
2. Name it "Generate Playlist Suggestions"

### Add Nodes

#### 1. Webhook Trigger
- **Node**: Webhook
- **HTTP Method**: POST
- **Path**: `generate-suggestions`
- **Response Mode**: Return Response
- **Response Data**: JSON

#### 2. OpenAI Chat Node
- **Node**: OpenAI Chat Model
- **Credential**: OpenAI-Playlist-Creator
- **Model**: gpt-4
- **System Message**: 
```
You are a music curator. Generate playlist suggestions based on user prompts. 
Respond with valid JSON in this exact format:
{
  "suggestions": [
    {
      "artist": "Artist Name",
      "title": "Song Title", 
      "reasoning": "Why this song fits",
      "spotifySearchQuery": "artist song title"
    }
  ],
  "playlistName": "Generated Playlist Name",
  "playlistDescription": "Brief description"
}
Suggest 10-15 songs unless user specifies otherwise.
```
- **User Message**: `{{ $json.body.prompt }}`

#### 3. Response Node
- **Node**: Respond to Webhook
- **Response Body**: `{{ $json.message.content }}`
- **Content-Type**: application/json

### Connect and Test
1. Connect: Webhook → OpenAI → Response
2. **Save** the workflow
3. **Activate** the workflow
4. Test with curl:
```bash
curl -X POST {your-n8n-url}/webhook/generate-suggestions \
  -H "Content-Type: application/json" \
  -d '{"prompt": "upbeat workout songs"}'
```

## Workflow 2: Refine Suggestions

### Create New Workflow
1. Click **New Workflow**
2. Name it "Refine Playlist Suggestions"

### Add Nodes

#### 1. Webhook Trigger
- **Node**: Webhook
- **HTTP Method**: POST
- **Path**: `refine-suggestions`
- **Response Mode**: Return Response

#### 2. OpenAI Chat Node
- **Node**: OpenAI Chat Model
- **Credential**: OpenAI-Playlist-Creator
- **Model**: gpt-4
- **System Message**:
```
You are refining a music playlist. The user has feedback about the current playlist.
Current playlist: {{ $json.body.currentPlaylist }}
User feedback: {{ $json.body.feedback }}

Modify the playlist based on feedback. Respond with the same JSON format:
{
  "suggestions": [...],
  "playlistName": "...",
  "playlistDescription": "..."
}
```
- **User Message**: `{{ $json.body.feedback }}`

#### 3. Response Node
- **Node**: Respond to Webhook
- **Response Body**: `{{ $json.message.content }}`
- **Content-Type**: application/json

### Connect and Test
1. Connect: Webhook → OpenAI → Response
2. **Save** and **Activate**
3. Test with existing playlist data

## Workflow 3: Create Spotify Playlist

### Create New Workflow
1. Click **New Workflow**
2. Name it "Create Spotify Playlist"

### Add Nodes

#### 1. Webhook Trigger
- **Node**: Webhook
- **HTTP Method**: POST
- **Path**: `create-playlist`
- **Response Mode**: Return Response

#### 2. Create Playlist Node
- **Node**: Spotify
- **Credential**: Spotify-Playlist-Creator
- **Operation**: Create Playlist
- **Name**: `{{ $json.body.playlistName }}`
- **Description**: `{{ $json.body.playlistDescription }}`
- **Public**: `{{ $json.body.isPublic || false }}`

#### 3. Split In Batches Node
- **Node**: Split In Batches
- **Batch Size**: 1
- **Items**: `{{ $json.body.songs }}`

#### 4. Search Tracks Node
- **Node**: Spotify
- **Credential**: Spotify-Playlist-Creator
- **Operation**: Search
- **Type**: track
- **Query**: `{{ $json.spotifySearchQuery }}`
- **Limit**: 1

#### 5. Function Node (Extract Track ID)
- **Node**: Function
- **Code**:
```javascript
const tracks = $input.all();
const trackIds = tracks
  .filter(track => track.json.tracks?.items?.length > 0)
  .map(track => track.json.tracks.items[0].id);

return [{
  json: { trackIds }
}];
```

#### 6. Add Tracks to Playlist Node
- **Node**: Spotify
- **Credential**: Spotify-Playlist-Creator
- **Operation**: Add Songs to Playlist
- **Playlist ID**: `{{ $('Create Playlist').item.json.id }}`
- **Track IDs**: `{{ $json.trackIds }}`

#### 7. Response Node
- **Node**: Respond to Webhook
- **Response Body**: 
```json
{
  "success": true,
  "playlistId": "{{ $('Create Playlist').item.json.id }}",
  "playlistUrl": "{{ $('Create Playlist').item.json.external_urls.spotify }}",
  "tracksAdded": {{ $json.trackIds.length }}
}
```

### Connect Nodes
1. Webhook → Create Playlist
2. Create Playlist → Split In Batches
3. Split In Batches → Search Tracks
4. Search Tracks → Function (when all items processed)
5. Function → Add Tracks to Playlist
6. Add Tracks to Playlist → Response

### Configure Error Handling
Add **Try/Catch** nodes around Spotify operations:
1. Wrap Search Tracks in Try/Catch
2. On error, continue workflow with empty result
3. Filter out failed searches before adding to playlist

## Testing the Complete Setup

### Test Each Endpoint

#### 1. Generate Suggestions
```bash
curl -X POST {your-n8n-url}/webhook/generate-suggestions \
  -H "Content-Type: application/json" \
  -d '{"prompt": "chill indie rock for studying"}'
```

#### 2. Refine Suggestions
```bash
curl -X POST {your-n8n-url}/webhook/refine-suggestions \
  -H "Content-Type: application/json" \
  -d '{
    "feedback": "add more female artists",
    "currentPlaylist": [previous_suggestions]
  }'
```

#### 3. Create Playlist
```bash
curl -X POST {your-n8n-url}/webhook/create-playlist \
  -H "Content-Type: application/json" \
  -d '{
    "playlistName": "My AI Playlist",
    "playlistDescription": "Created with AI",
    "isPublic": false,
    "songs": [
      {
        "artist": "Artist Name",
        "title": "Song Title",
        "spotifySearchQuery": "artist song title"
      }
    ]
  }'
```

## Troubleshooting

### Common Issues

#### OpenAI Responses
- Ensure system messages produce valid JSON
- Add JSON validation in Function nodes if needed
- Handle rate limiting with Wait nodes

#### Spotify Authentication
- Check redirect URI matches exactly
- Verify scopes include playlist modification
- Re-authenticate if tokens expire

#### Webhook Errors
- Check that workflows are activated
- Verify webhook paths match your React app calls
- Use n8n's execution logs for debugging

### Monitoring
- Enable workflow execution logging
- Set up error notifications
- Monitor API rate limits

## Next Steps

1. **Test thoroughly** with various prompts and edge cases
2. **Note your webhook URLs** for React app configuration
3. **Set up monitoring** for production use
4. **Configure backups** of your n8n workflows

Your webhook endpoints will be:
- `{your-n8n-url}/webhook/generate-suggestions`
- `{your-n8n-url}/webhook/refine-suggestions`  
- `{your-n8n-url}/webhook/create-playlist`

Use these URLs in your React application's API configuration.