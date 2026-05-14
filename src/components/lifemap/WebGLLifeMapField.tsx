'use client';

import { useEffect, useRef } from 'react';

type Star = {
  x: number;
  y: number;
  z: number;
  size: number;
  hue: number;
  speed: number;
};

const STAR_COUNT = 420;
const DEPTH = 900;

function createStars(): Star[] {
  return Array.from({ length: STAR_COUNT }, (_, index) => {
    const ring = index / STAR_COUNT;
    const angle = index * 2.399963229728653;
    const radius = 0.16 + Math.sqrt(ring) * 0.84;
    return {
      x: Math.cos(angle) * radius * 620 + (Math.random() - 0.5) * 120,
      y: Math.sin(angle) * radius * 360 + (Math.random() - 0.5) * 90,
      z: -Math.random() * DEPTH,
      size: 1.1 + Math.random() * 3.4,
      hue: 195 + Math.random() * 72,
      speed: 0.22 + Math.random() * 0.72,
    };
  });
}

function drawStar(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, alpha: number, hue: number) {
  const glow = ctx.createRadialGradient(x, y, 0, x, y, size * 6.5);
  glow.addColorStop(0, `hsla(${hue}, 100%, 92%, ${alpha})`);
  glow.addColorStop(0.28, `hsla(${hue}, 96%, 72%, ${alpha * 0.42})`);
  glow.addColorStop(1, `hsla(${hue}, 90%, 55%, 0)`);
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(x, y, size * 6.5, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = `hsla(${hue}, 100%, 96%, ${Math.min(1, alpha + 0.18)})`;
  ctx.beginPath();
  ctx.arc(x, y, Math.max(0.7, size * 0.78), 0, Math.PI * 2);
  ctx.fill();
}

export default function WebGLLifeMapField() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const starsRef = useRef<Star[] | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || typeof window === 'undefined') return undefined;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return undefined;

    starsRef.current = createStars();
    let animationFrame = 0;
    let disposed = false;

    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      canvas.width = Math.max(1, Math.floor(rect.width * ratio));
      canvas.height = Math.max(1, Math.floor(rect.height * ratio));
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    };

    const render = (time: number) => {
      if (disposed || !starsRef.current) return;

      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      const centerX = width / 2;
      const centerY = height / 2;
      const driftX = Math.sin(time * 0.00012) * 28;
      const driftY = Math.cos(time * 0.0001) * 18;

      ctx.clearRect(0, 0, width, height);

      const gradient = ctx.createRadialGradient(centerX, centerY * 0.55, 0, centerX, centerY * 0.55, Math.max(width, height) * 0.72);
      gradient.addColorStop(0, 'rgba(80, 112, 220, 0.22)');
      gradient.addColorStop(0.36, 'rgba(26, 38, 84, 0.16)');
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      for (const star of starsRef.current) {
        if (!reduceMotion) {
          star.z += star.speed;
          if (star.z > 18) {
            star.z = -DEPTH;
            star.x = (Math.random() - 0.5) * 980;
            star.y = (Math.random() - 0.5) * 620;
          }
        }

        const perspective = 520 / (520 - star.z);
        const x = centerX + (star.x + driftX) * perspective;
        const y = centerY + (star.y + driftY) * perspective;
        const alpha = Math.max(0.08, Math.min(0.95, perspective * 0.62));
        const size = star.size * Math.max(0.42, perspective);

        if (x < -40 || x > width + 40 || y < -40 || y > height + 40) continue;
        drawStar(ctx, x, y, size, alpha, star.hue);
      }

      ctx.save();
      ctx.globalAlpha = 0.36;
      ctx.strokeStyle = 'rgba(190, 220, 255, 0.15)';
      ctx.lineWidth = 1;
      for (let i = 0; i < 4; i += 1) {
        const radiusX = width * (0.18 + i * 0.095);
        const radiusY = height * (0.055 + i * 0.032);
        ctx.beginPath();
        ctx.ellipse(centerX, height * 0.73, radiusX, radiusY, 0, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.restore();

      animationFrame = window.requestAnimationFrame(render);
    };

    resize();
    window.addEventListener('resize', resize);
    animationFrame = window.requestAnimationFrame(render);

    return () => {
      disposed = true;
      window.removeEventListener('resize', resize);
      window.cancelAnimationFrame(animationFrame);
    };
  }, []);

  return <canvas ref={canvasRef} className="webgl-life-map-field" aria-hidden />;
}
