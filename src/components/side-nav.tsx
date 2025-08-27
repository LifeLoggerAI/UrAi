
'use client';

import {
  BrainCircuit,
  Cloud,
  Footprints,
  Hand,
  Mic,
  Settings,
  Spade,
  Sprout,
  User as UserIcon,
} from 'lucide-react';
import { Button } from './ui/button';
import {
  Tooltip,
  TooltipProvider,
  TooltipContent,
  TooltipTrigger,
} from './ui/tooltip';

const navItems = [
  { panel: 'sky', label: 'Cognitive Mirror (Sky)', icon: Cloud },
  { panel: 'head', label: 'Cognitive Zone (Head)', icon: BrainCircuit },
  { panel: 'torso', label: 'Core Self (Torso)', icon: Mic },
  { panel: 'arms', label: 'Action & Connection (Arms)', icon: Hand },
  { panel: 'legs', label: 'Foundation (Legs)', icon: Footprints },
  { panel: 'ground', label: 'Inner Ground', icon: Spade },
  { panel: 'symbolic', label: 'Symbolic Insights', icon: Sprout },
  { panel: 'companion', label: 'AI Companion', icon: UserIcon },
  { panel: 'settings', label: 'Settings', icon: Settings },
];

export function SideNav({ onNavClick }: { onNavClick: (panel: string) => void; }) {
  return (
    <aside className="h-full w-16 bg-card border-r flex flex-col items-center py-4 gap-4 z-20">
      <TooltipProvider>
        {navItems.map(item => (
          <Tooltip key={item.panel}>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onNavClick(item.panel)}
              >
                <item.icon className="h-6 w-6" />
                <span className="sr-only">{item.label}</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>{item.label}</p>
            </TooltipContent>
          </Tooltip>
        ))}
      </TooltipProvider>
    </aside>
  );
}
