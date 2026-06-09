"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import './GenesisHome.css';

// A simple hook for mouse position to create a parallax effect
const useMousePosition = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const updateMousePosition = (ev: MouseEvent) => {
      setMousePosition({ x: ev.clientX, y: ev.clientY });
    };
    window.addEventListener('mousemove', updateMousePosition);
    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
    };
  }, []);

  return mousePosition;
};

export default function GenesisHome() {
  const router = useRouter();
  const { x, y } = useMousePosition();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleSceneClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Ensure clicks on interactive elements don't trigger navigation
    if ((e.target as HTMLElement).closest('.genesisTopNav, .genesisFieldCard, .genesisStateChips')) {
      return;
    }
    router.push('/galaxy');
  };

  const parallaxX = isClient ? (x / window.innerWidth - 0.5) * 30 : 0;
  const parallaxY = isClient ? (y / window.innerHeight - 0.5) * 30 : 0;

  return (
    <div className="genesisHomeScene" onClick={handleSceneClick}>
      {/* Background & Atmosphere */}
      <div className="genesisAtmosphere" />
      <div className="genesisVignette" />
      <div className="genesisParticleField" />
      <div className="genesisFog" />

      {/* Ground */}
      <div className="genesisGroundPlane" />

      {/* Orb & Vessel */}
      <div 
        className="genesisOrbContainer"
        style={{
          transform: `translate(-50%, -60%) translate(${parallaxX}px, ${parallaxY}px)`,
          transition: 'transform 0.2s ease-out',
        }}
      >
        <div className="genesisOrb" />
        <div className="genesisOrbCore" />
        <div className="genesisOrbHighlight" />
        <div className="genesisLightBeam" />
        <div className="genesisVesselSilhouette" />
        <div className="genesisVesselGrounding" />
      </div>

      {/* UI Elements */}
      <div className="genesisBrandMark">URAI</div>

      <nav className="genesisTopNav">
        <Link href="/galaxy">Galaxy</Link>
        <Link href="/replay">Replay</Link>
        <Link href="/passport">Passport</Link>
      </nav>

      <div className="genesisFieldCard">
        <div className="label">PRIVATE FIELD</div>
        <div className="title">URAI</div>
        <div className="state">RECOVERY</div>
        <div className="subtitle">green recovery bloom</div>
      </div>

      <div className="genesisStateChips">
        <div className="chip blue">Blue Fog</div>
        <div className="chip green">Recovery</div>
        <div className="chip purple">Bond</div>
        <div className="chip orange">Threshold</div>
      </div>

      <div className="genesisPortalPrompt">
        Tap the sky to enter Life Map
      </div>
    </div>
  );
}
