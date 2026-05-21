'use client';

import { usePathname } from 'next/navigation';
import { createContext, useContext, useMemo, type ReactNode } from 'react';
import { getSpatialRuntimeContract, type UraiSpatialMode } from '@/lib/urai-canon/spatial-runtime';
import { URAI_ROUTE_CONTRACTS, type UraiRouteId } from '@/lib/urai-canon/system';
import SpatialUniverseShell from './SpatialUniverseShell';

export type UraiQualityProfile = 'mobile-safe' | 'reduced-motion' | 'desktop-cinematic';

export type SpatialUniverseState = {
  route: UraiRouteId;
  pathname: string;
  mode: UraiSpatialMode;
  cameraPreset: string;
  canonicalScreen: string;
  primaryObject: string;
  qualityProfile: UraiQualityProfile;
  loadingState: true;
  emptyState: true;
  errorState: true;
  directLoadSafe: true;
  returnHomeHref: '/home' | null;
};

const SpatialUniverseContext = createContext<SpatialUniverseState | null>(null);

const ROUTE_PATTERNS: UraiRouteId[] = [
  '/home',
  '/life-map',
  '/life-map/star/[starId]',
  '/focus',
  '/focus/session/[sessionId]',
  '/replay',
  '/replay/[replayId]',
  '/ochat',
];

function normalizePathname(pathname: string | null): UraiRouteId {
  const current = pathname ?? '/home';
  if (current === '/' || current === '/home') return '/home';
  if (current === '/life-map') return '/life-map';
  if (current.startsWith('/life-map/star/')) return '/life-map/star/[starId]';
  if (current === '/focus') return '/focus';
  if (current.startsWith('/focus/session/')) return '/focus/session/[sessionId]';
  if (current === '/replay') return '/replay';
  if (current.startsWith('/replay/')) return '/replay/[replayId]';
  if (current === '/ochat') return '/ochat';
  return '/home';
}

function detectQualityProfile(): UraiQualityProfile {
  if (typeof window === 'undefined') return 'desktop-cinematic';
  const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
  if (reduceMotion) return 'reduced-motion';
  const coarsePointer = window.matchMedia?.('(pointer: coarse)').matches ?? false;
  const narrow = window.innerWidth < 760;
  return coarsePointer || narrow ? 'mobile-safe' : 'desktop-cinematic';
}

export function resolveSpatialUniverseState(pathname: string | null, qualityProfile: UraiQualityProfile = 'desktop-cinematic'): SpatialUniverseState {
  const route = normalizePathname(pathname);
  const runtime = getSpatialRuntimeContract(route);
  const routeContract = URAI_ROUTE_CONTRACTS[route];

  return {
    route,
    pathname: pathname ?? '/home',
    mode: runtime.stableMode,
    cameraPreset: runtime.cameraPreset,
    canonicalScreen: runtime.canonicalScreen,
    primaryObject: runtime.primaryObject,
    qualityProfile,
    loadingState: routeContract.loadingState,
    emptyState: routeContract.emptyState,
    errorState: routeContract.errorState,
    directLoadSafe: routeContract.directLoad,
    returnHomeHref: route === '/home' ? null : '/home',
  };
}

export function SpatialUniverseProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const qualityProfile = detectQualityProfile();
  const state = useMemo(() => resolveSpatialUniverseState(pathname, qualityProfile), [pathname, qualityProfile]);

  return (
    <SpatialUniverseContext.Provider value={state}>
      <div
        aria-hidden="true"
        data-urai-spatial-universe="mounted"
        data-urai-route={state.route}
        data-urai-mode={state.mode}
        data-urai-camera={state.cameraPreset}
        data-urai-quality={state.qualityProfile}
        style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }}
      />
      <SpatialUniverseShell />
      {children}
    </SpatialUniverseContext.Provider>
  );
}

export function useSpatialUniverse(): SpatialUniverseState {
  const value = useContext(SpatialUniverseContext);
  if (!value) return resolveSpatialUniverseState('/home');
  return value;
}

export const URAI_SPATIAL_ROUTE_PATTERNS = ROUTE_PATTERNS;
