'use client';

import { useEffect } from 'react';
import type { MemoryStar } from '@/components/urai/data/memoryStars';
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

  const getRelatedFieldStates = (category: string) => {
    switch (category) {
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
      <div className="memoryBloomContent" data-state={star.category} onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="bloomCloseButton">×</button>
        <div className="bloomAura">
            <div className="ring"></div>
            <div className="ring"></div>
            <div className="ring"></div>
            <div className="ring"></div>
        </div>
        <div className="bloomState">{star.category.replace(/([A-Z])/g, ' $1')}</div>
        <h1 className="bloomTitle">{star.title}</h1>
        <p className="bloomNarratorLine">&ldquo;{star.narratorText}&rdquo;</p>
        <div className="bloomMetadata">
            <div className="metaItem">
                <strong>Era</strong>
                <span>{star.dateLabel}</span>
            </div>
            <div className="metaItem">
                <strong>Intensity</strong>
                <span>{star.magnitude.toFixed(1)}</span>
            </div>
            <div className="metaItem">
                <strong>Field States</strong>
                <span>{getRelatedFieldStates(star.category).join(', ')}</span>
            </div>
        </div>
      </div>
    </div>
  );
}
