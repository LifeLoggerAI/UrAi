'use client';

import { useSpatialUniverse, type SpatialUniverseState } from './SpatialUniverseProvider';
import { URAI_CAMERA_PRESETS } from '@/lib/urai-canon/spatial-runtime';

export type SpatialUniverseCanvasModel = {
  route: SpatialUniverseState['route'];
  mode: SpatialUniverseState['mode'];
  cameraPreset: string;
  qualityProfile: SpatialUniverseState['qualityProfile'];
  reducedMotion: boolean;
  mobileSafe: boolean;
  layerBudget: 'minimal' | 'balanced' | 'cinematic';
  visualState: 'static-safe' | 'mobile-safe' | 'cinematic-ready';
  cameraPosition: readonly [number, number, number];
  cameraTarget: readonly [number, number, number];
  fov: number;
  loadingEmptyErrorHandled: true;
};

export function resolveSpatialUniverseCanvasModel(state: SpatialUniverseState): SpatialUniverseCanvasModel {
  const preset = URAI_CAMERA_PRESETS[state.cameraPreset as keyof typeof URAI_CAMERA_PRESETS] ?? URAI_CAMERA_PRESETS.home;
  const reducedMotion = state.qualityProfile === 'reduced-motion';
  const mobileSafe = state.qualityProfile === 'mobile-safe' || reducedMotion;
  const layerBudget = reducedMotion ? 'minimal' : mobileSafe ? 'balanced' : 'cinematic';
  const visualState = reducedMotion ? 'static-safe' : mobileSafe ? 'mobile-safe' : 'cinematic-ready';

  return {
    route: state.route,
    mode: state.mode,
    cameraPreset: state.cameraPreset,
    qualityProfile: state.qualityProfile,
    reducedMotion,
    mobileSafe,
    layerBudget,
    visualState,
    cameraPosition: preset.position,
    cameraTarget: preset.target,
    fov: preset.fov,
    loadingEmptyErrorHandled: true,
  };
}

export default function SpatialUniverseCanvas() {
  const state = useSpatialUniverse();
  const model = resolveSpatialUniverseCanvasModel(state);

  return (
    <div
      aria-hidden="true"
      data-urai-spatial-canvas="mounted"
      data-urai-canvas-route={model.route}
      data-urai-canvas-mode={model.mode}
      data-urai-canvas-camera={model.cameraPreset}
      data-urai-canvas-quality={model.qualityProfile}
      data-urai-canvas-budget={model.layerBudget}
      data-urai-canvas-state={model.visualState}
      data-urai-canvas-reduced-motion={String(model.reducedMotion)}
      data-urai-canvas-mobile-safe={String(model.mobileSafe)}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
        background:
          model.visualState === 'cinematic-ready'
            ? 'radial-gradient(circle at 50% 58%, rgba(159,231,255,.14), transparent 32%), linear-gradient(180deg, #050814 0%, #070B18 58%, #05070C 100%)'
            : 'linear-gradient(180deg, #050814 0%, #070B18 60%, #05070C 100%)',
      }}
    >
      <div
        data-urai-canvas-orb="world-anchor"
        style={{
          position: 'absolute',
          left: '50%',
          top: model.route === '/life-map' ? '34%' : '54%',
          width: model.mobileSafe ? 116 : 168,
          height: model.mobileSafe ? 116 : 168,
          transform: 'translate(-50%, -50%)',
          borderRadius: 999,
          border: '1px solid rgba(200,211,232,.32)',
          boxShadow: model.reducedMotion ? '0 0 24px rgba(159,231,255,.18)' : '0 0 64px rgba(159,231,255,.28)',
          background: 'radial-gradient(circle, rgba(242,223,167,.54), rgba(159,231,255,.14) 45%, rgba(7,11,24,.12) 72%)',
        }}
      />
    </div>
  );
}
