'use client';

import React from 'react';
import Link from 'next/link';
import { Home, Star, BarChart2, MessageSquare, Sun } from 'lucide-react';

const BottomNav = () => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black/50 backdrop-blur-md h-20 flex justify-around items-center">
      <Link href="/home" className="flex flex-col items-center text-white/70 hover:text-white">
        <Home />
        <span className="text-xs">Home</span>
      </Link>
      <Link href="/life-map" className="flex flex-col items-center text-white/70 hover:text-white">
        <Star />
        <span className="text-xs">Life Map</span>
      </Link>
      <div className="w-16 h-16 bg-blue-500 rounded-full shadow-lg"></div>
      <Link href="/cognitive-mirror" className="flex flex-col items-center text-white/70 hover:text-white">
        <BarChart2 />
        <span className="text-xs">Mirror</span>
      </Link>
      <Link href="/narrator" className="flex flex-col items-center text-white/70 hover:text-white">
        <MessageSquare />
        <span className="text-xs">Narrator</span>
      </Link>
    </div>
  );
};

export default BottomNav;
