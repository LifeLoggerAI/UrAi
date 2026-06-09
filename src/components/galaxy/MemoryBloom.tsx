'use client';

import { useEffect } from 'react';
import type { MemoryStar } from './LifeMap';
import './MemoryBloom.css';

type MemoryBloomProps = {
  star: MemoryStar;
  onClose: () => void;
};

export default function MemoryBloom({ star, onClose }: MemoryBloomProps) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  const getRelatedFieldStates = (state: string) => {
    switch (state) {
      case 'recovery': return ['Clarity', 'Growth'];
      case 'bond': return ['Connection', 'Trust'];
      case 'threshold': return ['Change', 'Opportunity'];
      case 'blueFog': return ['Uncertainty', 'Drift'];
      case 'reflection': return ['Insight', 'Pattern'];
      default: return ['Unknown'];
    }
  }

  return (
    <div className="memoryBloomOverlay" onClick={onClose}>
      <div className="memoryBloomContent" data-state={star.state} onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="bloomCloseButton">×</button>
        <div className="bloomAura">
            <div className="ring"></div>
            <div className="ring"></div>
            <div className="ring"></div>
            <div className="ring"></div>
        </div>
        <div className="bloomState">{star.state.replace(/([A-Z])/g, ' $1')}</div>
        <h1 className="bloomTitle">{star.title}</h1>
        <p className="bloomNarratorLine">&ldquo;{star.narratorLine}&rdquo;</p>
        <div className="bloomMetadata">
            <div className="metaItem">
                <strong>Era</strong>
                <span>{star.era}</span>
            </div>
            <div className="metaItem">
                <strong>Intensity</strong>
                <span>{star.intensity.toFixed(1)}</span>
            </div>
            <div className="metaItem">
                <strong>Field States</strong>
                <span>{getRelatedFieldStates(star.state).join(', ')}</span>
            </div>
        </div>
      </div>
    </div>
  );
}
