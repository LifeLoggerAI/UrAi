'use client';

import { useEffect, useState } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/components/auth-provider';
import type { Dream } from '@/lib/types';

export function DreamConstellationMap() {
  const { user } = useAuth();
  const [dreams, setDreams] = useState<Dream[]>([]);

  useEffect(() => {
    if (!user) return;

    const fetchDreams = async () => {
      try {
        const q = query(collection(db, 'dreams'), where('userId', '==', user.uid));
        const snapshot = await getDocs(q);
        const all = snapshot.docs.map((d) => d.data() as Dream);
        setDreams(all);
      } catch (error) {
        console.error('Error fetching dreams:', error);
        // For demo, create some mock dreams
        setDreams([
          {
            userId: user.uid,
            symbols: ['mirror', 'ocean'],
            emotions: ['peaceful'],
            location: 'bedroom',
            dreamQualityScore: 0.8,
            createdAt: new Date().toISOString()
          },
          {
            userId: user.uid,
            symbols: ['fire', 'falling'],
            emotions: ['fear', 'anxiety'],
            location: 'unknown',
            dreamQualityScore: 0.6,
            createdAt: new Date().toISOString()
          },
          {
            userId: user.uid,
            symbols: ['moon', 'voice'],
            emotions: ['wonder', 'curiosity'],
            location: 'forest',
            dreamQualityScore: 0.9,
            createdAt: new Date().toISOString()
          }
        ]);
      }
    };

    fetchDreams();
  }, [user]);

  const mapEmotionToColor = (emotions: string[]) => {
    if (emotions.includes('fear') || emotions.includes('anxiety')) return '#4a1f1f';
    if (emotions.includes('peaceful') || emotions.includes('calm')) return '#1f4a3a';
    if (emotions.includes('wonder') || emotions.includes('curiosity')) return '#1f3a4a';
    return '#444';
  };

  return (
    <div style={{
      width: '100%',
      height: '80vh',
      position: 'relative',
      backgroundColor: '#000',
      color: '#fff',
      overflow: 'hidden'
    }}>
      <h2 style={{
        fontSize: '1.5rem',
        fontWeight: 'bold',
        textAlign: 'center',
        marginTop: '1rem',
        marginBottom: '2rem'
      }}>
        🌌 Your Dream Constellation
      </h2>

      <div style={{
        position: 'absolute',
        top: '100px',
        left: '0',
        right: '0',
        bottom: '0',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '2rem',
        padding: '2rem'
      }}>
        {dreams.map((dream, i) => (
          <div
            key={i}
            style={{
              borderRadius: '50%',
              border: '2px solid #60a5fa',
              padding: '1rem',
              fontSize: '0.875rem',
              cursor: 'pointer',
              transition: 'transform 0.2s',
              transform: `translate(${Math.sin(i) * 120}px, ${Math.cos(i) * 100}px)`,
              backgroundColor: mapEmotionToColor(dream.emotions)
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = `translate(${Math.sin(i) * 120}px, ${Math.cos(i) * 100}px) scale(1.1)`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = `translate(${Math.sin(i) * 120}px, ${Math.cos(i) * 100}px) scale(1)`;
            }}
            title={`Dream: ${dream.symbols.join(', ')} | Emotions: ${dream.emotions.join(', ')} | Quality: ${(dream.dreamQualityScore || 0) * 100}%`}
          >
            {dream.symbols[0] || 'Symbol'}
          </div>
        ))}
      </div>

      {dreams.length === 0 && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center',
          color: '#888'
        }}>
          <p>No dreams captured yet.</p>
          <p style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>
            Your constellation will grow as you log your dreams.
          </p>
        </div>
      )}
    </div>
  );
}