import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { usePlaylist } from '../context/PlaylistContext';
import { apiService } from '../services/api';
import { VinylLoader } from './VinylLoader';

const ControlsContainer = styled.div`
  padding: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(10, 10, 10, 0.5);
`;

const ControlsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-bottom: 16px;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  color: rgba(255, 255, 255, 0.8);
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const Input = styled.input`
  background: rgba(40, 40, 40, 0.8);
  border: 1px solid rgba(29, 185, 84, 0.3);
  border-radius: 8px;
  padding: 12px 16px;
  color: white;
  font-size: 14px;
  outline: none;
  transition: all 0.2s ease;
  
  &::placeholder {
    color: rgba(255, 255, 255, 0.4);
  }
  
  &:focus {
    border-color: #1DB954;
    background: rgba(40, 40, 40, 0.9);
  }
`;

const CheckboxContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  grid-column: 1 / -1;
  margin-top: 8px;
`;

const Checkbox = styled.input`
  width: 16px;
  height: 16px;
  accent-color: #1DB954;
`;

const CheckboxLabel = styled.label`
  color: rgba(255, 255, 255, 0.8);
  font-size: 14px;
  cursor: pointer;
`;

const CreateButton = styled(motion.button)<{ disabled: boolean }>`
  width: 100%;
  background: ${props => props.disabled 
    ? 'rgba(100, 100, 100, 0.3)' 
    : 'linear-gradient(135deg, #1DB954, #1ed760)'
  };
  border: none;
  border-radius: 12px;
  padding: 16px 24px;
  color: white;
  font-size: 16px;
  font-weight: 600;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-top: 16px;
  
  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(29, 185, 84, 0.3);
  }
`;

const ButtonIcon = styled.span`
  font-size: 18px;
`;

const SuccessMessage = styled(motion.div)`
  background: rgba(29, 185, 84, 0.1);
  border: 1px solid rgba(29, 185, 84, 0.3);
  border-radius: 12px;
  padding: 16px;
  margin-top: 16px;
  text-align: center;
`;

const SuccessTitle = styled.h3`
  color: #1DB954;
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 8px 0;
`;

const SuccessText = styled.p`
  color: rgba(255, 255, 255, 0.8);
  font-size: 14px;
  margin: 0 0 12px 0;
`;

const SpotifyLink = styled.a`
  color: #1DB954;
  text-decoration: none;
  font-weight: 600;
  font-size: 14px;
  
  &:hover {
    text-decoration: underline;
  }
`;

const ErrorMessage = styled(motion.div)`
  background: rgba(220, 20, 60, 0.1);
  border: 1px solid rgba(220, 20, 60, 0.3);
  border-radius: 12px;
  padding: 16px;
  margin-top: 16px;
  text-align: center;
`;

const ErrorTitle = styled.h3`
  color: #dc143c;
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 8px 0;
`;

const ErrorText = styled.p`
  color: rgba(255, 255, 255, 0.8);
  font-size: 14px;
  margin: 0;
`;

const ResetButton = styled.button`
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 8px;
  padding: 8px 16px;
  color: rgba(255, 255, 255, 0.7);
  font-size: 12px;
  cursor: pointer;
  margin-top: 12px;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: rgba(255, 255, 255, 0.5);
    color: white;
  }
`;

interface PlaylistResult {
  success: boolean;
  playlistUrl?: string;
  error?: string;
  tracksAdded?: number;
}

export const PlaylistControls: React.FC = () => {
  const { state, actions } = usePlaylist();
  const [playlistResult, setPlaylistResult] = useState<PlaylistResult | null>(null);
  
  // Local state for form inputs
  const [playlistName, setPlaylistName] = useState(state.playlistMetadata.name);
  const [playlistDescription, setPlaylistDescription] = useState(state.playlistMetadata.description);
  const [isPublic, setIsPublic] = useState(state.playlistMetadata.isPublic);

  // Update local state when playlist metadata changes
  React.useEffect(() => {
    setPlaylistName(state.playlistMetadata.name);
    setPlaylistDescription(state.playlistMetadata.description);
    setIsPublic(state.playlistMetadata.isPublic);
  }, [state.playlistMetadata]);

  const handleCreatePlaylist = async () => {
    if (state.currentPlaylist.length === 0 || state.isLoading) return;

    try {
      actions.setLoading(true, 'creating');
      setPlaylistResult(null);

      // Update metadata before creating
      actions.setPlaylistMetadata(
        playlistName || state.playlistMetadata.name || 'My AI Playlist',
        playlistDescription || state.playlistMetadata.description || '',
        isPublic
      );

      const response = await apiService.createPlaylist({
        playlistName: playlistName || state.playlistMetadata.name || 'My AI Playlist',
        playlistDescription: playlistDescription || state.playlistMetadata.description,
        isPublic,
        songs: state.currentPlaylist,
      });

      setPlaylistResult({
        success: true,
        playlistUrl: response.playlistUrl,
        tracksAdded: response.tracksAdded,
      });

      actions.addAssistantMessage(
        `🎉 Success! Your playlist "${playlistName || state.playlistMetadata.name}" has been created on Spotify with ${response.tracksAdded} tracks!`
      );

    } catch (error) {
      console.error('Error creating playlist:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to create playlist';
      
      setPlaylistResult({
        success: false,
        error: errorMessage,
      });

      actions.setError(errorMessage);
      actions.addAssistantMessage(`❌ Sorry, I couldn't create your playlist: ${errorMessage}`);
    } finally {
      actions.setLoading(false);
    }
  };

  const handleReset = () => {
    setPlaylistResult(null);
    actions.resetPlaylist();
  };

  const canCreatePlaylist = state.currentPlaylist.length > 0 && !state.isLoading;

  return (
    <ControlsContainer>
      <ControlsGrid>
        <InputGroup>
          <Label>Playlist Name</Label>
          <Input
            type="text"
            value={playlistName}
            onChange={(e) => setPlaylistName(e.target.value)}
            placeholder="Enter playlist name..."
            disabled={state.isLoading}
          />
        </InputGroup>

        <InputGroup>
          <Label>Description (Optional)</Label>
          <Input
            type="text"
            value={playlistDescription}
            onChange={(e) => setPlaylistDescription(e.target.value)}
            placeholder="Add a description..."
            disabled={state.isLoading}
          />
        </InputGroup>

        <CheckboxContainer>
          <Checkbox
            type="checkbox"
            id="isPublic"
            checked={isPublic}
            onChange={(e) => setIsPublic(e.target.checked)}
            disabled={state.isLoading}
          />
          <CheckboxLabel htmlFor="isPublic">
            Make playlist public
          </CheckboxLabel>
        </CheckboxContainer>
      </ControlsGrid>

      <CreateButton
        disabled={!canCreatePlaylist}
        onClick={handleCreatePlaylist}
        whileHover={canCreatePlaylist ? { scale: 1.02 } : {}}
        whileTap={canCreatePlaylist ? { scale: 0.98 } : {}}
      >
        {state.isLoading && state.loadingType === 'creating' ? (
          <VinylLoader size={20} />
        ) : (
          <>
            <ButtonIcon>🎵</ButtonIcon>
            Create Spotify Playlist
          </>
        )}
      </CreateButton>

      {playlistResult?.success && (
        <SuccessMessage
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <SuccessTitle>🎉 Playlist Created Successfully!</SuccessTitle>
          <SuccessText>
            Your playlist has been created with {playlistResult.tracksAdded} tracks.
          </SuccessText>
          {playlistResult.playlistUrl && (
            <SpotifyLink 
              href={playlistResult.playlistUrl} 
              target="_blank" 
              rel="noopener noreferrer"
            >
              Open in Spotify →
            </SpotifyLink>
          )}
          <ResetButton onClick={handleReset}>
            Create Another Playlist
          </ResetButton>
        </SuccessMessage>
      )}

      {playlistResult?.error && (
        <ErrorMessage
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <ErrorTitle>❌ Creation Failed</ErrorTitle>
          <ErrorText>{playlistResult.error}</ErrorText>
          <ResetButton onClick={() => setPlaylistResult(null)}>
            Try Again
          </ResetButton>
        </ErrorMessage>
      )}
    </ControlsContainer>
  );
};

export default PlaylistControls;