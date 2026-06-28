const foregroundStars = Array.from({ length: 44 }, (_, index) => ({
  left: 5 + ((index * 23) % 90),
  top: 7 + ((index * 37) % 82),
  size: 2 + (index % 4),
  delay: (index % 9) * 0.32,
}));

const midStars = Array.from({ length: 90 }, (_, index) => ({
  left: 2 + ((index * 17) % 96),
  top: 3 + ((index * 29) % 92),
  size: 1 + (index % 3),
  delay: (index % 13) * 0.21,
}));

const dust = Array.from({ length: 28 }, (_, index) => ({
  left: 8 + ((index * 19) % 84),
  top: 12 + ((index * 31) % 76),
  delay: (index % 8) * 0.45,
}));

export function GalaxyBackground() {
  return (
    <div className="urai-galaxy-bg urai-galaxy-bg-pass-one" aria-hidden>
      <div className="urai-galaxy-deep-field" />
      <div className="urai-galaxy-core" />
      <div className="urai-galaxy-band" />
      <div className="urai-galaxy-band urai-galaxy-band-secondary" />
      <div className="urai-galaxy-nebula-cloud cloud-a" />
      <div className="urai-galaxy-nebula-cloud cloud-b" />
      <div className="urai-galaxy-nebula-cloud cloud-c" />
      <div className="urai-galaxy-rift" />
      <div className="urai-galaxy-star-layer mid">
        {midStars.map((star, index) => (
          <span
            key={`mid-${index}`}
            style={{
              left: `${star.left}%`,
              top: `${star.top}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              animationDelay: `${star.delay}s`,
            }}
          />
        ))}
      </div>
      <div className="urai-galaxy-star-layer foreground">
        {foregroundStars.map((star, index) => (
          <span
            key={`front-${index}`}
            style={{
              left: `${star.left}%`,
              top: `${star.top}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              animationDelay: `${star.delay}s`,
            }}
          />
        ))}
      </div>
      <div className="urai-galaxy-dust-layer">
        {dust.map((particle, index) => (
          <span
            key={`dust-${index}`}
            style={{
              left: `${particle.left}%`,
              top: `${particle.top}%`,
              animationDelay: `${particle.delay}s`,
            }}
          />
        ))}
      </div>

      <style jsx>{`
        .urai-galaxy-bg-pass-one {
          position: absolute;
          inset: 0;
          overflow: hidden;
          isolation: isolate;
          background:
            radial-gradient(circle at 50% 48%, rgba(147, 197, 253, 0.26), transparent 17%),
            radial-gradient(circle at 62% 42%, rgba(196, 181, 253, 0.18), transparent 30%),
            radial-gradient(circle at 34% 64%, rgba(45, 212, 191, 0.1), transparent 30%),
            linear-gradient(180deg, #00020a 0%, #020617 42%, #000103 100%);
        }

        .urai-galaxy-deep-field,
        .urai-galaxy-core,
        .urai-galaxy-band,
        .urai-galaxy-nebula-cloud,
        .urai-galaxy-rift,
        .urai-galaxy-star-layer,
        .urai-galaxy-dust-layer {
          position: absolute;
          inset: 0;
          pointer-events: none;
        }

        .urai-galaxy-deep-field {
          background-image:
            radial-gradient(circle at 8% 12%, rgba(255,255,255,.78) 0 1px, transparent 1.8px),
            radial-gradient(circle at 18% 78%, rgba(191,219,254,.72) 0 1px, transparent 1.9px),
            radial-gradient(circle at 29% 22%, rgba(255,255,255,.72) 0 1px, transparent 1.7px),
            radial-gradient(circle at 41% 84%, rgba(221,214,254,.72) 0 1px, transparent 1.8px),
            radial-gradient(circle at 53% 18%, rgba(255,255,255,.78) 0 1px, transparent 1.9px),
            radial-gradient(circle at 66% 74%, rgba(186,230,253,.72) 0 1px, transparent 1.8px),
            radial-gradient(circle at 79% 26%, rgba(255,255,255,.78) 0 1px, transparent 1.8px),
            radial-gradient(circle at 91% 68%, rgba(221,214,254,.72) 0 1px, transparent 1.8px);
          opacity: .72;
          filter: drop-shadow(0 0 8px rgba(125,211,252,.34));
          transform: scale(1.08);
        }

        .urai-galaxy-core {
          left: 50%;
          top: 52%;
          width: 120vw;
          height: 58vh;
          transform: translate(-50%, -50%) rotate(-9deg);
          border-radius: 999px;
          background:
            radial-gradient(ellipse at 50% 50%, rgba(255,255,255,.92), rgba(186,230,253,.36) 13%, rgba(96,165,250,.18) 28%, transparent 58%),
            radial-gradient(ellipse at 50% 50%, rgba(253,224,71,.22), transparent 24%);
          filter: blur(24px) saturate(1.3);
          opacity: .98;
          mix-blend-mode: screen;
          animation: galaxy-breathe 8s ease-in-out infinite;
        }

        .urai-galaxy-band {
          left: 50%;
          top: 52%;
          width: 150vw;
          height: 42vh;
          transform: translate(-50%, -50%) rotate(-11deg);
          border-radius: 999px;
          background:
            radial-gradient(ellipse at 50% 50%, rgba(255,255,255,.32), rgba(125,211,252,.18) 26%, rgba(124,58,237,.12) 48%, transparent 72%);
          filter: blur(16px) saturate(1.35);
          opacity: .86;
          mix-blend-mode: screen;
        }

        .urai-galaxy-band-secondary {
          top: 48%;
          height: 31vh;
          transform: translate(-50%, -50%) rotate(17deg);
          opacity: .35;
          background: radial-gradient(ellipse at 50% 50%, rgba(167,243,208,.24), rgba(59,130,246,.14) 34%, transparent 74%);
        }

        .urai-galaxy-nebula-cloud {
          border-radius: 999px;
          filter: blur(36px) saturate(1.4);
          mix-blend-mode: screen;
          animation: nebula-drift 18s ease-in-out infinite;
        }

        .cloud-a {
          left: -8%;
          top: 18%;
          width: 56vw;
          height: 38vh;
          background: radial-gradient(ellipse at center, rgba(34,211,238,.24), rgba(59,130,246,.08) 42%, transparent 70%);
        }

        .cloud-b {
          right: -10%;
          top: 24%;
          width: 60vw;
          height: 46vh;
          background: radial-gradient(ellipse at center, rgba(168,85,247,.22), rgba(236,72,153,.08) 44%, transparent 72%);
          animation-delay: -6s;
        }

        .cloud-c {
          left: 22%;
          bottom: -14%;
          width: 68vw;
          height: 44vh;
          background: radial-gradient(ellipse at center, rgba(250,204,21,.14), rgba(45,212,191,.09) 38%, transparent 74%);
          animation-delay: -11s;
        }

        .urai-galaxy-rift {
          left: 50%;
          top: 52%;
          width: 130vw;
          height: 18vh;
          transform: translate(-50%, -50%) rotate(-11deg);
          border-radius: 999px;
          background: linear-gradient(90deg, transparent, rgba(0,2,10,.42), rgba(0,2,10,.26), transparent);
          filter: blur(15px);
          opacity: .8;
          mix-blend-mode: multiply;
        }

        .urai-galaxy-star-layer span,
        .urai-galaxy-dust-layer span {
          position: absolute;
          border-radius: 999px;
          transform: translate(-50%, -50%);
        }

        .urai-galaxy-star-layer.mid span {
          background: rgba(226, 246, 255, .9);
          box-shadow: 0 0 10px rgba(125,211,252,.55);
          opacity: .62;
          animation: star-twinkle 4.8s ease-in-out infinite;
        }

        .urai-galaxy-star-layer.foreground span {
          background: rgba(255,255,255,.96);
          box-shadow: 0 0 18px rgba(186,230,253,.85), 0 0 40px rgba(125,211,252,.28);
          opacity: .9;
          animation: star-twinkle 3.8s ease-in-out infinite;
        }

        .urai-galaxy-dust-layer span {
          width: 3px;
          height: 3px;
          background: rgba(253, 224, 71, .72);
          box-shadow: 0 0 18px rgba(253,224,71,.52);
          opacity: .46;
          animation: dust-float 7.5s ease-in-out infinite;
        }

        @keyframes galaxy-breathe {
          0%, 100% { transform: translate(-50%, -50%) rotate(-9deg) scale(1); opacity: .86; }
          50% { transform: translate(-50%, -50%) rotate(-9deg) scale(1.08); opacity: 1; }
        }

        @keyframes nebula-drift {
          0%, 100% { transform: translate3d(0,0,0) scale(1); }
          50% { transform: translate3d(2.5vw,-1.8vh,0) scale(1.06); }
        }

        @keyframes star-twinkle {
          0%, 100% { opacity: .42; transform: translate(-50%, -50%) scale(.82); }
          50% { opacity: 1; transform: translate(-50%, -50%) scale(1.3); }
        }

        @keyframes dust-float {
          0%, 100% { transform: translate3d(-50%, -50%, 0); opacity: .18; }
          50% { transform: translate3d(calc(-50% + 18px), calc(-50% - 22px), 0); opacity: .78; }
        }

        @media (max-width: 760px) {
          .urai-galaxy-core { height: 46vh; filter: blur(18px); }
          .urai-galaxy-band { height: 34vh; }
          .urai-galaxy-nebula-cloud { filter: blur(28px); opacity: .78; }
          .urai-galaxy-star-layer.foreground span { box-shadow: 0 0 12px rgba(186,230,253,.76); }
        }

        @media (prefers-reduced-motion: reduce) {
          .urai-galaxy-core,
          .urai-galaxy-nebula-cloud,
          .urai-galaxy-star-layer span,
          .urai-galaxy-dust-layer span {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}
