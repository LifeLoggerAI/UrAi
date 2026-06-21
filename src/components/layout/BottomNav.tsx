'use client';

import Link from 'next/link';
import { Home, Star, BarChart2, MessageSquare } from 'lucide-react';

const itemClass = 'flex min-w-12 flex-col items-center gap-1 text-[10px] font-medium text-white/60 transition hover:text-white sm:min-w-16 sm:text-xs';

const BottomNav = () => {
  return (
    <nav
      aria-label="Primary URAI navigation"
      className="fixed inset-x-3 bottom-3 z-50 mx-auto flex h-16 max-w-3xl items-center justify-around rounded-[2rem] border border-white/10 bg-black/70 px-4 shadow-2xl shadow-black/50 backdrop-blur-xl sm:bottom-5 sm:h-18"
    >
      <Link href="/home" className={itemClass}>
        <Home className="h-5 w-5" />
        <span>Home</span>
      </Link>
      <Link href="/life-map" className={itemClass}>
        <Star className="h-5 w-5" />
        <span>Life Map</span>
      </Link>
      <Link
        href="/demo"
        aria-label="Open URAI demo"
        className="-mt-6 grid h-14 w-14 place-items-center rounded-full border border-cyan-200/40 bg-cyan-200 text-slate-950 shadow-[0_0_35px_rgba(103,232,249,0.35)] transition hover:scale-105 sm:h-16 sm:w-16"
      >
        <span className="h-5 w-5 rounded-full bg-slate-950/80" />
      </Link>
      <Link href="/mirror" className={itemClass}>
        <BarChart2 className="h-5 w-5" />
        <span>Mirror</span>
      </Link>
      <Link href="/demo" className={itemClass}>
        <MessageSquare className="h-5 w-5" />
        <span>Narrator</span>
      </Link>
    </nav>
  );
};

export default BottomNav;
