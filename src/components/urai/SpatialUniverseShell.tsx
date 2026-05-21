'use client';

import { useSpatialUniverse, type SpatialUniverseState } from './SpatialUniverseProvider';

export type SpatialUniverseShellModel = {
  label: string;
  ariaLabel: string;
  route: SpatialUniverseState['route'];
  mode: SpatialUniverseState['mode'];
  qualityProfile: SpatialUniverseState['qualityProfile'];
  cameraPreset: string;
  primaryObject: string;
  reducedMotion: boolean;
  mobileSafe: boolean;
  returnHomeHref: '/home' | null;
};

export function resolveSpatialUniverseShellModel(state: SpatialUniverseState): SpatialUniverseShellModel {
  const reducedMotion = state.qualityProfile === 'reduced-motion';
  const mobileSafe = state.qualityProfile === 'mobile-safe' || reducedMotion;
  return {
    label: `${state.canonicalScreen} · ${state.mode} · ${state.primaryObject}`,
    ariaLabel: `URAI spatial universe shell: ${state.canonicalScreen} in ${state.qualityProfile} mode`,
    route: state.route,
    mode: state.mode,
    qualityProfile: state.qualityProfile,
    cameraPreset: state.cameraPreset,
    primaryObject: state.primaryObject,
    reducedMotion,
    mobileSafe,
    returnHomeHref: state.returnHomeHref,
  };
}

export default function SpatialUniverseShell() {
  const state = useSpatialUniverse();
  const model = resolveSpatialUniverseShellModel(state);

  return (
    <aside
      aria-label={model.ariaLabel}
      data-urai-spatial-shell="mounted"
      data-urai-shell-route={model.route}
      data-urai-shell-mode={model.mode}
      data-urai-shell-quality={model.qualityProfile}
      data-urai-shell-camera={model.cameraPreset}
      data-urai-shell-primary-object={model.primaryObject}
      data-urai-shell-reduced-motion={String(model.reducedMotion)}
      data-urai-shell-mobile-safe={String(model.mobileSafe)}
      style={{
        position: 'fixed',
        right: 12,
        bottom: 12,
        zIndex: 2147483000,
        maxWidth: 280,
        border: '1px solid rgba(255,255,255,.16)',
        borderRadius: 16,
        padding: '10px 12px',
        color: 'rgba(255,255,255,.82)',
        background: 'rgba(4,8,18,.58)',
        backdropFilter: 'blur(10px)',
        pointerEvents: 'none',
        fontSize: 12,
        lineHeight: 1.35,
      }}
    >
      <div>Spatial Universe</div>
      <div>{model.label}</div>
      {model.returnHomeHref ? <div>Return: {model.returnHomeHref}</div> : null}
    </aside>
  );
}
