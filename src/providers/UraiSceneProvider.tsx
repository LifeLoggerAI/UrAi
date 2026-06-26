'use client';

import { createContext, useContext, useState } from 'react';
import type { UraiScene } from '@/lib/urai/scene-theme';

type UraiSceneContextType = {
  scene: UraiScene;
  onNavigate: (scene: UraiScene) => void;
};

const UraiSceneContext = createContext<UraiSceneContextType | undefined>(
  undefined,
);

export function UraiSceneProvider({ children }: { children: React.ReactNode }) {
  const [scene, setScene] = useState<UraiScene>('home');

  const onNavigate = (newScene: UraiScene) => {
    setScene(newScene);
  };

  return (
    <UraiSceneContext.Provider value={{ scene, onNavigate }}>
      {children}
    </UraiSceneContext.Provider>
  );
}

export function useUraiScene() {
  const context = useContext(UraiSceneContext);
  if (context === undefined) {
    throw new Error('useUraiScene must be used within a UraiSceneProvider');
  }
  return context;
}
