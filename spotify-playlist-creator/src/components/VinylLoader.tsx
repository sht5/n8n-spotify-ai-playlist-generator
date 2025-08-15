import React from 'react';
import styled, { keyframes } from 'styled-components';

const spin = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

const glow = keyframes`
  0%, 100% {
    box-shadow: 
      0 0 5px rgba(29, 185, 84, 0.5),
      0 0 10px rgba(29, 185, 84, 0.3),
      0 0 15px rgba(29, 185, 84, 0.2),
      0 4px 20px rgba(0, 0, 0, 0.3);
  }
  50% {
    box-shadow: 
      0 0 10px rgba(29, 185, 84, 0.8),
      0 0 20px rgba(29, 185, 84, 0.5),
      0 0 30px rgba(29, 185, 84, 0.3),
      0 4px 20px rgba(0, 0, 0, 0.3);
  }
`;

const shimmer = keyframes`
  0% {
    background-position: -100% 0;
  }
  100% {
    background-position: 100% 0;
  }
`;

const VinylContainer = styled.div<{ size?: number }>`
  display: flex;
  justify-content: center;
  align-items: center;
  width: ${props => props.size || 80}px;
  height: ${props => props.size || 80}px;
  position: relative;
`;

const VinylRecord = styled.div<{ size?: number }>`
  width: ${props => props.size || 80}px;
  height: ${props => props.size || 80}px;
  background: 
    /* Outer rim gradient */
    radial-gradient(circle at center, 
      transparent 75%, 
      #1DB954 76%, 
      #1ed760 78%, 
      #1DB954 80%, 
      transparent 82%
    ),
    /* Label area */
    radial-gradient(circle at center, 
      #1a1a1a 0%, 
      #2a2a2a 15%, 
      #1a1a1a 20%, 
      transparent 25%
    ),
    /* Vinyl grooves */
    repeating-conic-gradient(
      from 0deg at center,
      #0a0a0a 0deg,
      #1a1a1a 0.5deg,
      #0a0a0a 1deg,
      #1a1a1a 1.5deg
    ),
    /* Base vinyl color */
    linear-gradient(45deg, #0f0f0f, #1a1a1a, #0f0f0f);
  border-radius: 50%;
  position: relative;
  animation: ${spin} 1.2s linear infinite, ${glow} 2s ease-in-out infinite;
  
  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 12px;
    height: 12px;
    background: radial-gradient(circle, #000 30%, #1a1a1a 70%);
    border-radius: 50%;
    transform: translate(-50%, -50%);
    box-shadow: 
      inset 0 0 3px rgba(0, 0, 0, 0.8),
      0 0 2px rgba(29, 185, 84, 0.3);
    z-index: 3;
  }
  
  &::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 35%;
    height: 35%;
    background: 
      radial-gradient(circle, 
        rgba(29, 185, 84, 0.1) 0%, 
        rgba(29, 185, 84, 0.2) 30%, 
        transparent 50%
      );
    border-radius: 50%;
    transform: translate(-50%, -50%);
    z-index: 2;
  }
`;

const ReflectionOverlay = styled.div<{ size?: number }>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.1) 0%,
    rgba(255, 255, 255, 0.05) 20%,
    transparent 40%,
    transparent 60%,
    rgba(29, 185, 84, 0.1) 80%,
    rgba(29, 185, 84, 0.2) 100%
  );
  border-radius: 50%;
  pointer-events: none;
  z-index: 1;
`;

const SpotifyNote = styled.div<{ size?: number }>`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #1DB954;
  font-size: ${props => (props.size || 80) * 0.2}px;
  font-weight: bold;
  z-index: 4;
  text-shadow: 0 0 5px rgba(29, 185, 84, 0.5);
`;

const pulse = keyframes`
  0%, 100% {
    opacity: 0.6;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.02);
  }
`;

const LoadingText = styled.p`
  color: #1DB954;
  font-size: 14px;
  font-weight: 600;
  margin-top: 20px;
  text-align: center;
  animation: ${pulse} 1.5s ease-in-out infinite;
  text-shadow: 0 0 8px rgba(29, 185, 84, 0.3);
  letter-spacing: 0.5px;
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
`;

interface VinylLoaderProps {
  size?: number;
  text?: string;
  className?: string;
}

export const VinylLoader: React.FC<VinylLoaderProps> = ({ 
  size = 80, 
  text = "Loading...",
  className 
}) => {
  return (
    <LoadingContainer className={className}>
      <VinylContainer size={size}>
        <VinylRecord size={size}>
          <ReflectionOverlay size={size} />
        </VinylRecord>
        <SpotifyNote size={size}>♪</SpotifyNote>
      </VinylContainer>
      {text && <LoadingText>{text}</LoadingText>}
    </LoadingContainer>
  );
};

export default VinylLoader;