"use client";

import React, { useState } from 'react';
import { GenesisOrb } from './GenesisOrb';
import { CompanionShell } from '@/components/companion';
import { useUraiSound } from '@/providers/UraiSoundProvider';
import './Genesis.css';

/**
 * The root component for the URAI Genesis visual experience.
 * It renders the ambient background and the central interactive orb.
 * This component is intended to be a singleton, rendered in the background of the main app layout.
 */
export const Genesis = () => {
  const [isCompanionOpen, setIsCompanionOpen] = useState(false);
  const { playSound } = useUraiSound();

  const handleOpenCompanion = () => {
    playSound("orb_open");
    setIsCompanionOpen(true);
  };

  const handleCloseCompanion = () => {
    playSound("orb_close");
    setIsCompanionOpen(false);
  };

  return (
    <div className="genesis-container">
      <div className="genesis-background" />
      <GenesisOrb onOpenCompanion={handleOpenCompanion} />
      <CompanionShell isOpen={isCompanionOpen} onClose={handleCloseCompanion} />
    </div>
  );
};
