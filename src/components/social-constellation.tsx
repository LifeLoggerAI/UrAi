"use client";

import { useState, useEffect } from "react";
import { User } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface SocialConnection {
  uid: string;
  contactId: string;
  voiceImprint: {
    firstHeard: number;
    lastHeard: number;
    totalDuration: number;
    dominantEmotion: string;
    patternLabel: string;
  };
  archetype: string;
  conflictEvents: Array<{
    timestamp: number;
    label: string;
  }>;
  lastPatternShift: number;
  tags: string[];
  constellationStrength: number;
}

interface SocialConstellationProps {
  connections: SocialConnection[];
  onConnectionClick?: (connection: SocialConnection) => void;
}

export function SocialConstellation({ connections, onConnectionClick }: SocialConstellationProps) {
  const [hoveredConnection, setHoveredConnection] = useState<string | null>(null);

  const getArchetypeColor = (archetype: string) => {
    switch (archetype) {
      case "The Confidant":
        return "bg-emerald-500/20 border-emerald-500";
      case "The Challenger":
        return "bg-red-500/20 border-red-500";
      case "The Ghost":
        return "bg-gray-500/20 border-gray-500";
      case "The Guide":
        return "bg-blue-500/20 border-blue-500";
      case "The Mirror":
        return "bg-purple-500/20 border-purple-500";
      default:
        return "bg-slate-500/20 border-slate-500";
    }
  };

  const getEmotionColor = (emotion: string) => {
    if (emotion.includes("warm") || emotion.includes("joy") || emotion.includes("love")) {
      return "text-rose-400";
    }
    if (emotion.includes("calm") || emotion.includes("peace") || emotion.includes("comfort")) {
      return "text-blue-400";
    }
    if (emotion.includes("distant") || emotion.includes("cold") || emotion.includes("silence")) {
      return "text-gray-400";
    }
    if (emotion.includes("tension") || emotion.includes("conflict") || emotion.includes("anger")) {
      return "text-red-400";
    }
    return "text-amber-400";
  };

  const getConstellationSize = (strength: number) => {
    if (strength > 0.8) return "w-16 h-16";
    if (strength > 0.5) return "w-12 h-12";
    return "w-8 h-8";
  };

  const getGlowIntensity = (strength: number) => {
    if (strength > 0.8) return "shadow-lg shadow-current/50";
    if (strength > 0.5) return "shadow-md shadow-current/30";
    return "shadow-sm shadow-current/20";
  };

  if (connections.length === 0) {
    return (
      <Card className="w-full h-64 flex items-center justify-center">
        <CardContent className="text-center">
          <User className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground">Your social constellation is forming...</p>
          <p className="text-sm text-muted-foreground/70 mt-2">
            Mention someone in a voice note to begin mapping your relationships
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Social Constellation
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Your relationship patterns and emotional orbits
        </p>
      </CardHeader>
      <CardContent>
        <div className="relative min-h-[300px] p-8 bg-gradient-to-br from-slate-950 to-slate-900 rounded-lg overflow-hidden">
          {/* Central user node */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="w-6 h-6 bg-white rounded-full shadow-lg shadow-white/50 animate-pulse" />
            <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-white/70">
              You
            </div>
          </div>

          {/* Connection nodes arranged in orbit */}
          {connections.map((connection, index) => {
            const angle = (index * 360) / connections.length;
            const radius = 80 + connection.constellationStrength * 40;
            const x = Math.cos((angle * Math.PI) / 180) * radius;
            const y = Math.sin((angle * Math.PI) / 180) * radius;

            return (
              <div
                key={connection.contactId}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
                style={{
                  left: `calc(50% + ${x}px)`,
                  top: `calc(50% + ${y}px)`,
                }}
                onMouseEnter={() => setHoveredConnection(connection.contactId)}
                onMouseLeave={() => setHoveredConnection(null)}
                onClick={() => onConnectionClick?.(connection)}
              >
                {/* Connection line to center */}
                <svg
                  className="absolute top-1/2 left-1/2 pointer-events-none"
                  style={{
                    width: radius * 2 + 50,
                    height: radius * 2 + 50,
                    transform: `translate(-50%, -50%) rotate(${angle + 180}deg)`,
                  }}
                >
                  <line
                    x1="50%"
                    y1="50%"
                    x2={`${50 - (radius / (radius * 2 + 50)) * 100}%`}
                    y2="50%"
                    stroke="currentColor"
                    strokeWidth="1"
                    className={cn(
                      "transition-opacity",
                      connection.conflictEvents.length > 0 
                        ? "text-red-500/30 stroke-dasharray-[5,5]" 
                        : "text-white/20"
                    )}
                  />
                </svg>

                {/* Connection node */}
                <div
                  className={cn(
                    "relative rounded-full border-2 flex items-center justify-center transition-all duration-300",
                    getArchetypeColor(connection.archetype),
                    getConstellationSize(connection.constellationStrength),
                    getGlowIntensity(connection.constellationStrength),
                    hoveredConnection === connection.contactId && "scale-110 z-10"
                  )}
                >
                  <User 
                    className={cn(
                      "transition-colors",
                      getEmotionColor(connection.voiceImprint.dominantEmotion)
                    )} 
                    size={connection.constellationStrength > 0.5 ? 24 : 16} 
                  />
                  
                  {/* Shadow loop indicator */}
                  {connection.conflictEvents.length > 2 && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                  )}
                </div>

                {/* Hover tooltip */}
                {hoveredConnection === connection.contactId && (
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 z-20">
                    <div className="bg-black/90 text-white text-xs rounded-lg p-3 whitespace-nowrap max-w-48">
                      <div className="font-medium mb-1">{connection.archetype}</div>
                      <div className="text-white/70 mb-1">
                        {connection.voiceImprint.dominantEmotion}
                      </div>
                      <div className="flex gap-1 flex-wrap">
                        {connection.tags.slice(0, 3).map((tag) => (
                          <Badge 
                            key={tag} 
                            variant="secondary" 
                            className="text-xs px-1 py-0"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      {connection.conflictEvents.length > 0 && (
                        <div className="text-red-400 text-xs mt-1">
                          {connection.conflictEvents.length} shadow event{connection.conflictEvents.length !== 1 ? 's' : ''}
                        </div>
                      )}
                    </div>
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-black/90" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-emerald-500/50 border border-emerald-500" />
            <span>Confidant</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500/50 border border-red-500" />
            <span>Challenger</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-gray-500/50 border border-gray-500" />
            <span>Ghost</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500/50 border border-blue-500" />
            <span>Guide</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}