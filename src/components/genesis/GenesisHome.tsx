"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import '../../styles/NewGenesisHome.css';

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
    if (!(e.target as HTMLElement).closest('.genesisTopNav, .genesisFieldCard, .genesisPortalPrompt')) {
      router.push('/life-map');
    }
  };

  const parallaxX = isClient ? (x / window.innerWidth - 0.5) * 30 : 0;
  const parallaxY = isClient ? (y / window.innerHeight - 0.5) * 30 : 0;

  return (
    <div className="genesisHomeScene" onClick={handleSceneClick}>
      <div className="genesisAtmosphere" />
      <div className="genesisVignette" />
      <div className="genesisParticleField" />
      <div className="genesisFog" />

      <div className="genesisGroundPlane" />

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

      <div className="genesisBrandMark">URAI</div>

      <nav className="genesisTopNav">
        <Link href="/galaxy">Galaxy</Link>
        <Link href="/replay">Replay</Link>
        <Link href="/passport">Passport</Link>
      </nav>

      <div className="genesisFieldCard">
        <div className="label">CURRENT FIELD</div>
        <div className="title">URAI</div>
        <div className="state">Threshold</div>
        <div className="subtitle">A turning point is forming.</div>
      </div>

      <div className="genesisPortalPrompt" onClick={() => router.push('/life-map')}>
        Enter Life Map
      </div>
    </div>
  );
}