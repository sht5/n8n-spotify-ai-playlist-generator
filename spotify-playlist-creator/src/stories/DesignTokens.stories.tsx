import type { Meta, StoryObj } from '@storybook/react';
import styled from 'styled-components';

const TokenContainer = styled.div`
  padding: 20px;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
`;

const Section = styled.div`
  margin-bottom: 40px;
`;

const SectionTitle = styled.h2`
  color: #1DB954;
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 20px;
`;

const ColorGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 20px;
`;

const ColorCard = styled.div<{ color: string }>`
  background: ${props => props.color};
  height: 80px;
  border-radius: 8px;
  padding: 12px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const ColorName = styled.span`
  color: white;
  font-weight: 600;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
`;

const ColorValue = styled.span`
  color: rgba(255, 255, 255, 0.8);
  font-size: 12px;
  font-family: 'Monaco', 'Menlo', 'Consolas', monospace;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
`;

const TypographyGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const TypographyExample = styled.div<{ 
  fontSize: string; 
  fontWeight: string | number;
  color?: string;
}>`
  font-size: ${props => props.fontSize};
  font-weight: ${props => props.fontWeight};
  color: ${props => props.color || '#ffffff'};
  margin-bottom: 8px;
`;

const TypographyLabel = styled.span`
  color: #1DB954;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-left: 16px;
`;

const SpacingGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 16px;
`;

const SpacingExample = styled.div<{ size: string }>`
  display: flex;
  align-items: center;
  gap: 12px;
  color: white;
  font-size: 14px;
`;

const SpacingBox = styled.div<{ size: string }>`
  width: ${props => props.size};
  height: ${props => props.size};
  background: #1DB954;
  border-radius: 4px;
`;

const DesignTokensComponent = () => {
  const colors = [
    { name: 'Primary Green', value: '#1DB954', color: '#1DB954' },
    { name: 'Secondary Green', value: '#1ed760', color: '#1ed760' },
    { name: 'Dark Primary', value: '#0f0f0f', color: '#0f0f0f' },
    { name: 'Dark Secondary', value: '#1a1a1a', color: '#1a1a1a' },
    { name: 'Card Background', value: 'rgba(30, 30, 30, 0.8)', color: 'rgba(30, 30, 30, 0.8)' },
    { name: 'Border Color', value: 'rgba(29, 185, 84, 0.2)', color: 'rgba(29, 185, 84, 0.2)' },
    { name: 'White', value: '#ffffff', color: '#ffffff' },
    { name: 'White 70%', value: 'rgba(255, 255, 255, 0.7)', color: 'rgba(255, 255, 255, 0.7)' },
    { name: 'White 50%', value: 'rgba(255, 255, 255, 0.5)', color: 'rgba(255, 255, 255, 0.5)' },
    { name: 'Error Red', value: '#dc143c', color: '#dc143c' },
  ];

  const typography = [
    { name: 'App Title', fontSize: '48px', fontWeight: '900' },
    { name: 'Section Title', fontSize: '24px', fontWeight: '700' },
    { name: 'Card Title', fontSize: '16px', fontWeight: '600' },
    { name: 'Body Text', fontSize: '14px', fontWeight: '400' },
    { name: 'Caption', fontSize: '12px', fontWeight: '500' },
    { name: 'Small Text', fontSize: '11px', fontWeight: '400', color: 'rgba(255, 255, 255, 0.6)' },
  ];

  const spacing = [
    { name: '4px', size: '4px' },
    { name: '8px', size: '8px' },
    { name: '12px', size: '12px' },
    { name: '16px', size: '16px' },
    { name: '20px', size: '20px' },
    { name: '24px', size: '24px' },
    { name: '32px', size: '32px' },
    { name: '40px', size: '40px' },
  ];

  return (
    <TokenContainer>
      <Section>
        <SectionTitle>Color Palette</SectionTitle>
        <ColorGrid>
          {colors.map((color) => (
            <ColorCard key={color.name} color={color.color}>
              <ColorName>{color.name}</ColorName>
              <ColorValue>{color.value}</ColorValue>
            </ColorCard>
          ))}
        </ColorGrid>
      </Section>

      <Section>
        <SectionTitle>Typography Scale</SectionTitle>
        <TypographyGrid>
          {typography.map((typo) => (
            <div key={typo.name}>
              <TypographyExample 
                fontSize={typo.fontSize} 
                fontWeight={typo.fontWeight}
                color={typo.color}
              >
                The quick brown fox jumps over the lazy dog
                <TypographyLabel>
                  {typo.name} - {typo.fontSize} / {typo.fontWeight}
                </TypographyLabel>
              </TypographyExample>
            </div>
          ))}
        </TypographyGrid>
      </Section>

      <Section>
        <SectionTitle>Spacing Scale</SectionTitle>
        <SpacingGrid>
          {spacing.map((space) => (
            <SpacingExample key={space.name} size={space.size}>
              <SpacingBox size={space.size} />
              {space.name}
            </SpacingExample>
          ))}
        </SpacingGrid>
      </Section>
    </TokenContainer>
  );
};

const meta: Meta<typeof DesignTokensComponent> = {
  title: 'Design System/Design Tokens',
  component: DesignTokensComponent,
  parameters: {
    layout: 'fullscreen',
    backgrounds: {
      default: 'dark',
    },
    docs: {
      description: {
        component: 'Visual representation of the design tokens used throughout the Spotify Playlist Creator application.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const All: Story = {};