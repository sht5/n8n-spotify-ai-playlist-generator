import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import type { ChatMessage } from '../types/ChatMessage';
import { usePlaylist } from '../context/PlaylistContext';
import { apiService } from '../services/api';
import { VinylLoader } from './VinylLoader';

const ChatContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  background: rgba(20, 20, 20, 0.8);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  border: 1px solid rgba(29, 185, 84, 0.2);
  overflow: hidden;
`;

const ChatHeader = styled.div`
  padding: 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(10, 10, 10, 0.5);
`;

const ChatTitle = styled.h2`
  color: #1DB954;
  font-size: 24px;
  font-weight: 700;
  margin: 0;
  text-align: center;
`;

const ChatSubtitle = styled.p`
  color: rgba(255, 255, 255, 0.7);
  font-size: 14px;
  margin: 8px 0 0 0;
  text-align: center;
`;

const MessagesContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  
  /* Custom scrollbar */
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #1DB954;
    border-radius: 3px;
  }
`;

const MessageBubble = styled(motion.div)<{ isUser: boolean }>`
  max-width: 80%;
  padding: 12px 16px;
  border-radius: 18px;
  align-self: ${props => props.isUser ? 'flex-end' : 'flex-start'};
  background: ${props => props.isUser 
    ? 'linear-gradient(135deg, #1DB954, #1ed760)' 
    : 'rgba(40, 40, 40, 0.8)'
  };
  color: white;
  font-size: 14px;
  line-height: 1.4;
  position: relative;
  border: ${props => props.isUser 
    ? 'none' 
    : '1px solid rgba(29, 185, 84, 0.3)'
  };
`;

const MessageTime = styled.div`
  font-size: 11px;
  opacity: 0.6;
  margin-top: 4px;
`;

const InputContainer = styled.div`
  padding: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(10, 10, 10, 0.5);
`;

const InputWrapper = styled.div`
  display: flex;
  gap: 12px;
  align-items: flex-end;
`;

const MessageInput = styled.textarea`
  flex: 1;
  background: rgba(40, 40, 40, 0.8);
  border: 1px solid rgba(29, 185, 84, 0.3);
  border-radius: 12px;
  padding: 12px 16px;
  color: white;
  font-size: 14px;
  font-family: inherit;
  resize: none;
  min-height: 48px;
  max-height: 120px;
  outline: none;
  transition: all 0.2s ease;
  
  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }
  
  &:focus {
    border-color: #1DB954;
    background: rgba(40, 40, 40, 0.9);
  }
`;

const SendButton = styled.button`
  background: linear-gradient(135deg, #1DB954, #1ed760);
  border: none;
  border-radius: 12px;
  padding: 12px 20px;
  color: white;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  height: 48px;
  
  &:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(29, 185, 84, 0.3);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
`;

const EmptyState = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 40px 20px;
`;

const EmptyStateTitle = styled.h3`
  color: #1DB954;
  font-size: 20px;
  font-weight: 600;
  margin: 0 0 12px 0;
`;

const EmptyStateText = styled.p`
  color: rgba(255, 255, 255, 0.7);
  font-size: 14px;
  line-height: 1.5;
  margin: 0;
`;

export const ChatInterface: React.FC = () => {
  const { state, actions } = usePlaylist();
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [state.chatHistory]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSendMessage = async () => {
    const message = inputValue.trim();
    if (!message || state.isLoading) return;

    try {
      // Add user message
      actions.addUserMessage(message);
      setInputValue('');

      // Determine if this is initial generation or refinement
      const isRefinement = state.currentPlaylist.length > 0;
      
      if (isRefinement) {
        // Refine existing playlist
        actions.setLoading(true, 'refining');
        
        const response = await apiService.refineSuggestions({
          feedback: message,
          currentPlaylist: state.currentPlaylist,
        });

        // Add assistant response
        actions.addAssistantMessage(
          `I've refined your playlist based on your feedback. Here are ${response.suggestions.length} updated suggestions!`,
          response.suggestions
        );

        // Update playlist
        actions.setPlaylist(response.suggestions, response.playlistName, response.playlistDescription);
      } else {
        // Generate initial playlist
        actions.setLoading(true, 'generating');
        
        const response = await apiService.generateSuggestions({
          prompt: message,
        });

        // Add assistant response
        actions.addAssistantMessage(
          `Great! I've created a playlist called "${response.playlistName}" with ${response.suggestions.length} song suggestions. Feel free to ask for any changes!`,
          response.suggestions
        );

        // Set initial playlist
        actions.setPlaylist(response.suggestions, response.playlistName, response.playlistDescription);
      }
    } catch (error) {
      console.error('Error processing message:', error);
      const errorMessage = error instanceof Error ? error.message : 'Something went wrong. Please try again.';
      actions.setError(errorMessage);
      actions.addAssistantMessage(`Sorry, I encountered an error: ${errorMessage}`);
    } finally {
      actions.setLoading(false);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour12: true, 
      hour: 'numeric', 
      minute: '2-digit' 
    });
  };

  const getLoadingText = () => {
    switch (state.loadingType) {
      case 'generating':
        return 'Generating your playlist...';
      case 'refining':
        return 'Refining your playlist...';
      case 'creating':
        return 'Creating playlist on Spotify...';
      default:
        return 'Processing...';
    }
  };

  return (
    <ChatContainer>
      <ChatHeader>
        <ChatTitle>AI Playlist Creator</ChatTitle>
        <ChatSubtitle>
          Tell me what kind of music you're in the mood for
        </ChatSubtitle>
      </ChatHeader>

      <MessagesContainer>
        {state.chatHistory.length === 0 ? (
          <EmptyState>
            <EmptyStateTitle>🎵 Let's Create Music Magic!</EmptyStateTitle>
            <EmptyStateText>
              Describe the vibe you're looking for and I'll curate the perfect playlist for you.
              <br />
              <br />
              Try something like:
              <br />
              "Upbeat songs for a workout"
              <br />
              "Chill indie for studying"
              <br />
              "Classic rock road trip hits"
            </EmptyStateText>
          </EmptyState>
        ) : (
          <AnimatePresence>
            {state.chatHistory.map((message, index) => (
              <MessageBubble
                key={message.id}
                isUser={message.type === 'user'}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                {message.content}
                <MessageTime>
                  {formatTime(message.timestamp)}
                </MessageTime>
              </MessageBubble>
            ))}
          </AnimatePresence>
        )}

        {state.isLoading && (
          <LoadingContainer>
            <VinylLoader size={60} text={getLoadingText()} />
          </LoadingContainer>
        )}

        <div ref={messagesEndRef} />
      </MessagesContainer>

      <InputContainer>
        <InputWrapper>
          <MessageInput
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={
              state.currentPlaylist.length === 0
                ? "Describe your ideal playlist..."
                : "Ask me to refine your playlist..."
            }
            disabled={state.isLoading}
          />
          <SendButton 
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || state.isLoading}
          >
            Send
          </SendButton>
        </InputWrapper>
      </InputContainer>
    </ChatContainer>
  );
};

export default ChatInterface;