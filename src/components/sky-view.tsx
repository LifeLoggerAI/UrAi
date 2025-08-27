
'use client';

import { useState, useEffect } from 'react';
import { VideoLayer } from './VideoLayer';
import { SkyViewControls } from './sky-view-controls';
import type { VoiceEvent, InnerVoiceReflection } from '@/lib/types';
import { useVideoPreloader } from '@/lib/useVideoPreloader';

type Category =
  | 'neutral'
  | 'growth'
  | 'fracture'
  | 'healing'
  | 'cosmic'
  | 'bloom'
  | 'shadow'
  | 'energy'
  | 'seasonal';

type Variant = 'a' | 'b' | 'c' | undefined;

interface SkyViewProps {
  voiceEvents: VoiceEvent[];
  innerTexts: InnerVoiceReflection[];
}

const CATEGORIES: Category[] = [
  'neutral', 'growth', 'fracture', 'healing', 'cosmic', 'bloom', 'shadow', 'energy', 'seasonal'
];

export function SkyView({ voiceEvents, innerTexts }: SkyViewProps) {
  const [skyManifest, setSkyManifest] = useState<any | null>(null);
  const [groundManifest, setGroundManifest] = useState<any | null>(null);
  const { enqueue: preloadVideo } = useVideoPreloader(2);

  const [skyCategory, setSkyCategory] = useState<Category>('neutral');
  const [groundCategory, setGroundCategory] = useState<Category>('neutral');
  const [skyIndex, setSkyIndex] = useState(1);
  const [groundIndex, setGroundIndex] = useState(1);
  const [skyVariant, setSkyVariant] = useState<Variant>(undefined);
  const [groundVariant, setGroundVariant] = useState<Variant>(undefined);
  const [skySrc, setSkySrc] = useState('');
  const [groundSrc, setGroundSrc] = useState('');
  const [persona, setPersona] = useState('gentle');
  
  useEffect(() => {
    fetch('/assets/sky/sky-manifest.json')
      .then(res => res.json())
      .then(data => setSkyManifest(data));
    fetch('/assets/ground/ground-manifest.json')
      .then(res => res.json())
      .then(data => setGroundManifest(data));
  }, []);

  // Effect to derive scene from user data
  useEffect(() => {
    const allMemories = [
      ...(voiceEvents || []).map(e => ({ ...e, type: 'voice' })),
      ...(innerTexts || []).map(e => ({ ...e, type: 'text' })),
    ].sort((a, b) => b.createdAt - a.createdAt);

    if (allMemories.length > 0) {
      const latestMemory = allMemories[0];
      const sentiment = latestMemory.sentimentScore;
      
      let derivedCategory: Category = 'neutral';
      if (sentiment > 0.4) {
        derivedCategory = 'growth';
      } else if (sentiment > 0.1) {
        derivedCategory = 'bloom';
      } else if (sentiment < -0.4) {
        derivedCategory = 'fracture';
      } else if (sentiment < -0.1) {
        derivedCategory = 'shadow';
      }
      
      setSkyCategory(derivedCategory);
      setGroundCategory(derivedCategory);
      // Pick a random video index within that category to keep it fresh
      setSkyIndex(Math.floor(Math.random() * 20) + 1);
      setGroundIndex(Math.floor(Math.random() * 20) + 1);
    }
  }, [voiceEvents, innerTexts]);

  const getPath = (manifest: any, cat: string, videoId: string, v: string | undefined) => {
    if (!manifest || !manifest.categories[cat]) return '';
    const basePath = (manifest.basePath || '').replace(/^\/public/, '');
    const videoFileName = `${manifest.name}-${cat}-${videoId}${v || ''}.mp4`;
    return `${basePath}/${cat}/${videoFileName}`;
  };

  useEffect(() => {
    if (skyManifest) {
      const videoId = String(skyIndex).padStart(2, '0');
      const path = getPath(skyManifest, skyCategory, videoId, skyVariant);
      setSkySrc(path);
      
      // Preload next
      const nextIndex = skyIndex === 20 ? 1 : skyIndex + 1;
      const nextVideoId = String(nextIndex).padStart(2, '0');
      const nextPath = getPath(skyManifest, skyCategory, nextVideoId, skyVariant);
      if (nextPath) preloadVideo(nextPath);
    }
  }, [skyManifest, skyCategory, skyIndex, skyVariant, preloadVideo]);

  useEffect(() => {
    if (groundManifest) {
      const videoId = String(groundIndex).padStart(2, '0');
      const path = getPath(groundManifest, groundCategory, videoId, groundVariant);
      setGroundSrc(path);

      // Preload next
      const nextIndex = groundIndex === 20 ? 1 : groundIndex + 1;
      const nextVideoId = String(nextIndex).padStart(2, '0');
      const nextPath = getPath(groundManifest, groundCategory, nextVideoId, groundVariant);
      if(nextPath) preloadVideo(nextPath);
    }
  }, [groundManifest, groundCategory, groundIndex, groundVariant, preloadVideo]);


  if (!skyManifest || !groundManifest) {
    return <div>Loading scenes...</div>;
  }

  return (
    <div className="w-full h-full rounded-2xl overflow-hidden relative shadow-lg">
      <VideoLayer src={skySrc} zIndex={10} />
      <VideoLayer src={groundSrc} zIndex={15} />
      <SkyViewControls
        state={{
          skyCategory,
          groundCategory,
          skyIndex,
          groundIndex,
          skyVariant,
          groundVariant,
          persona,
        }}
        setters={{
          setSkyCategory,
          setGroundCategory,
          setSkyIndex,
          setGroundIndex,
          setSkyVariant,
          setGroundVariant,
          setPersona,
        }}
        categories={CATEGORIES}
      />
    </div>
  );
}
