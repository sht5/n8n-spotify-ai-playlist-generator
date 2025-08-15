import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import type { Song } from '../types/Song';

const CardContainer = styled(motion.div)`
  background: rgba(30, 30, 30, 0.8);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(29, 185, 84, 0.2);
  border-radius: 12px;
  padding: 16px;
  margin: 8px 0;
  transition: all 0.3s ease;
  cursor: grab;
  
  &:hover {
    background: rgba(30, 30, 30, 0.9);
    border-color: rgba(29, 185, 84, 0.4);
    transform: translateY(-2px);
    box-shadow: 0 8px 32px rgba(29, 185, 84, 0.1);
  }
  
  &:active {
    cursor: grabbing;
  }
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const AlbumArt = styled.div`
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #1DB954, #1ed760);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  color: white;
  flex-shrink: 0;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      radial-gradient(circle at 50% 50%, transparent 20%, rgba(0,0,0,0.1) 21%),
      repeating-conic-gradient(from 0deg at 50% 50%, transparent 0deg, rgba(0,0,0,0.05) 2deg, transparent 4deg);
  }
  
  &::after {
    content: '♪';
    position: relative;
    z-index: 1;
  }
`;

const SongInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const SongTitle = styled.h3`
  color: white;
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 4px 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ArtistName = styled.p`
  color: rgba(255, 255, 255, 0.7);
  font-size: 14px;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const RemoveButton = styled.button`
  background: rgba(220, 20, 60, 0.1);
  border: 1px solid rgba(220, 20, 60, 0.3);
  border-radius: 8px;
  color: #dc143c;
  padding: 8px 12px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(220, 20, 60, 0.2);
    border-color: rgba(220, 20, 60, 0.5);
  }
`;

const Reasoning = styled.p`
  color: rgba(255, 255, 255, 0.6);
  font-size: 12px;
  margin: 12px 0 0 0;
  font-style: italic;
  line-height: 1.4;
`;

const DragHandle = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 8px;
  cursor: grab;
  opacity: 0.5;
  transition: opacity 0.2s ease;
  
  ${CardContainer}:hover & {
    opacity: 1;
  }
  
  &:active {
    cursor: grabbing;
  }
`;

const DragDot = styled.div`
  width: 4px;
  height: 4px;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 50%;
`;

interface SongCardProps {
  song: Song;
  index: number;
  onRemove: () => void;
  isDragging?: boolean;
}

export const SongCard: React.FC<SongCardProps> = ({ 
  song, 
  index, 
  onRemove,
  isDragging = false
}) => {
  return (
    <CardContainer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -300 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      style={{ 
        opacity: isDragging ? 0.5 : 1,
        transform: isDragging ? 'rotate(5deg)' : 'rotate(0deg)'
      }}
    >
      <CardHeader>
        <DragHandle>
          <DragDot />
          <DragDot />
          <DragDot />
        </DragHandle>
        
        <AlbumArt />
        
        <SongInfo>
          <SongTitle>{song.title}</SongTitle>
          <ArtistName>{song.artist}</ArtistName>
        </SongInfo>
        
        <RemoveButton onClick={onRemove}>
          Remove
        </RemoveButton>
      </CardHeader>
      
      {song.reasoning && (
        <Reasoning>
          "{song.reasoning}"
        </Reasoning>
      )}
    </CardContainer>
  );
};

export default SongCard;