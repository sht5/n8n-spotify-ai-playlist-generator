import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { usePlaylist } from '../context/PlaylistContext';
import { SongCard } from './SongCard';
import type { Song } from '../types/Song';

const PlaylistContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  background: rgba(20, 20, 20, 0.8);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  border: 1px solid rgba(29, 185, 84, 0.2);
  overflow: hidden;
`;

const PlaylistHeader = styled.div`
  padding: 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(10, 10, 10, 0.5);
`;

const PlaylistTitle = styled.h2`
  color: #1DB954;
  font-size: 24px;
  font-weight: 700;
  margin: 0;
`;

const PlaylistDescription = styled.p`
  color: rgba(255, 255, 255, 0.7);
  font-size: 14px;
  margin: 8px 0 0 0;
  line-height: 1.4;
`;

const SongCount = styled.div`
  color: rgba(255, 255, 255, 0.6);
  font-size: 12px;
  margin: 12px 0 0 0;
  font-weight: 500;
`;

const SongsContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  
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

const EmptyState = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 60px 20px;
`;

const EmptyStateTitle = styled.h3`
  color: rgba(255, 255, 255, 0.8);
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 12px 0;
`;

const EmptyStateText = styled.p`
  color: rgba(255, 255, 255, 0.6);
  font-size: 14px;
  line-height: 1.5;
  margin: 0;
`;

const VinylIcon = styled.div`
  width: 64px;
  height: 64px;
  background: linear-gradient(135deg, #1DB954, #1ed760);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: white;
  margin-bottom: 20px;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 20px;
    height: 20px;
    background: rgba(0, 0, 0, 0.3);
    border-radius: 50%;
    transform: translate(-50%, -50%);
  }
  
  &::after {
    content: '♪';
    position: relative;
    z-index: 1;
  }
`;

const DropZone = styled.div<{ isActive: boolean }>`
  min-height: 100px;
  border: 2px dashed ${props => props.isActive ? '#1DB954' : 'rgba(29, 185, 84, 0.3)'};
  border-radius: 12px;
  background: ${props => props.isActive ? 'rgba(29, 185, 84, 0.1)' : 'transparent'};
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 8px 0;
  transition: all 0.3s ease;
`;

const DropZoneText = styled.p`
  color: rgba(255, 255, 255, 0.5);
  font-size: 14px;
  margin: 0;
`;

interface DraggableSongProps {
  song: Song;
  index: number;
  onRemove: () => void;
}

const DraggableSong: React.FC<DraggableSongProps> = ({ song, index, onRemove }) => {
  const [{ isDragging }, drag] = useDrag({
    type: 'song',
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  return (
    <div ref={drag}>
      <SongCard 
        song={song} 
        index={index} 
        onRemove={onRemove}
        isDragging={isDragging}
      />
    </div>
  );
};

interface DropTargetProps {
  index: number;
  onDrop: (dragIndex: number, hoverIndex: number) => void;
  children: React.ReactNode;
}

const DropTarget: React.FC<DropTargetProps> = ({ index, onDrop, children }) => {
  const [{ isOver }, drop] = useDrop({
    accept: 'song',
    drop: (item: { index: number }) => {
      if (item.index !== index) {
        onDrop(item.index, index);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  return (
    <div ref={drop}>
      {children}
      {isOver && (
        <DropZone isActive={true}>
          <DropZoneText>Drop here to reorder</DropZoneText>
        </DropZone>
      )}
    </div>
  );
};

export const PlaylistPreview: React.FC = () => {
  const { state, actions } = usePlaylist();
  
  const handleRemoveSong = (index: number) => {
    actions.removeSong(index);
  };

  const handleReorderSong = (dragIndex: number, hoverIndex: number) => {
    actions.reorderSongs(dragIndex, hoverIndex);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <PlaylistContainer>
        <PlaylistHeader>
          <PlaylistTitle>
            {state.playlistMetadata.name || 'Your Playlist'}
          </PlaylistTitle>
          {state.playlistMetadata.description && (
            <PlaylistDescription>
              {state.playlistMetadata.description}
            </PlaylistDescription>
          )}
          <SongCount>
            {state.currentPlaylist.length} song{state.currentPlaylist.length !== 1 ? 's' : ''}
          </SongCount>
        </PlaylistHeader>

        <SongsContainer>
          {state.currentPlaylist.length === 0 ? (
            <EmptyState>
              <VinylIcon />
              <EmptyStateTitle>No songs yet</EmptyStateTitle>
              <EmptyStateText>
                Start chatting with the AI to create your perfect playlist!
                <br />
                <br />
                Once songs are generated, you'll be able to:
                <br />
                • Drag and drop to reorder
                <br />
                • Remove songs you don't like
                <br />
                • Ask for refinements
              </EmptyStateText>
            </EmptyState>
          ) : (
            <AnimatePresence>
              {state.currentPlaylist.map((song, index) => (
                <DropTarget
                  key={song.id}
                  index={index}
                  onDrop={handleReorderSong}
                >
                  <DraggableSong
                    song={song}
                    index={index}
                    onRemove={() => handleRemoveSong(index)}
                  />
                </DropTarget>
              ))}
            </AnimatePresence>
          )}
        </SongsContainer>
      </PlaylistContainer>
    </DndProvider>
  );
};

export default PlaylistPreview;