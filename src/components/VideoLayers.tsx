
'use client';

import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

type ManifestCategory = {
  name: string;
  videos: {
    id: string;
    variants: string[];
  }[];
};

type Manifest = {
  basePath: string;
  categories: Record<string, ManifestCategory>;
};

interface VideoLayerProps extends React.VideoHTMLAttributes<HTMLVideoElement> {
  zIndex: number;
}

function VideoLayer({ src, zIndex, className, ...props }: VideoLayerProps) {
  return (
    <video
      key={src}
      src={src}
      autoPlay
      muted
      loop
      playsInline
      className={cn(
        'absolute inset-0 w-full h-full object-cover transition-opacity duration-1000',
        className
      )}
      style={{ zIndex }}
      {...props}
    />
  );
}

export default function VideoLayers() {
  const [skyManifest, setSkyManifest] = useState<Manifest | null>(null);
  const [groundManifest, setGroundManifest] = useState<Manifest | null>(null);
  const [category, setCategory] = useState('neutral');
  const [index, setIndex] = useState(0);
  const [variant, setVariant] = useState('');

  useEffect(() => {
    fetch('/assets/sky/sky-manifest.json')
      .then(res => res.json())
      .then(data => setSkyManifest(data))
      .catch(err => console.error("Failed to load sky manifest", err));

    fetch('/assets/ground/ground-manifest.json')
      .then(res => res.json())
      .then(data => setGroundManifest(data))
      .catch(err => console.error("Failed to load ground manifest", err));
  }, []);


  const handleKeyDown = (e: KeyboardEvent) => {
      if (!skyManifest) return;
      e.preventDefault();
      
      const categoryKeys = Object.keys(skyManifest.categories);
      const currentCategoryVideos = skyManifest.categories[category].videos;
      const categoryIndex = categoryKeys.indexOf(category);

      switch (e.key) {
        case 'ArrowRight':
          setIndex(prev => (prev + 1) % currentCategoryVideos.length);
          break;
        case 'ArrowLeft':
          setIndex(prev => (prev - 1 + currentCategoryVideos.length) % currentCategoryVideos.length);
          break;
        case 'ArrowUp':
          setCategory(categoryKeys[(categoryIndex + 1) % categoryKeys.length]);
          setIndex(0);
          break;
        case 'ArrowDown':
          setCategory(categoryKeys[(categoryIndex - 1 + categoryKeys.length) % categoryKeys.length]);
          setIndex(0);
          break;
        case 'v':
          const availableVariants = ['', ...(currentCategoryVideos[index]?.variants || [])];
          const currentVariantIndex = availableVariants.indexOf(variant);
          setVariant(availableVariants[(currentVariantIndex + 1) % availableVariants.length]);
          break;
      }
    };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [skyManifest, category, index, variant]);

  if (!skyManifest || !groundManifest) {
    return (
        <div className="relative w-screen h-screen overflow-hidden bg-black flex items-center justify-center text-white">
            Loading manifests...
        </div>
    );
  }

  const getPath = (manifest: Manifest, cat: string, videoId: string, v: string) => {
    const basePath = manifest.basePath.replace(/^\/public/, "");
    const videoFileName = `${manifest.categories[cat].name}-${videoId}${v}.mp4`;
    return `${basePath}/${cat}/${videoFileName}`;
  };

  const categoryKeys = Object.keys(skyManifest.categories);
  const currentCategoryVideos = skyManifest.categories[category].videos;
  const currentVideo = currentCategoryVideos[index];

  const currentSky = getPath(skyManifest, category, currentVideo.id, variant);
  const currentGround = getPath(groundManifest, category, currentVideo.id, variant);

  const AVATAR_SRC = '/videos/avatar-01.mp4';
  const ORB_SRC = '/videos/orb-01.mp4';

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-black">
      <VideoLayer src={currentSky} zIndex={10} />
      <VideoLayer src={currentGround} zIndex={15} />
      <VideoLayer
        src={AVATAR_SRC}
        zIndex={20}
        className="object-contain pointer-events-none"
      />
      <VideoLayer
        src={ORB_SRC}
        zIndex={30}
        className="absolute bottom-[700px] left-1/2 -translate-x-1/2 w-[512px] h-[512px] object-contain pointer-events-none"
      />

      <div className="absolute bottom-4 left-4 z-50 bg-black/50 text-white p-3 rounded-lg text-xs font-mono">
        <p>Category: {category} ({categoryKeys.indexOf(category) + 1}/{categoryKeys.length})</p>
        <p>Index: {index + 1}/{currentCategoryVideos.length}</p>
        <p>Variant: {variant || 'base'}</p>
        <p className="mt-2 text-muted-foreground">Use Arrow keys to navigate, 'v' to change variant.</p>
      </div>
    </div>
  );
}
