'use client';

import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Point, Points } from '@react-three/drei';
import type { MemoryCategory } from '@/components/urai/data/emotionPalette';
import { emotionPalette } from '@/components/urai/data/emotionPalette';
import type { MemoryStar as MemoryStarData } from '@/components/urai/data/memoryStars';

const vertexShader = `
  attribute vec3 color;
  attribute float size;
  varying vec3 vColor;
  void main() {
    vColor = color;
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = size * (300.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const fragmentShader = `
  varying vec3 vColor;
  uniform float time;
  void main() {
    float d = distance(gl_PointCoord, vec2(0.5, 0.5));
    if (d > 0.5) discard;
    float alpha = 1.0 - d * 2.0;
    alpha *= 0.5 + 0.5 * sin(time * 2.0);
    gl_FragColor = vec4(vColor, alpha);
  }
`;

export function MemoryStarLayer({
  stars,
  selectedId,
  selectedActive,
  relatedIds,
  activeCategory,
  onSelect,
}: {
  stars: MemoryStarData[];
  selectedId: string | null;
  selectedActive: boolean;
  relatedIds: Set<string>;
  activeCategory: MemoryCategory | 'all';
  onSelect: (id: string) => void;
}) {
  const uniforms = useMemo(() => ({ time: { value: 0 } }), []);
  useFrame(({ clock }) => {
    uniforms.time.value = clock.getElapsedTime();
  });

  const starData = useMemo(() => {
    const positions = new Float32Array(stars.length * 3);
    const colors = new Float32Array(stars.length * 3);
    const sizes = new Float32Array(stars.length);

    stars.forEach((star, i) => {
      positions[i * 3] = star.x;
      positions[i * 3 + 1] = star.y;
      positions[i * 3 + 2] = star.z;

      const color = new THREE.Color(emotionPalette[star.category]?.core || '#ffffff');
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;

      const isSelected = star.id === selectedId;
      const filteredOut = activeCategory !== 'all' && star.category !== activeCategory;
      const dimmed = selectedActive && !relatedIds.has(star.id);

      if (filteredOut) {
        sizes[i] = 0.1;
      } else if (isSelected) {
        sizes[i] = 2.0;
      } else if (dimmed) {
        sizes[i] = 0.3;
      } else {
        sizes[i] = 1.0;
      }
    });

    return { positions, colors, sizes };
  }, [stars, selectedId, selectedActive, relatedIds, activeCategory]);

  return (
    <Points positions={starData.positions} stride={3} onClick={(e: any) => onSelect(stars[e.index].id)} frustumCulled={false}>
      <shaderMaterial vertexShader={vertexShader} fragmentShader={fragmentShader} uniforms={uniforms} transparent>
        <bufferAttribute attach="attributes-color" args={[starData.colors, 3]} />
        <bufferAttribute attach="attributes-size" args={[starData.sizes, 1]} />
      </shaderMaterial>
    </Points>
  );
}
