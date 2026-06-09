'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import './Replay.css';

const mockScenes = [
  {
    id: 'scene-1',
    title: 'The Clearing',
    state: 'recovery',
    era: 'Last Summer',
    narratorLine: 'A moment of quiet clarity, when the fog lifted and the path forward seemed possible.',
  },
  {
    id: 'scene-2',
    title: 'Shared Silence',
    state: 'bond',
    era: 'Two Years Ago',
    narratorLine: 'No words were needed. In the quiet space between, a universe of understanding was found.',
  },
    {
    id: 'scene-3',
    title: 'The Edge of the World',
    state: 'threshold',
    era: 'Childhood',
    narratorLine: 'Standing at the precipice of a great unknown, fear and wonder intertwined.',
  },
  {
    id: 'scene-4',
    title: 'Midnight Haze',
    state: 'blueFog',
    era: 'Last Month',
    narratorLine: 'A period of uncertainty, where thoughts drifted like smoke and clarity was a distant shore.',
  },
  {
    id: 'scene-5',
    title: 'Rearview Mirror',
    state: 'reflection',
    era: 'A Decade Ago',
    narratorLine: 'Looking back, the patterns became clear, a map drawn from moments of impact.',
  },
];

export default function Replay() {
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isChanging, setIsChanging] = useState(false);
  const router = useRouter();
  
  const currentScene = mockScenes[currentSceneIndex];

  const changeScene = useCallback((newIndex: number) => {
    setIsChanging(true);
    setTimeout(() => {
        setCurrentSceneIndex(newIndex);
        setIsChanging(false);
    }, 500); // match CSS transition duration
  }, []);

  const goToNextScene = useCallback(() => {
    const nextIndex = (currentSceneIndex + 1) % mockScenes.length;
    changeScene(nextIndex);
  }, [currentSceneIndex, changeScene]);

  const goToPrevScene = () => {
    const prevIndex = (currentSceneIndex - 1 + mockScenes.length) % mockScenes.length;
    changeScene(prevIndex);
  };

  useEffect(() => {
    if (isPlaying) {
      const timer = setTimeout(goToNextScene, 7000); // Auto-advance every 7 seconds
      return () => clearTimeout(timer);
    }
  }, [currentSceneIndex, isPlaying, goToNextScene]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const progress = (currentSceneIndex / (mockScenes.length -1)) * 100;

  return (
    <div className="replayScene">
      <div className="replayBackground" data-state={currentScene.state}></div>
      <div className={`replayStage ${isChanging ? 'scene-changing' : ''}`}>
          <div className="replayOrb" />
          <div className="sceneState">{currentScene.state}</div>
          <h1 className="sceneTitle">{currentScene.title}</h1>
          <p className="sceneNarratorLine">&ldquo;{currentScene.narratorLine}&rdquo;</p>
          <div className="sceneEra">{currentScene.era}</div>
      </div>

      <div className="replayControls">
          <button onClick={goToPrevScene} aria-label="Previous Scene">&#x276E;</button>
          <button onClick={togglePlay} className="playPauseButton" aria-label={isPlaying ? 'Pause' : 'Play'}>
              {isPlaying ? '||' : '\u25B6'}
          </button>
          <button onClick={goToNextScene} aria-label="Next Scene">&#x276F;</button>
      </div>

      <div className="replayTimeline">
          <div className="timelineProgress" style={{width: `${progress}%`}}></div>
      </div>

       <nav className="replayNav">
        <Link href="/home">Home</Link>
        <Link href="/galaxy">Galaxy</Link>
        <Link href="/passport">Passport</Link>
      </nav>

       <button onClick={() => router.push('/home')} className="returnToFieldReplay">
        Return to Field
      </button>
    </div>
  );
}
