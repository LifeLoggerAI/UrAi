'use client';

import { motion, Variants, Variant } from 'framer-motion';
import Link from 'next/link';
import { ElementType } from 'react';
import { Home, Map, Layers, Lock } from 'lucide-react';
import { UraiScene } from '@/lib/urai/scene-theme';

type Scene = 'home' | 'life-map' | 'replay' | 'passport';

const scenes: Record<Scene, { label: string; path: string; icon: ElementType }> = {
    home: { label: 'Home', path: '/', icon: Home },
    'life-map': { label: 'Life Map', path: '/life-map', icon: Map },
    replay: { label: 'Replay', path: '/replay', icon: Layers },
    passport: { label: 'Passport', path: '/passport', icon: Lock },
};

export type PortalNavProps = {
    activeScene: UraiScene;
    onNavigate: (scene: UraiScene) => void;
};

export const PortalNav = ({ activeScene, onNavigate }: PortalNavProps) => {
    const navVariants: Variants = {
        hidden: { y: 100, opacity: 0 },
        visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100, damping: 15 } },
    };

    return (
        <motion.nav
            variants={navVariants}
            initial="hidden"
            animate="visible"
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
            <ul className="flex items-center gap-2 rounded-full border border-white/10 bg-black/30 p-2 shadow-2xl backdrop-blur-xl">
                {(Object.keys(scenes) as Scene[]).map((scene) => {
                    const isActive = activeScene === scene;
                    const IconComponent = scenes[scene].icon;
                    return (
                        <li key={scene}>
                            <Link href={scenes[scene].path} passHref>
                                <motion.a
                                    onClick={() => onNavigate(scene)}
                                    className={`relative flex h-14 w-14 items-center justify-center rounded-full text-white/70 transition-colors hover:bg-white/10 hover:text-white`}
                                    aria-label={scenes[scene].label}
                                >
                                    <IconComponent />
                                    {isActive && (
                                        <motion.div
                                            layoutId="active-scene-indicator"
                                            className="absolute inset-0 rounded-full bg-white/10"
                                            style={{ borderRadius: 9999 }}
                                        />
                                    )}
                                </motion.a>
                            </Link>
                        </li>
                    );
                })}
            </ul>
        </motion.nav>
    );
};
