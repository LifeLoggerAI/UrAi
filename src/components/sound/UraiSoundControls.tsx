'use client';

import React from 'react';
import { useUraiSound } from '@/providers/UraiSoundProvider';
import './UraiSoundControls.css';

type UraiSoundControlsProps = {
  compact?: boolean;
};

export const UraiSoundControls: React.FC<UraiSoundControlsProps> = ({ compact = false }) => {
  const { preference, setSoundEnabled, setAmbientEnabled, setVoiceEnabled, setVolume } = useUraiSound();

  return (
    <div className={`urai-sound-controls ${compact ? 'compact' : ''}`}>
      <div className="sound-control-group">
        <div className="sound-control">
          <label htmlFor="sound-enabled">Sound</label>
          <input
            id="sound-enabled"
            type="checkbox"
            checked={preference.enabled}
            onChange={e => setSoundEnabled(e.target.checked)}
          />
        </div>
        <div className="sound-control">
          <label htmlFor="ambient-enabled">Ambient</label>
          <input
            id="ambient-enabled"
            type="checkbox"
            checked={preference.ambientEnabled}
            onChange={e => setAmbientEnabled(e.target.checked)}
            disabled={!preference.enabled}
          />
        </div>
        <div className="sound-control">
          <label htmlFor="voice-enabled">Voice</label>
          <input
            id="voice-enabled"
            type="checkbox"
            checked={preference.voiceEnabled}
            onChange={e => setVoiceEnabled(e.target.checked)}
            disabled={!preference.enabled}
          />
        </div>
      </div>
      <div className="sound-control-group">
        <div className="sound-control volume-control">
          <label htmlFor="volume-slider">Volume</label>
          <input
            id="volume-slider"
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={preference.volume}
            onChange={e => setVolume(parseFloat(e.target.value))}
            disabled={!preference.enabled}
          />
        </div>
      </div>
      {!compact && (
        <p className="sound-disclaimer">
          Sound is optional. Playback is not recording.
        </p>
      )}
    </div>
  );
};
