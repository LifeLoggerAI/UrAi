"use client";

import { useEffect, useMemo, useState } from "react";

type ImmersiveWorldMode = "home" | "life-map";

interface ImmersiveWorld3DProps {
  mode: ImmersiveWorldMode;
  activeLabel?: string;
  selectedLabel?: string;
  className?: string;
}

const WORLD_NODES = [
  { id: "origin", x: 50, y: 48, z: 0, size: 138, label: "Origin Orb" },
  { id: "memory", x: 32, y: 42, z: -80, size: 58, label: "Memory" },
  { id: "recovery", x: 67, y: 43, z: -110, size: 52, label: "Recovery" },
  { id: "purpose", x: 47, y: 28, z: -170, size: 46, label: "Purpose" },
  { id: "shadow", x: 24, y: 61, z: -210, size: 38, label: "Shadow" },
  { id: "joy", x: 73, y: 60, z: -190, size: 42, label: "Joy" },
  { id: "legacy", x: 52, y: 72, z: -260, size: 34, label: "Legacy" },
];

function useWorldMotion(mode: ImmersiveWorldMode) {
  const [motion, setMotion] = useState({ x: 0, y: 0, depth: mode === "home" ? 1 : 1.08 });

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mediaQuery.matches) return;

    const handlePointerMove = (event: PointerEvent) => {
      const nextX = (event.clientX / Math.max(1, window.innerWidth) - 0.5) * 2;
      const nextY = (event.clientY / Math.max(1, window.innerHeight) - 0.5) * 2;
      setMotion((current) => ({
        x: current.x + (nextX - current.x) * 0.18,
        y: current.y + (nextY - current.y) * 0.18,
        depth: current.depth,
      }));
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    return () => window.removeEventListener("pointermove", handlePointerMove);
  }, []);

  return motion;
}

export default function ImmersiveWorld3D({ mode, activeLabel, selectedLabel, className = "" }: ImmersiveWorld3DProps) {
  const motion = useWorldMotion(mode);
  const constellationLines = useMemo(
    () => [
      [WORLD_NODES[0], WORLD_NODES[1]],
      [WORLD_NODES[0], WORLD_NODES[2]],
      [WORLD_NODES[1], WORLD_NODES[3]],
      [WORLD_NODES[2], WORLD_NODES[5]],
      [WORLD_NODES[3], WORLD_NODES[6]],
      [WORLD_NODES[4], WORLD_NODES[6]],
    ],
    [],
  );

  const worldTransform = `rotateX(${8 - motion.y * 5}deg) rotateY(${motion.x * 9}deg) translate3d(${motion.x * 16}px, ${motion.y * 12}px, 0) scale(${motion.depth})`;
  const modeClass = mode === "home" ? "urai-world-home" : "urai-world-life-map";

  return (
    <div className={`urai-immersive-world ${modeClass} ${className}`} aria-hidden="true">
      <div className="urai-world-sky" />
      <div className="urai-world-moon" />
      <div className="urai-world-perspective">
        <div className="urai-world-stage" style={{ transform: worldTransform }}>
          <div className="urai-world-floor">
            <div className="urai-world-grid" />
            <div className="urai-world-reflection" />
          </div>

          <div className="urai-world-ring urai-world-ring-one" />
          <div className="urai-world-ring urai-world-ring-two" />
          <div className="urai-world-ring urai-world-ring-three" />

          {constellationLines.map(([from, to]) => {
            const dx = to.x - from.x;
            const dy = to.y - from.y;
            const length = Math.sqrt(dx * dx + dy * dy);
            const angle = Math.atan2(dy, dx) * (180 / Math.PI);
            return (
              <span
                key={`${from.id}-${to.id}`}
                className="urai-world-line"
                style={{
                  left: `${from.x}%`,
                  top: `${from.y}%`,
                  width: `${length}%`,
                  transform: `rotate(${angle}deg) translateZ(${Math.min(from.z, to.z)}px)`,
                }}
              />
            );
          })}

          {WORLD_NODES.map((node, index) => {
            const isCore = node.id === "origin";
            const isSelected = selectedLabel?.toLowerCase().includes(node.label.toLowerCase());
            return (
              <div
                key={node.id}
                className={`urai-world-node ${isCore ? "is-core" : ""} ${isSelected ? "is-selected" : ""}`}
                style={{
                  left: `${node.x}%`,
                  top: `${node.y}%`,
                  width: node.size,
                  height: node.size,
                  transform: `translate3d(-50%, -50%, ${node.z}px)`,
                  animationDelay: `${index * 0.36}s`,
                }}
              >
                <span className="urai-world-node-core" />
                <span className="urai-world-node-label">{node.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="urai-world-atmosphere" />
      <div className="urai-world-vignette" />
      {(activeLabel || selectedLabel) && (
        <div className="urai-world-status">
          <span>{selectedLabel || activeLabel}</span>
        </div>
      )}

      <style jsx>{`
        .urai-immersive-world {
          position: absolute;
          inset: 0;
          overflow: hidden;
          pointer-events: none;
          background:
            radial-gradient(circle at 50% 20%, rgba(125, 211, 252, 0.16), transparent 24%),
            radial-gradient(circle at 74% 28%, rgba(196, 181, 253, 0.12), transparent 22%),
            linear-gradient(180deg, #020617 0%, #041026 46%, #020617 100%);
          isolation: isolate;
        }

        .urai-world-life-map {
          opacity: 0.78;
          mix-blend-mode: screen;
        }

        .urai-world-home {
          opacity: 0.9;
        }

        .urai-world-sky,
        .urai-world-atmosphere,
        .urai-world-vignette,
        .urai-world-moon {
          position: absolute;
          inset: 0;
        }

        .urai-world-sky {
          background-image:
            radial-gradient(circle at 8% 18%, rgba(255, 255, 255, 0.9) 0 1px, transparent 2px),
            radial-gradient(circle at 20% 36%, rgba(186, 230, 253, 0.7) 0 1px, transparent 2px),
            radial-gradient(circle at 38% 17%, rgba(255, 255, 255, 0.8) 0 1px, transparent 2px),
            radial-gradient(circle at 59% 31%, rgba(221, 214, 254, 0.75) 0 1px, transparent 2px),
            radial-gradient(circle at 83% 15%, rgba(255, 255, 255, 0.86) 0 1px, transparent 2px),
            radial-gradient(circle at 91% 44%, rgba(186, 230, 253, 0.72) 0 1px, transparent 2px);
          opacity: 0.65;
          filter: drop-shadow(0 0 10px rgba(125, 211, 252, 0.4));
        }

        .urai-world-moon {
          left: auto;
          right: clamp(32px, 8vw, 120px);
          top: clamp(54px, 10vh, 110px);
          width: clamp(84px, 9vw, 148px);
          height: clamp(84px, 9vw, 148px);
          border-radius: 999px;
          background: radial-gradient(circle at 38% 36%, rgba(255, 255, 255, 0.9), rgba(219, 234, 254, 0.36) 38%, transparent 69%);
          filter: blur(0.2px) drop-shadow(0 0 52px rgba(186, 230, 253, 0.34));
          opacity: 0.34;
        }

        .urai-world-perspective {
          position: absolute;
          inset: 0;
          perspective: 900px;
          perspective-origin: 50% 44%;
          transform-style: preserve-3d;
        }

        .urai-world-stage {
          position: absolute;
          inset: 0;
          transform-style: preserve-3d;
          transition: transform 280ms ease-out;
          will-change: transform;
        }

        .urai-world-floor {
          position: absolute;
          left: 50%;
          top: 62%;
          width: min(1120px, 112vw);
          height: min(560px, 55vh);
          transform: translate3d(-50%, -18%, -340px) rotateX(68deg);
          transform-style: preserve-3d;
          border-radius: 50%;
          background:
            radial-gradient(ellipse at 50% 42%, rgba(125, 211, 252, 0.18), transparent 42%),
            radial-gradient(ellipse at 50% 70%, rgba(15, 23, 42, 0.92), rgba(2, 6, 23, 0.98) 72%);
          border: 1px solid rgba(186, 230, 253, 0.14);
          box-shadow: inset 0 18px 80px rgba(125, 211, 252, 0.08), 0 0 100px rgba(14, 165, 233, 0.14);
        }

        .urai-world-grid {
          position: absolute;
          inset: 0;
          border-radius: inherit;
          background-image:
            linear-gradient(rgba(125, 211, 252, 0.13) 1px, transparent 1px),
            linear-gradient(90deg, rgba(125, 211, 252, 0.13) 1px, transparent 1px);
          background-size: 58px 58px;
          opacity: 0.28;
          mask-image: radial-gradient(ellipse at 50% 50%, #000 0%, transparent 70%);
        }

        .urai-world-reflection {
          position: absolute;
          inset: 18% 24%;
          border-radius: 50%;
          background: radial-gradient(ellipse at 50% 50%, rgba(255, 255, 255, 0.16), rgba(125, 211, 252, 0.1) 30%, transparent 68%);
          filter: blur(18px);
        }

        .urai-world-ring {
          position: absolute;
          left: 50%;
          top: 50%;
          border-radius: 50%;
          border: 1px solid rgba(186, 230, 253, 0.2);
          transform-style: preserve-3d;
          box-shadow: 0 0 38px rgba(125, 211, 252, 0.09);
        }

        .urai-world-ring-one {
          width: min(560px, 72vw);
          height: min(560px, 72vw);
          transform: translate3d(-50%, -50%, -90px) rotateX(62deg) rotateZ(-12deg);
        }

        .urai-world-ring-two {
          width: min(760px, 92vw);
          height: min(760px, 92vw);
          transform: translate3d(-50%, -50%, -180px) rotateX(66deg) rotateZ(18deg);
          opacity: 0.72;
        }

        .urai-world-ring-three {
          width: min(980px, 118vw);
          height: min(980px, 118vw);
          transform: translate3d(-50%, -50%, -280px) rotateX(70deg) rotateZ(-28deg);
          opacity: 0.46;
        }

        .urai-world-line {
          position: absolute;
          height: 1px;
          transform-origin: 0 50%;
          background: linear-gradient(90deg, rgba(125, 211, 252, 0), rgba(165, 243, 252, 0.48), rgba(196, 181, 253, 0));
          filter: drop-shadow(0 0 8px rgba(125, 211, 252, 0.36));
        }

        .urai-world-node {
          position: absolute;
          display: grid;
          place-items: center;
          transform-style: preserve-3d;
          border-radius: 50%;
          animation: urai-world-float 7s ease-in-out infinite;
        }

        .urai-world-node-core {
          width: 100%;
          height: 100%;
          border-radius: inherit;
          background:
            radial-gradient(circle at 36% 30%, rgba(255, 255, 255, 0.96), rgba(186, 230, 253, 0.82) 19%, rgba(56, 189, 248, 0.32) 43%, rgba(88, 28, 135, 0.06) 72%, transparent 78%);
          border: 1px solid rgba(224, 242, 254, 0.5);
          box-shadow:
            inset -18px -22px 42px rgba(14, 165, 233, 0.18),
            inset 12px 12px 34px rgba(255, 255, 255, 0.16),
            0 0 34px rgba(125, 211, 252, 0.32),
            0 0 96px rgba(99, 102, 241, 0.14);
        }

        .urai-world-node.is-core .urai-world-node-core {
          box-shadow:
            inset -22px -30px 60px rgba(14, 165, 233, 0.24),
            inset 14px 16px 42px rgba(255, 255, 255, 0.2),
            0 0 46px rgba(224, 242, 254, 0.52),
            0 0 130px rgba(125, 211, 252, 0.36),
            0 0 220px rgba(196, 181, 253, 0.18);
        }

        .urai-world-node.is-selected .urai-world-node-core {
          outline: 2px solid rgba(255, 255, 255, 0.8);
          box-shadow: 0 0 46px rgba(255, 255, 255, 0.72), 0 0 150px rgba(125, 211, 252, 0.45);
        }

        .urai-world-node-label {
          position: absolute;
          top: calc(100% + 8px);
          left: 50%;
          transform: translateX(-50%);
          white-space: nowrap;
          border-radius: 999px;
          border: 1px solid rgba(186, 230, 253, 0.18);
          background: rgba(2, 6, 23, 0.5);
          padding: 4px 9px;
          font-size: 10px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: rgba(224, 242, 254, 0.72);
          backdrop-filter: blur(10px);
        }

        .urai-world-atmosphere {
          background:
            radial-gradient(ellipse at 50% 62%, rgba(125, 211, 252, 0.16), transparent 28%),
            radial-gradient(ellipse at 50% 78%, rgba(15, 23, 42, 0.4), transparent 40%),
            linear-gradient(180deg, transparent 0%, rgba(2, 6, 23, 0.18) 45%, rgba(0, 0, 0, 0.7) 100%);
          z-index: 3;
        }

        .urai-world-vignette {
          z-index: 4;
          box-shadow: inset 0 0 140px rgba(0, 0, 0, 0.78);
        }

        .urai-world-status {
          position: absolute;
          right: clamp(18px, 4vw, 56px);
          bottom: clamp(18px, 5vh, 72px);
          z-index: 5;
          max-width: min(360px, 70vw);
          border: 1px solid rgba(186, 230, 253, 0.16);
          border-radius: 999px;
          background: rgba(2, 6, 23, 0.48);
          padding: 10px 14px;
          color: rgba(224, 242, 254, 0.76);
          font-size: 11px;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          backdrop-filter: blur(16px);
        }

        @keyframes urai-world-float {
          0%, 100% {
            filter: brightness(0.94);
          }
          50% {
            filter: brightness(1.2);
          }
        }

        @media (max-width: 760px) {
          .urai-world-life-map {
            opacity: 0.58;
          }

          .urai-world-node-label {
            display: none;
          }

          .urai-world-node:not(.is-core) {
            opacity: 0.7;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .urai-world-stage {
            transition: none;
          }

          .urai-world-node {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}
