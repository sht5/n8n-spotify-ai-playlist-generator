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

const VinylContainer = styled.div<{ size?: number }>`
  display: flex;
  justify-content: center;
  align-items: center;
  width: ${props => props.size || 80}px;
  height: ${props => props.size || 80}px;
`;

const VinylRecord = styled.div<{ size?: number }>`
  width: ${props => props.size || 80}px;
  height: ${props => props.size || 80}px;
  background: 
    radial-gradient(circle at center, #000 20%, #1a1a1a 21%, #1a1a1a 25%, #000 26%),
    conic-gradient(from 0deg, #333 0deg, #111 30deg, #333 60deg, #111 90deg, #333 120deg, #111 150deg, #333 180deg, #111 210deg, #333 240deg, #111 270deg, #333 300deg, #111 330deg);
  border-radius: 50%;
  position: relative;
  animation: ${spin} 1.5s linear infinite;
  box-shadow: 
    0 0 0 2px #444,
    0 4px 12px rgba(0, 0, 0, 0.3),
    inset 0 0 0 1px rgba(255, 255, 255, 0.1);
  
  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 8px;
    height: 8px;
    background: #000;
    border-radius: 50%;
    transform: translate(-50%, -50%);
    box-shadow: inset 0 0 0 1px #333;
  }
  
  &::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 30%;
    height: 30%;
    background: radial-gradient(circle, transparent 30%, #1a1a1a 31%, #1a1a1a 35%, transparent 36%);
    border-radius: 50%;
    transform: translate(-50%, -50%);
  }
`;

const LoadingText = styled.p`
  color: #1DB954;
  font-size: 14px;
  font-weight: 500;
  margin-top: 16px;
  text-align: center;
  opacity: 0.8;
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
        <VinylRecord size={size} />
      </VinylContainer>
      {text && <LoadingText>{text}</LoadingText>}
    </LoadingContainer>
  );
};

export default VinylLoader;