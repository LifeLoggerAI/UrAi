"use client";

const MEMORY_TREES = [
  { id: "left-cypress", x: 14, y: 68, z: -260, scale: 1.18, delay: 0 },
  { id: "right-cypress", x: 84, y: 66, z: -250, scale: 1.05, delay: 0.4 },
  { id: "near-willow", x: 25, y: 76, z: -120, scale: 0.9, delay: 0.8 },
  { id: "far-willow", x: 76, y: 77, z: -160, scale: 0.82, delay: 1.2 },
  { id: "legacy-tree", x: 55, y: 82, z: -310, scale: 0.72, delay: 1.6 },
];

const MEMORY_STONES = [
  { id: "stone-one", x: 39, y: 72, z: -100, scale: 1, delay: 0 },
  { id: "stone-two", x: 61, y: 74, z: -130, scale: 0.78, delay: 0.25 },
  { id: "stone-three", x: 20, y: 82, z: -210, scale: 0.9, delay: 0.5 },
  { id: "stone-four", x: 80, y: 82, z: -230, scale: 0.72, delay: 0.75 },
];

const FIREFLIES = Array.from({ length: 18 }, (_, index) => ({
  id: `firefly-${index}`,
  x: 8 + ((index * 17) % 84),
  y: 18 + ((index * 23) % 58),
  delay: (index % 9) * 0.42,
  size: 3 + (index % 4),
}));

export default function MomLifeMapPolishOverlay() {
  return (
    <div className="mom-life-polish" aria-hidden="true">
      <div className="mom-life-sunrise" />
      <div className="mom-life-water" />
      <div className="mom-life-path" />
      <div className="mom-life-garden">
        {MEMORY_TREES.map((tree) => (
          <span
            key={tree.id}
            className="mom-life-tree"
            style={{
              left: `${tree.x}%`,
              top: `${tree.y}%`,
              transform: `translate3d(-50%, -100%, ${tree.z}px) scale(${tree.scale})`,
              animationDelay: `${tree.delay}s`,
            }}
          >
            <span className="mom-life-tree-glow" />
            <span className="mom-life-tree-leaf mom-life-tree-leaf-a" />
            <span className="mom-life-tree-leaf mom-life-tree-leaf-b" />
            <span className="mom-life-tree-leaf mom-life-tree-leaf-c" />
            <span className="mom-life-tree-trunk" />
          </span>
        ))}

        {MEMORY_STONES.map((stone) => (
          <span
            key={stone.id}
            className="mom-life-stone"
            style={{
              left: `${stone.x}%`,
              top: `${stone.y}%`,
              transform: `translate3d(-50%, -50%, ${stone.z}px) scale(${stone.scale})`,
              animationDelay: `${stone.delay}s`,
            }}
          />
        ))}
      </div>

      {FIREFLIES.map((firefly) => (
        <span
          key={firefly.id}
          className="mom-life-firefly"
          style={{
            left: `${firefly.x}%`,
            top: `${firefly.y}%`,
            width: firefly.size,
            height: firefly.size,
            animationDelay: `${firefly.delay}s`,
          }}
        />
      ))}

      <div className="mom-life-invite">
        <strong>This is a Life Map</strong>
        <span>Look around. Each glowing point is a memory, a place, or a piece of the story.</span>
      </div>

      <style jsx>{`
        .mom-life-polish {
          position: absolute;
          inset: 0;
          overflow: hidden;
          pointer-events: none;
          transform-style: preserve-3d;
          z-index: 1;
        }

        .mom-life-sunrise {
          position: absolute;
          left: 50%;
          top: 18%;
          width: min(340px, 36vw);
          height: min(340px, 36vw);
          border-radius: 999px;
          transform: translate3d(-50%, -50%, -520px);
          background:
            radial-gradient(circle at 44% 38%, rgba(255, 255, 255, 0.9), rgba(254, 240, 138, 0.34) 26%, rgba(125, 211, 252, 0.13) 54%, transparent 72%);
          filter: blur(0.4px) drop-shadow(0 0 90px rgba(253, 224, 71, 0.24));
          opacity: 0.72;
        }

        .mom-life-water {
          position: absolute;
          left: 50%;
          top: 74%;
          width: min(860px, 92vw);
          height: min(220px, 24vh);
          border-radius: 50%;
          transform: translate3d(-50%, -50%, -360px) rotateX(66deg);
          background:
            radial-gradient(ellipse at 50% 45%, rgba(224, 242, 254, 0.22), transparent 18%),
            repeating-linear-gradient(90deg, rgba(186, 230, 253, 0.0) 0 22px, rgba(186, 230, 253, 0.12) 23px 24px),
            radial-gradient(ellipse at 50% 50%, rgba(14, 165, 233, 0.18), rgba(15, 23, 42, 0.08) 62%, transparent 72%);
          border: 1px solid rgba(186, 230, 253, 0.16);
          box-shadow: inset 0 0 34px rgba(125, 211, 252, 0.15), 0 0 70px rgba(14, 165, 233, 0.08);
          opacity: 0.72;
          animation: mom-water-shimmer 7s ease-in-out infinite;
        }

        .mom-life-path {
          position: absolute;
          left: 50%;
          top: 78%;
          width: min(420px, 42vw);
          height: min(340px, 32vh);
          transform: translate3d(-50%, -50%, -190px) rotateX(67deg);
          border-radius: 52% 48% 12% 12%;
          background:
            radial-gradient(ellipse at 50% 0%, rgba(254, 249, 195, 0.28), transparent 38%),
            linear-gradient(180deg, rgba(186, 230, 253, 0.2), rgba(125, 211, 252, 0.03));
          clip-path: polygon(42% 0%, 58% 0%, 82% 100%, 18% 100%);
          filter: drop-shadow(0 0 28px rgba(186, 230, 253, 0.24));
          opacity: 0.74;
        }

        .mom-life-garden {
          position: absolute;
          inset: 0;
          transform-style: preserve-3d;
        }

        .mom-life-tree,
        .mom-life-stone {
          position: absolute;
          transform-style: preserve-3d;
          animation: mom-garden-breathe 8s ease-in-out infinite;
        }

        .mom-life-tree {
          width: 88px;
          height: 150px;
          filter: drop-shadow(0 16px 28px rgba(0, 0, 0, 0.24));
        }

        .mom-life-tree-glow {
          position: absolute;
          left: 50%;
          bottom: 4px;
          width: 86px;
          height: 24px;
          border-radius: 50%;
          transform: translateX(-50%) rotateX(70deg);
          background: radial-gradient(ellipse, rgba(134, 239, 172, 0.18), transparent 70%);
          filter: blur(6px);
        }

        .mom-life-tree-leaf {
          position: absolute;
          left: 50%;
          border-radius: 50% 50% 44% 44%;
          transform: translateX(-50%);
          background:
            radial-gradient(circle at 34% 22%, rgba(236, 253, 245, 0.86), transparent 15%),
            radial-gradient(circle at 54% 40%, rgba(134, 239, 172, 0.56), rgba(21, 128, 61, 0.12) 62%, transparent 74%);
          border: 1px solid rgba(187, 247, 208, 0.24);
          box-shadow: inset 0 -18px 34px rgba(20, 83, 45, 0.12), 0 0 34px rgba(134, 239, 172, 0.14);
        }

        .mom-life-tree-leaf-a { top: 4px; width: 76px; height: 88px; }
        .mom-life-tree-leaf-b { top: 34px; width: 94px; height: 88px; opacity: 0.8; }
        .mom-life-tree-leaf-c { top: 68px; width: 72px; height: 66px; opacity: 0.66; }

        .mom-life-tree-trunk {
          position: absolute;
          left: 50%;
          bottom: 0;
          width: 13px;
          height: 70px;
          transform: translateX(-50%);
          border-radius: 999px;
          background: linear-gradient(90deg, rgba(120, 53, 15, 0.24), rgba(254, 243, 199, 0.36), rgba(120, 53, 15, 0.18));
          box-shadow: 0 0 14px rgba(254, 240, 138, 0.12);
        }

        .mom-life-stone {
          width: 74px;
          height: 42px;
          border-radius: 48% 52% 44% 56%;
          background:
            radial-gradient(circle at 34% 24%, rgba(255, 255, 255, 0.42), transparent 20%),
            linear-gradient(135deg, rgba(203, 213, 225, 0.34), rgba(51, 65, 85, 0.16));
          border: 1px solid rgba(226, 232, 240, 0.16);
          box-shadow: inset -12px -10px 20px rgba(15, 23, 42, 0.18), 0 0 24px rgba(148, 163, 184, 0.09);
          opacity: 0.78;
        }

        .mom-life-firefly {
          position: absolute;
          border-radius: 999px;
          background: rgba(254, 240, 138, 0.92);
          box-shadow: 0 0 12px rgba(254, 240, 138, 0.92), 0 0 26px rgba(125, 211, 252, 0.24);
          animation: mom-firefly-drift 6.4s ease-in-out infinite;
        }

        .mom-life-invite {
          position: absolute;
          left: clamp(18px, 4vw, 56px);
          bottom: clamp(18px, 5vh, 72px);
          z-index: 6;
          max-width: min(380px, 78vw);
          border: 1px solid rgba(254, 249, 195, 0.16);
          border-radius: 22px;
          background: linear-gradient(135deg, rgba(2, 6, 23, 0.58), rgba(15, 23, 42, 0.34));
          padding: 14px 16px;
          color: rgba(255, 255, 255, 0.86);
          box-shadow: 0 20px 80px rgba(0, 0, 0, 0.26), inset 0 1px 0 rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(18px);
        }

        .mom-life-invite strong {
          display: block;
          margin-bottom: 5px;
          font-size: 13px;
          letter-spacing: 0.16em;
          text-transform: uppercase;
        }

        .mom-life-invite span {
          display: block;
          color: rgba(224, 242, 254, 0.72);
          font-size: 12px;
          line-height: 1.45;
        }

        @keyframes mom-water-shimmer {
          0%, 100% { filter: brightness(0.94); opacity: 0.64; }
          50% { filter: brightness(1.2); opacity: 0.78; }
        }

        @keyframes mom-garden-breathe {
          0%, 100% { filter: brightness(0.94) drop-shadow(0 16px 28px rgba(0, 0, 0, 0.24)); }
          50% { filter: brightness(1.12) drop-shadow(0 18px 34px rgba(14, 165, 233, 0.14)); }
        }

        @keyframes mom-firefly-drift {
          0%, 100% { transform: translate3d(0, 0, -80px); opacity: 0.18; }
          35% { transform: translate3d(16px, -24px, -20px); opacity: 0.94; }
          70% { transform: translate3d(-12px, 14px, -140px); opacity: 0.42; }
        }

        @media (max-width: 760px) {
          .mom-life-tree { opacity: 0.62; }
          .mom-life-invite { display: none; }
          .mom-life-water { opacity: 0.48; }
        }

        @media (prefers-reduced-motion: reduce) {
          .mom-life-water,
          .mom-life-tree,
          .mom-life-stone,
          .mom-life-firefly {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}
