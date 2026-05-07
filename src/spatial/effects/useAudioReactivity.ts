import { useEffect, useRef, useState } from 'react';

export function useAudioReactivity(analyser?: AnalyserNode | null) {
  const [level, setLevel] = useState(0);
  const frameRef = useRef<number | null>(null);
  const lastLevelRef = useRef(0);

  useEffect(() => {
    if (!analyser || typeof window === 'undefined') {
      lastLevelRef.current = 0;
      setLevel(0);
      return undefined;
    }

    let cancelled = false;
    const data = new Uint8Array(analyser.frequencyBinCount);

    const tick = () => {
      if (cancelled) return;

      analyser.getByteFrequencyData(data);
      const avg = data.reduce((sum, value) => sum + value, 0) / data.length;
      const nextLevel = avg / 255;

      if (Math.abs(nextLevel - lastLevelRef.current) > 0.02) {
        lastLevelRef.current = nextLevel;
        setLevel(nextLevel);
      }

      frameRef.current = window.requestAnimationFrame(tick);
    };

    frameRef.current = window.requestAnimationFrame(tick);

    return () => {
      cancelled = true;
      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }
    };
  }, [analyser]);

  return level;
}

export default useAudioReactivity;
