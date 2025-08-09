'use client';

import { useEffect, useState } from 'react';

// Mock user object for demo
const mockUser = { uid: 'demo-user-123' };

// Mock dreams data for demo
const mockDreams = [
  {
    userId: 'demo-user-123',
    symbols: ['mirror', 'ocean'],
    emotions: ['peaceful'],
    location: 'bedroom',
    dreamQualityScore: 0.8,
    createdAt: new Date().toISOString()
  },
  {
    userId: 'demo-user-123',
    symbols: ['fire', 'falling'],
    emotions: ['fear', 'anxiety'],
    location: 'unknown',
    dreamQualityScore: 0.6,
    createdAt: new Date().toISOString()
  },
  {
    userId: 'demo-user-123',
    symbols: ['moon', 'voice'],
    emotions: ['wonder', 'curiosity'],
    location: 'forest',
    dreamQualityScore: 0.9,
    createdAt: new Date().toISOString()
  },
  {
    userId: 'demo-user-123',
    symbols: ['shadow', 'key'],
    emotions: ['mystery'],
    location: 'castle',
    dreamQualityScore: 0.7,
    createdAt: new Date().toISOString()
  },
  {
    userId: 'demo-user-123',
    symbols: ['bird', 'flight'],
    emotions: ['freedom', 'joy'],
    location: 'sky',
    dreamQualityScore: 0.95,
    createdAt: new Date().toISOString()
  }
];

type Dream = {
  userId: string;
  symbols: string[];
  emotions: string[];
  location?: string;
  dreamQualityScore?: number;
  createdAt: string;
};

export function DreamConstellationMap() {
  const [dreams, setDreams] = useState<Dream[]>([]);

  useEffect(() => {
    // Simulate loading dreams
    setDreams(mockDreams);
  }, []);

  const mapEmotionToColor = (emotions: string[]) => {
    if (emotions.includes('fear') || emotions.includes('anxiety')) return '#7f1d1d';
    if (emotions.includes('peaceful') || emotions.includes('calm')) return '#14532d';
    if (emotions.includes('wonder') || emotions.includes('curiosity')) return '#1e3a8a';
    if (emotions.includes('freedom') || emotions.includes('joy')) return '#7c2d12';
    if (emotions.includes('mystery')) return '#581c87';
    return '#374151';
  };

  const getSymbolEmoji = (symbol: string) => {
    const emojiMap: Record<string, string> = {
      mirror: '🪞',
      ocean: '🌊',
      fire: '🔥',
      falling: '🪂',
      moon: '🌙',
      voice: '🎵',
      shadow: '🌑',
      key: '🗝️',
      bird: '🕊️',
      flight: '✈️'
    };
    return emojiMap[symbol] || '⭐';
  };

  return (
    <div style={{
      width: '100%',
      height: '100vh',
      position: 'relative',
      background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a3a 50%, #2a2a5a 100%)',
      color: '#fff',
      overflow: 'hidden',
      fontFamily: 'system-ui, sans-serif'
    }}>
      <h2 style={{
        fontSize: '2rem',
        fontWeight: 'bold',
        textAlign: 'center',
        marginTop: '2rem',
        marginBottom: '3rem',
        textShadow: '0 0 20px rgba(147, 197, 253, 0.5)'
      }}>
        🌌 Your Dream Constellation
      </h2>

      <div style={{
        position: 'absolute',
        top: '120px',
        left: '0',
        right: '0',
        bottom: '0',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1rem',
        padding: '2rem'
      }}>
        {dreams.map((dream, i) => {
          const angle = (i * 137.5) * (Math.PI / 180); // Golden angle for nice distribution
          const radius = 150 + (i * 30);
          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius;
          
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                borderRadius: '50%',
                border: '3px solid #60a5fa',
                padding: '1.5rem',
                fontSize: '1.5rem',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                transform: `translate(${x}px, ${y}px)`,
                backgroundColor: mapEmotionToColor(dream.emotions),
                boxShadow: '0 0 20px rgba(96, 165, 250, 0.3)',
                minWidth: '60px',
                minHeight: '60px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                left: '50%',
                top: '50%',
                marginLeft: '-30px',
                marginTop: '-30px'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = `translate(${x}px, ${y}px) scale(1.2)`;
                e.currentTarget.style.boxShadow = '0 0 30px rgba(96, 165, 250, 0.6)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = `translate(${x}px, ${y}px) scale(1)`;
                e.currentTarget.style.boxShadow = '0 0 20px rgba(96, 165, 250, 0.3)';
              }}
              title={`Dream: ${dream.symbols.join(', ')} | Emotions: ${dream.emotions.join(', ')} | Quality: ${Math.round((dream.dreamQualityScore || 0) * 100)}%`}
            >
              {getSymbolEmoji(dream.symbols[0])}
            </div>
          );
        })}
      </div>

      <div style={{
        position: 'absolute',
        bottom: '2rem',
        left: '2rem',
        right: '2rem',
        textAlign: 'center',
        fontSize: '0.875rem',
        color: '#94a3b8'
      }}>
        <p>Hover over dream symbols to see details. Each position represents the emotional resonance and symbolic depth.</p>
        <p style={{ marginTop: '0.5rem' }}>
          🌊 Peaceful • 🔥 Intense • 🌙 Mysterious • 🕊️ Liberating
        </p>
      </div>
    </div>
  );
}

export default function DreamsPage() {
  return <DreamConstellationMap />;
}