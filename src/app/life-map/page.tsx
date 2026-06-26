'use client';

import { Canvas } from '@react-three/fiber';
import { useMemo, useState } from 'react';
import { memoryStars, memoryThreads } from '@/components/urai/data/memoryStars';
import type { MemoryCategory } from '@/components/urai/data/emotionPalette';
import { useGalaxyCamera } from '@/components/urai/hooks/useGalaxyCamera';
import { useReducedMotionSafe } from '@/components/urai/hooks/useReducedMotionSafe';
import { useStarSelection } from '@/components/urai/hooks/useStarSelection';
import ImmersiveWorld3D from '@/components/urai/world/ImmersiveWorld3D';
import { ConstellationThreadLayer } from '@/components/urai/life-map/ConstellationThreadLayer';
import { GalaxyBackground } from '@/components/urai/life-map/GalaxyBackground';
import { GalaxyCamera } from '@/components/urai/life-map/GalaxyCamera';
import { GalaxyHUD } from '@/components/urai/life-map/GalaxyHUD';
import { MemoryStarLayer } from '@/components/urai/life-map/MemoryStarLayer';
import { NebulaZones } from '@/components/urai/life-map/NebulaZones';
import { OrbitRings } from '@/components/urai/life-map/OrbitRings';
import { SelectedStarPortal } from '@/components/urai/life-map/SelectedStarPortal';
import { MapControls } from '@react-three/drei';

export default function LifeMapPage() {
  const [activeCategory, setActiveCategory] = useState<MemoryCategory | 'all'>('all');
  const [mode, setMode] = useState<'default' | 'replay' | 'mirror'>('default');
  const { camera, dragging, zoomByDelta, recenter, focusCameraOn, onPointerDown, onPointerMove, stopDrag } = useGalaxyCamera();
  const { selectedId, selected, relatedIds, selectStar, clearSelection } = useStarSelection(memoryStars, 'blue-fog-memory');

  const replay = () => {
    setMode('replay');
    let index = 0;
    const sequence = ['blue-fog-memory', 'threshold-flare', 'mirror-line', 'protected-hour', 'morning-return'];
    const timer = window.setInterval(() => {
      const star = memoryStars.find((item) => item.id === sequence[index % sequence.length]);
      if (star) {
        selectStar(star.id);
        focusCameraOn(star, 1.28);
      }
      index += 1;
      if (index > sequence.length) {
        window.clearInterval(timer);
        setMode('default');
      }
    }, 960);
  };

  const toggleMirror = () => setMode((current) => (current === 'mirror' ? 'default' : 'mirror'));

  return (
    <main className={`urai-screen urai-life-map-screen ${mode === 'mirror' ? 'is-mirror-mode' : ''} ${selected ? 'has-selected-star' : ''}`}>
      <ImmersiveWorld3D
        mode="life-map"
        activeLabel={activeCategory === 'all' ? `All fields · ${mode}` : `${activeCategory} · ${mode}`}
        selectedLabel={selected?.title}
      />
      <GalaxyBackground />
      <header className="urai-life-title">
        <span>URAI LIFE MAP</span>
        <strong>Memory Galaxy</strong>
        <em>
          {memoryStars.length} Memory Stars · {memoryThreads.length} Timeline Constellations · {mode}
        </em>
      </header>
      <GalaxyCamera camera={camera} dragging={dragging}>
        <Canvas>
          <MemoryStarLayer
            stars={memoryStars}
            selectedId={selectedId}
            selectedActive={Boolean(selected)}
            relatedIds={relatedIds}
            activeCategory={activeCategory}
            onSelect={selectStar}
          />
          <ConstellationThreadLayer stars={memoryStars} threads={memoryThreads} relatedIds={relatedIds} hasSelection={Boolean(selected)} />
          <NebulaZones activeCategory={activeCategory} />
          <OrbitRings mirrorMode={mode === 'mirror'} />
          <MapControls />
        </Canvas>
      </GalaxyCamera>
      <GalaxyHUD
        selected={selected}
        camera={camera}
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
        onCloseLine={clearSelection}
        onReplay={replay}
        onReflect={toggleMirror}
        onCenter={recenter}
      />
      <SelectedStarPortal selected={selected} mode={mode} onClose={clearSelection} onReplay={replay} onToggleMirror={toggleMirror} />
    </main>
  );
}
