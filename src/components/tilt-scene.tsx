'use client';

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { cn } from '@/lib/utils';

// Types
type ViewMode = 'sky' | 'horizon' | 'ground';
type Category = 'neutral' | 'growth' | 'fracture' | 'healing' | 'cosmic' | 'bloom' | 'shadow' | 'energy' | 'seasonal';
type Variant = 'a' | 'b' | 'c' | undefined;

interface TiltSceneProps {
  skyCategory?: Category;
  groundCategory?: Category;
  skyIndex?: number;
  groundIndex?: number;
  skyVariant?: Variant;
  groundVariant?: Variant;
  persona?: string;
  className?: string;
  onModeChange?: (mode: ViewMode) => void;
  enableBatteryOptimization?: boolean;
  enablePerformanceOptimization?: boolean;
}

interface DeviceOrientation {
  beta: number;  // X-axis rotation (-180 to 180)
  gamma: number; // Y-axis rotation (-90 to 90)
  alpha: number; // Z-axis rotation (0 to 360)
}

interface SceneAssets {
  skySrc: string;
  groundSrc: string;
  starfieldSrc: string;
}

// Tilt thresholds for mode switching
const TILT_THRESHOLDS = {
  SKY_ANGLE: -30,     // Look up significantly to show sky
  GROUND_ANGLE: 30,   // Look down significantly to show ground
  HORIZON_RANGE: 15,  // Within this range shows horizon mode
};

// Performance optimization settings
const PERFORMANCE_CONFIG = {
  ORIENTATION_THROTTLE_MS: 100,
  LOW_BATTERY_THRESHOLD: 0.2,
  REDUCED_QUALITY_THRESHOLD: 0.15,
};

export function TiltScene({
  skyCategory = 'neutral',
  groundCategory = 'neutral',
  skyIndex = 1,
  groundIndex = 1,
  skyVariant = 'a',
  groundVariant = 'a',
  persona = 'gentle',
  className,
  onModeChange,
  enableBatteryOptimization = true,
  enablePerformanceOptimization = true,
}: TiltSceneProps) {
  // State
  const [currentMode, setCurrentMode] = useState<ViewMode>('horizon');
  const [orientation, setOrientation] = useState<DeviceOrientation>({ beta: 0, gamma: 0, alpha: 0 });
  const [sceneAssets, setSceneAssets] = useState<SceneAssets>({
    skySrc: '',
    groundSrc: '',
    starfieldSrc: '/assets/starfield/starfield-01.jpg', // Default starfield
  });
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [batteryLevel, setBatteryLevel] = useState<number>(1);
  const [isLowPower, setIsLowPower] = useState(false);
  const [skyManifest, setSkyManifest] = useState<any>(null);
  const [groundManifest, setGroundManifest] = useState<any>(null);
  const [starfieldError, setStarfieldError] = useState(false);

  // Refs
  const orientationTimeoutRef = useRef<NodeJS.Timeout>();
  const lastOrientationRef = useRef<DeviceOrientation>({ beta: 0, gamma: 0, alpha: 0 });

  // Load manifests
  useEffect(() => {
    const loadManifests = async () => {
      try {
        const [skyResponse, groundResponse] = await Promise.all([
          fetch('/assets/sky/sky-manifest.json'),
          fetch('/assets/ground/ground-manifest.json'),
        ]);
        
        const [skyData, groundData] = await Promise.all([
          skyResponse.json(),
          groundResponse.json(),
        ]);
        
        setSkyManifest(skyData);
        setGroundManifest(groundData);
      } catch (error) {
        console.error('Failed to load manifests:', error);
      }
    };

    loadManifests();
  }, []);

  // Battery monitoring
  useEffect(() => {
    if (!enableBatteryOptimization || typeof navigator === 'undefined' || !('getBattery' in navigator)) {
      return;
    }

    const updateBattery = async () => {
      try {
        // @ts-ignore - Battery API is experimental
        const battery = await navigator.getBattery();
        setBatteryLevel(battery.level);
        setIsLowPower(battery.level < PERFORMANCE_CONFIG.LOW_BATTERY_THRESHOLD);
        
        battery.addEventListener('levelchange', () => {
          setBatteryLevel(battery.level);
          setIsLowPower(battery.level < PERFORMANCE_CONFIG.LOW_BATTERY_THRESHOLD);
        });
      } catch (error) {
        console.warn('Battery API not supported:', error);
      }
    };

    updateBattery();
  }, [enableBatteryOptimization]);

  // Device orientation handling
  const handleOrientationChange = useCallback((event: DeviceOrientationEvent) => {
    if (!event.beta && !event.gamma) return;

    const newOrientation: DeviceOrientation = {
      beta: event.beta || 0,
      gamma: event.gamma || 0,
      alpha: event.alpha || 0,
    };

    // Throttle orientation updates for performance
    if (orientationTimeoutRef.current) {
      clearTimeout(orientationTimeoutRef.current);
    }

    orientationTimeoutRef.current = setTimeout(() => {
      setOrientation(newOrientation);
      lastOrientationRef.current = newOrientation;
    }, enablePerformanceOptimization ? PERFORMANCE_CONFIG.ORIENTATION_THROTTLE_MS : 0);
  }, [enablePerformanceOptimization]);

  // Request device orientation permission (iOS 13+)
  const requestOrientationPermission = useCallback(async () => {
    if (typeof DeviceOrientationEvent !== 'undefined' && 'requestPermission' in DeviceOrientationEvent) {
      try {
        // @ts-ignore - iOS specific API
        const permission = await DeviceOrientationEvent.requestPermission();
        return permission === 'granted';
      } catch (error) {
        console.warn('Failed to request orientation permission:', error);
        return false;
      }
    }
    return true; // Assume granted on other platforms
  }, []);

  // Set up device orientation listener
  useEffect(() => {
    const setupOrientation = async () => {
      const hasPermission = await requestOrientationPermission();
      if (hasPermission) {
        window.addEventListener('deviceorientation', handleOrientationChange);
      }
    };

    setupOrientation();

    return () => {
      window.removeEventListener('deviceorientation', handleOrientationChange);
      if (orientationTimeoutRef.current) {
        clearTimeout(orientationTimeoutRef.current);
      }
    };
  }, [handleOrientationChange, requestOrientationPermission]);

  // Determine view mode based on orientation
  const viewMode = useMemo((): ViewMode => {
    const { beta } = orientation;
    
    if (beta <= TILT_THRESHOLDS.SKY_ANGLE) {
      return 'sky';
    } else if (beta >= TILT_THRESHOLDS.GROUND_ANGLE) {
      return 'ground';
    } else {
      return 'horizon';
    }
  }, [orientation]);

  // Update current mode with transition
  useEffect(() => {
    if (viewMode !== currentMode) {
      setIsTransitioning(true);
      setCurrentMode(viewMode);
      onModeChange?.(viewMode);
      
      // Reset transition state after animation
      const timer = setTimeout(() => setIsTransitioning(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [viewMode, currentMode, onModeChange]);

  // Asset path helper
  const getAssetPath = useCallback((manifest: any, category: string, index: number, variant: string | undefined, type: 'sky' | 'ground') => {
    if (!manifest) return '';
    
    const basePath = manifest.basePath.replace(/^\/public/, '');
    const categoryData = manifest.categories[category];
    if (!categoryData) return '';
    
    const videoId = String(index).padStart(2, '0');
    const videoFileName = `${categoryData.name}-${videoId}${variant || ''}.mp4`;
    return `${basePath}/${category}/${videoFileName}`;
  }, []);

  // Load scene assets
  useEffect(() => {
    if (!skyManifest || !groundManifest) return;

    const newSkySrc = getAssetPath(skyManifest, skyCategory, skyIndex, skyVariant, 'sky');
    const newGroundSrc = getAssetPath(groundManifest, groundCategory, groundIndex, groundVariant, 'ground');

    setSceneAssets(prev => ({
      ...prev,
      skySrc: newSkySrc,
      groundSrc: newGroundSrc,
    }));
  }, [skyManifest, groundManifest, skyCategory, skyIndex, skyVariant, groundCategory, groundIndex, groundVariant, getAssetPath]);

  // Handle video load errors gracefully
  const handleVideoError = useCallback((type: 'sky' | 'ground') => {
    console.warn(`${type} video failed to load`);
    // Could implement fallback behavior here
  }, []);

  // Calculate layer opacities based on current mode and orientation
  const layerOpacities = useMemo(() => {
    const { beta } = orientation;
    const normalizedBeta = Math.max(-90, Math.min(90, beta)); // Clamp to -90 to 90
    
    // Calculate opacity factors (0 to 1)
    let skyOpacity = 0;
    let horizonOpacity = 0;
    let groundOpacity = 0;
    
    if (normalizedBeta <= TILT_THRESHOLDS.SKY_ANGLE) {
      // Full sky mode
      skyOpacity = 1;
      horizonOpacity = 0.3;
    } else if (normalizedBeta >= TILT_THRESHOLDS.GROUND_ANGLE) {
      // Full ground mode
      groundOpacity = 1;
      horizonOpacity = 0.2;
    } else {
      // Horizon mode - blend based on angle
      const horizonRange = TILT_THRESHOLDS.GROUND_ANGLE - TILT_THRESHOLDS.SKY_ANGLE;
      const position = (normalizedBeta - TILT_THRESHOLDS.SKY_ANGLE) / horizonRange;
      
      skyOpacity = Math.max(0, 1 - position * 2);
      groundOpacity = Math.max(0, (position - 0.5) * 2);
      horizonOpacity = 1 - Math.abs(position - 0.5) * 2;
    }
    
    return {
      starfield: currentMode === 'sky' ? 1 : 0.3,
      sky: skyOpacity,
      horizon: horizonOpacity,
      ground: groundOpacity,
    };
  }, [orientation, currentMode]);

  // Performance optimization: reduce quality on low battery
  const videoQuality = useMemo(() => {
    if (!enablePerformanceOptimization) return 'high';
    if (batteryLevel < PERFORMANCE_CONFIG.REDUCED_QUALITY_THRESHOLD) return 'low';
    if (isLowPower) return 'medium';
    return 'high';
  }, [batteryLevel, isLowPower, enablePerformanceOptimization]);

  return (
    <div className={cn("relative w-full h-full overflow-hidden bg-black", className)}>
      {/* Starfield Background Layer */}
      <div 
        className={cn(
          "absolute inset-0 transition-opacity duration-1000",
          starfieldError 
            ? "bg-gradient-to-b from-indigo-950 via-purple-900 to-black" 
            : "bg-cover bg-center"
        )}
        style={{
          backgroundImage: starfieldError ? undefined : `url(${sceneAssets.starfieldSrc})`,
          opacity: layerOpacities.starfield,
          zIndex: 1,
        }}
        role="img"
        aria-label="Starfield background"
        onError={() => setStarfieldError(true)}
      />

      {/* CSS Starfield Fallback */}
      {starfieldError && (
        <div 
          className="absolute inset-0 opacity-60"
          style={{
            background: `
              radial-gradient(2px 2px at 20% 30%, #fff, transparent),
              radial-gradient(1px 1px at 40% 70%, rgba(255,255,255,0.8), transparent),
              radial-gradient(1px 1px at 60% 40%, #fff, transparent),
              radial-gradient(2px 2px at 80% 20%, rgba(255,255,255,0.6), transparent),
              radial-gradient(1px 1px at 15% 80%, #fff, transparent),
              radial-gradient(1px 1px at 85% 60%, rgba(255,255,255,0.8), transparent),
              linear-gradient(135deg, #0c0c2e 0%, #1a1a3e 50%, #2d2d5a 100%)
            `,
            zIndex: 1,
          }}
        />
      )}

      {/* Sky Video Layer */}
      {sceneAssets.skySrc && (
        <video
          key={`sky-${sceneAssets.skySrc}`}
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000"
          style={{
            opacity: layerOpacities.sky,
            zIndex: 10,
          }}
          src={sceneAssets.skySrc}
          autoPlay
          loop
          muted
          playsInline
          preload={videoQuality === 'low' ? 'none' : 'metadata'}
          onError={() => handleVideoError('sky')}
        />
      )}

      {/* Horizon Fog Band Layer */}
      <div
        className="absolute inset-0 transition-opacity duration-1000"
        style={{
          opacity: layerOpacities.horizon,
          zIndex: 15,
          background: 'linear-gradient(to bottom, transparent 0%, rgba(200, 200, 255, 0.3) 40%, rgba(200, 200, 255, 0.5) 60%, transparent 100%)',
        }}
        role="img"
        aria-label="Horizon fog band"
      />

      {/* Ground Video Layer with Top Mask */}
      {sceneAssets.groundSrc && (
        <div className="absolute inset-0" style={{ zIndex: 20 }}>
          <video
            key={`ground-${sceneAssets.groundSrc}`}
            className="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000"
            style={{
              opacity: layerOpacities.ground,
              maskImage: 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.5) 30%, rgba(0,0,0,1) 50%, rgba(0,0,0,1) 100%)',
              WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.5) 30%, rgba(0,0,0,1) 50%, rgba(0,0,0,1) 100%)',
            }}
            src={sceneAssets.groundSrc}
            autoPlay
            loop
            muted
            playsInline
            preload={videoQuality === 'low' ? 'none' : 'metadata'}
            onError={() => handleVideoError('ground')}
          />
        </div>
      )}

      {/* Transition Overlay */}
      {isTransitioning && (
        <div 
          className="absolute inset-0 bg-black transition-opacity duration-500"
          style={{ zIndex: 100, opacity: 0.3 }}
        />
      )}

      {/* Debug Info (Development only) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="absolute top-4 left-4 bg-black/50 text-white p-2 rounded text-xs font-mono" style={{ zIndex: 200 }}>
          <div>Mode: {currentMode}</div>
          <div>Beta: {orientation.beta.toFixed(1)}°</div>
          <div>Gamma: {orientation.gamma.toFixed(1)}°</div>
          <div>Battery: {(batteryLevel * 100).toFixed(0)}%</div>
          <div>Quality: {videoQuality}</div>
          <div>Sky: {(layerOpacities.sky * 100).toFixed(0)}%</div>
          <div>Horizon: {(layerOpacities.horizon * 100).toFixed(0)}%</div>
          <div>Ground: {(layerOpacities.ground * 100).toFixed(0)}%</div>
        </div>
      )}
    </div>
  );
}

export default TiltScene;