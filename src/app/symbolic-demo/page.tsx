'use client';

import { useState, useEffect } from 'react';
import { DreamConstellationMap } from '../symbolic-map';
import { ThresholdBanner } from '@/components/threshold-banner';
import { BloomVisualizer } from '@/components/bloom-visualizer';
import { SoulThreadCard } from '@/components/soul-thread-card';
import { ShadowStatsMini } from '@/components/shadow-stats-mini';
import type { CrisisState, RecoveryBloom, SoulThread } from '@/lib/types';

// Mock data for demo
const mockCrisisState: CrisisState = {
  userId: 'demo-user',
  isInCrisis: false,
  triggeredAt: new Date().toISOString(),
  triggerReason: 'Stable',
  score: 0.34,
  suggestedRitual: 'Reflection'
};

const mockRecoveryBloom: RecoveryBloom = {
  userId: 'demo-user',
  triggerEventId: 'event-123',
  bloomColor: 'lavender-glow',
  auraVisual: 'rising-petals',
  recoveryDuration: 7,
  moodBefore: 'grief',
  moodAfter: 'acceptance',
  createdAt: new Date().toISOString()
};

const mockSoulThreads: SoulThread[] = [
  {
    userId: 'demo-user',
    threadLabel: 'The Healer\'s Wound',
    events: ['event1', 'event2'],
    coreSymbol: 'mirror',
    dominantArchetype: 'Healer',
    status: 'resolving',
    rebirthCount: 3,
    createdAt: new Date().toISOString()
  },
  {
    userId: 'demo-user',
    threadLabel: 'The Depth of Self',
    events: ['event3'],
    coreSymbol: 'ocean',
    dominantArchetype: 'Explorer',
    status: 'open',
    rebirthCount: 1,
    createdAt: new Date().toISOString()
  }
];

export default function SymbolicSystemsDemo() {
  const [activeTab, setActiveTab] = useState('constellation');
  const [entropyLevel, setEntropyLevel] = useState(0.34);

  useEffect(() => {
    // Simulate changing entropy level
    const interval = setInterval(() => {
      setEntropyLevel(prev => Math.max(0, Math.min(1, prev + (Math.random() - 0.5) * 0.1)));
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a3a 50%, #2a2a5a 100%)',
      color: 'white',
      fontFamily: 'system-ui, sans-serif'
    }}>
      <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
        <h1 style={{ 
          fontSize: '3rem', 
          fontWeight: 'bold', 
          textAlign: 'center', 
          marginBottom: '1rem',
          textShadow: '0 0 20px rgba(147, 197, 253, 0.5)'
        }}>
          🌌 UrAi Symbolic Systems
        </h1>
        
        <p style={{ 
          textAlign: 'center', 
          color: '#94a3b8', 
          marginBottom: '2rem',
          fontSize: '1.1rem'
        }}>
          Advanced emotional intelligence and symbolic pattern recognition
        </p>

        {/* System Status */}
        <div style={{ marginBottom: '2rem' }}>
          <ThresholdBanner crisis={mockCrisisState} />
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginTop: '1rem'
          }}>
            <ShadowStatsMini entropyLevel={entropyLevel} />
            <div style={{ fontSize: '0.875rem', color: '#94a3b8' }}>
              Systems active • Monitoring patterns • Learning preferences
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div style={{ 
          display: 'flex', 
          gap: '1rem', 
          marginBottom: '2rem', 
          justifyContent: 'center',
          flexWrap: 'wrap'
        }}>
          {[
            { id: 'constellation', label: '🌌 Dream Constellation', desc: 'Visual dream mapping' },
            { id: 'bloom', label: '🌸 Recovery Bloom', desc: 'Growth visualization' },
            { id: 'threads', label: '🧬 Soul Threads', desc: 'Life patterns' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '1rem 1.5rem',
                background: activeTab === tab.id ? 'rgba(96, 165, 250, 0.2)' : 'rgba(30, 41, 59, 0.4)',
                border: `2px solid ${activeTab === tab.id ? '#60a5fa' : '#475569'}`,
                borderRadius: '0.5rem',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                color: activeTab === tab.id ? '#60a5fa' : '#cbd5e1',
                fontSize: '1rem',
                textAlign: 'center'
              }}
            >
              <div style={{ fontWeight: 'bold' }}>{tab.label}</div>
              <div style={{ fontSize: '0.75rem', opacity: 0.8 }}>{tab.desc}</div>
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div style={{ 
          minHeight: '500px',
          background: 'rgba(15, 23, 42, 0.3)',
          borderRadius: '1rem',
          border: '2px solid #475569',
          overflow: 'hidden'
        }}>
          {activeTab === 'constellation' && (
            <div>
              <DreamConstellationMap />
            </div>
          )}

          {activeTab === 'bloom' && (
            <div style={{ padding: '2rem', textAlign: 'center' }}>
              <h3 style={{ fontSize: '2rem', marginBottom: '2rem', color: '#60a5fa' }}>
                Recovery Bloom Visualization
              </h3>
              <BloomVisualizer bloom={mockRecoveryBloom} />
              <div style={{ marginTop: '2rem', color: '#94a3b8' }}>
                <p>Recovery blooms appear when the system detects emotional healing and growth.</p>
                <p>Each bloom represents a transformation from challenge to wisdom.</p>
              </div>
            </div>
          )}

          {activeTab === 'threads' && (
            <div style={{ padding: '2rem' }}>
              <h3 style={{ fontSize: '2rem', marginBottom: '2rem', color: '#60a5fa', textAlign: 'center' }}>
                Soul Thread Patterns
              </h3>
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
                gap: '1.5rem' 
              }}>
                {mockSoulThreads.map((thread, index) => (
                  <SoulThreadCard key={index} thread={thread} />
                ))}
              </div>
              <div style={{ marginTop: '2rem', textAlign: 'center', color: '#94a3b8' }}>
                <p>Soul threads track recurring symbolic patterns across your life journey.</p>
                <p>Each thread represents a core theme that evolves through multiple cycles of growth.</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer Info */}
        <div style={{ 
          marginTop: '2rem', 
          textAlign: 'center', 
          color: '#64748b', 
          fontSize: '0.875rem'
        }}>
          <p>
            All systems work together to provide deep insights into your emotional and symbolic patterns.
            The AI continuously learns from your interactions to provide more personalized guidance.
          </p>
        </div>
      </div>
    </div>
  );
}