'use client';

import { useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Points } from '@react-three/drei';
import type { MemoryCategory } from '@/components/urai/data/emotionPalette';
import { emotionPalette } from '@/components/urai/data/emotionPalette';
import type { MemoryStar as MemoryStarData } from '@/components/urai/data/memoryStars';

const vertexShader = `
  attribute vec3 color;
  attribute float size;
  attribute float importance;
  varying vec3 vColor;
  varying float vImportance;

  void main() {
    vColor = color;
    vImportance = importance;
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    float depthScale = clamp(360.0 / max(60.0, -mvPosition.z), 0.68, 3.4);
    gl_PointSize = size * depthScale;
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const fragmentShader = `
  varying vec3 vColor;
  varying float vImportance;
  uniform float time;

  void main() {
    float d = distance(gl_PointCoord, vec2(0.5, 0.5));
    if (d > 0.5) discard;

    float core = smoothstep(0.18, 0.0, d);
    float halo = smoothstep(0.5, 0.12, d) * 0.42;
    float ring = smoothstep(0.34, 0.30, d) * smoothstep(0.21, 0.27, d) * 0.34;
    float pulse = 0.78 + 0.22 * sin(time * (1.15 + vImportance * 0.38) + vImportance * 4.0);
    float alpha = clamp((core + halo + ring) * pulse, 0.0, 1.0);

    vec3 hotCore = mix(vColor, vec3(1.0), 0.72);
    vec3 finalColor = mix(vColor, hotCore, core + ring * 0.4);
    gl_FragColor = vec4(finalColor, alpha);
  }
`;

const categoryBoosts: Partial<Record<MemoryCategory, number>> = {
  threshold: 1.3,
  relationship: 1.18,
};

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
    const importance = new Float32Array(stars.length);

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
      const isRelated = relatedIds.has(star.id);
      const dimmed = selectedActive && !isRelated && !isSelected;
      const depthBoost = Math.max(0.8, 1.45 - Math.abs(star.z) / 860);
      const categoryBoost = categoryBoosts[star.category] ?? 1;
      const selectedBoost = isSelected ? 4.6 : isRelated ? 2.25 : 1;

      importance[i] = isSelected ? 3 : isRelated ? 2 : categoryBoost;

      if (filteredOut) {
        sizes[i] = 1.6;
      } else if (dimmed) {
        sizes[i] = 4.8 * depthBoost;
      } else {
        sizes[i] = 12.5 * depthBoost * categoryBoost * selectedBoost;
      }
    });

    return { positions, colors, sizes, importance };
  }, [stars, selectedId, selectedActive, relatedIds, activeCategory]);

  return (
    <Points positions={starData.positions} stride={3} onClick={(e: any) => onSelect(stars[e.index].id)} frustumCulled={false}>
      <shaderMaterial vertexShader={vertexShader} fragmentShader={fragmentShader} uniforms={uniforms} transparent depthWrite={false} blending={THREE.AdditiveBlending}>
        <bufferAttribute attach="attributes-color" args={[starData.colors, 3]} />
        <bufferAttribute attach="attributes-size" args={[starData.sizes, 1]} />
        <bufferAttribute attach="attributes-importance" args={[starData.importance, 1]} />
      </shaderMaterial>
    </Points>
  );
}
