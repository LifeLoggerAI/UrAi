export function OrbitRings({ mirrorMode = false }: { mirrorMode?: boolean }) {
  const rings = [
    { rx: 306, ry: 102, rotate: -14, opacity: 0.18 },
    { rx: 392, ry: 134, rotate: 16, opacity: 0.14 },
    { rx: 478, ry: 166, rotate: -14, opacity: 0.1 },
    { rx: 564, ry: 198, rotate: 16, opacity: 0.075 },
    { rx: 680, ry: 238, rotate: -7, opacity: 0.052 },
  ];

  return (
    <svg className="urai-orbit-rings" viewBox="-760 -430 1520 860" aria-hidden>
      <defs>
        <linearGradient id="urai-orbit-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="rgba(125,211,252,0)" />
          <stop offset="34%" stopColor="rgba(186,230,253,0.68)" />
          <stop offset="58%" stopColor="rgba(196,181,253,0.48)" />
          <stop offset="100%" stopColor="rgba(125,211,252,0)" />
        </linearGradient>
        <filter id="urai-orbit-glow" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="2.2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      {rings.map((ring) => (
        <ellipse
          key={ring.rx}
          cx="0"
          cy="0"
          rx={ring.rx}
          ry={ring.ry}
          transform={`rotate(${ring.rotate})`}
          fill="none"
          stroke="url(#urai-orbit-gradient)"
          strokeWidth="1.2"
          strokeDasharray="8 18"
          opacity={ring.opacity}
          filter="url(#urai-orbit-glow)"
        />
      ))}
      {mirrorMode ? <path d="M 0 -350 L 0 350" stroke="rgba(232,242,255,.16)" strokeDasharray="8 16" /> : null}
    </svg>
  );
}
