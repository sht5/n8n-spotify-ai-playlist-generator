import React from 'react';
import styled from 'styled-components';
import { PlaylistProvider } from './context/PlaylistContext';
import { ChatInterface } from './components/ChatInterface';
import { PlaylistPreview } from './components/PlaylistPreview';
import { PlaylistControls } from './components/PlaylistControls';

const AppContainer = styled.div`
  min-height: 100vh;
  background: 
    radial-gradient(circle at 20% 50%, rgba(29, 185, 84, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(29, 185, 84, 0.08) 0%, transparent 50%),
    linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 50%, #0f0f0f 100%);
  color: white;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  position: relative;
  overflow-x: hidden;
`;

const BackgroundPattern = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: 
    radial-gradient(circle at 25px 25px, rgba(29, 185, 84, 0.03) 2px, transparent 0);
  background-size: 50px 50px;
  pointer-events: none;
  z-index: 0;
`;

const FloatingNote = styled.div<{ delay: number; duration: number; left: number }>`
  position: fixed;
  color: rgba(29, 185, 84, 0.1);
  font-size: 24px;
  animation: float ${props => props.duration}s ease-in-out infinite;
  animation-delay: ${props => props.delay}s;
  left: ${props => props.left}%;
  top: 100vh;
  pointer-events: none;
  z-index: 1;
  
  @keyframes float {
    0% {
      transform: translateY(0) rotate(0deg);
      opacity: 0;
    }
    10% {
      opacity: 1;
    }
    90% {
      opacity: 1;
    }
    100% {
      transform: translateY(-100vh) rotate(360deg);
      opacity: 0;
    }
  }
`;

const MainContent = styled.div`
  position: relative;
  z-index: 2;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  padding: 24px;
  min-height: 100vh;
  max-width: 1400px;
  margin: 0 auto;
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    gap: 16px;
    padding: 16px;
  }
`;

const LeftPanel = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const RightPanel = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0;
`;

const Header = styled.div`
  text-align: center;
  padding: 40px 20px;
  position: relative;
  z-index: 2;
`;

const AppTitle = styled.h1`
  font-size: 48px;
  font-weight: 900;
  margin: 0;
  background: linear-gradient(135deg, #1DB954, #1ed760);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: -0.02em;
  
  @media (max-width: 768px) {
    font-size: 36px;
  }
`;

const AppSubtitle = styled.p`
  font-size: 18px;
  color: rgba(255, 255, 255, 0.7);
  margin: 12px 0 0 0;
  font-weight: 400;
  
  @media (max-width: 768px) {
    font-size: 16px;
  }
`;

const FloatingNotes = [
  { symbol: '♪', delay: 0, duration: 15, left: 10 },
  { symbol: '♫', delay: 3, duration: 18, left: 30 },
  { symbol: '♩', delay: 6, duration: 12, left: 50 },
  { symbol: '♬', delay: 9, duration: 16, left: 70 },
  { symbol: '♪', delay: 12, duration: 14, left: 90 },
];

function App() {
  return (
    <PlaylistProvider>
      <AppContainer>
        <BackgroundPattern />
        
        {FloatingNotes.map((note, index) => (
          <FloatingNote
            key={index}
            delay={note.delay}
            duration={note.duration}
            left={note.left}
          >
            {note.symbol}
          </FloatingNote>
        ))}

        <Header>
          <AppTitle>AI Playlist Creator</AppTitle>
          <AppSubtitle>
            Discover your perfect soundtrack with the power of AI
          </AppSubtitle>
        </Header>

        <MainContent>
          <LeftPanel>
            <ChatInterface />
          </LeftPanel>

          <RightPanel>
            <PlaylistPreview />
            <PlaylistControls />
          </RightPanel>
        </MainContent>
      </AppContainer>
    </PlaylistProvider>
  );
}

export default App;
