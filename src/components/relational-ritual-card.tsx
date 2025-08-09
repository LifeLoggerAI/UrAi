"use client";

import { useState } from "react";
import { Flame, Heart, MessageSquare, Shield, DoorOpen, Sparkles, Check } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface RelationalRitual {
  uid: string;
  contactId: string;
  ritualId: string;
  suggestedAt: number;
  type: string;
  prompt: string;
  reason: string;
  symbolicAsset: string;
  auraShiftIfCompleted: {
    before: string;
    after: string;
  };
  status: "suggested" | "completed";
}

interface RelationalRitualCardProps {
  rituals: RelationalRitual[];
  onRitualComplete?: (ritual: RelationalRitual) => void;
  onRitualDismiss?: (ritual: RelationalRitual) => void;
}

export function RelationalRitualCard({ rituals, onRitualComplete, onRitualDismiss }: RelationalRitualCardProps) {
  const [completingRituals, setCompletingRituals] = useState<Set<string>>(new Set());

  const getRitualIcon = (type: string, symbolicAsset?: string) => {
    // First check symbolic asset
    if (symbolicAsset?.includes("flame") || symbolicAsset?.includes("candle")) {
      return <Flame className="h-5 w-5" />;
    }
    if (symbolicAsset?.includes("page") || symbolicAsset?.includes("letter")) {
      return <MessageSquare className="h-5 w-5" />;
    }
    if (symbolicAsset?.includes("door") || symbolicAsset?.includes("window")) {
      return <DoorOpen className="h-5 w-5" />;
    }
    if (symbolicAsset?.includes("shield") || symbolicAsset?.includes("seal")) {
      return <Shield className="h-5 w-5" />;
    }

    // Then check ritual type
    switch (type.toLowerCase()) {
      case "silent flame":
        return <Flame className="h-5 w-5" />;
      case "echo message":
        return <MessageSquare className="h-5 w-5" />;
      case "boundary seal":
        return <Shield className="h-5 w-5" />;
      case "memory garden":
        return <Heart className="h-5 w-5" />;
      case "open door sound":
        return <DoorOpen className="h-5 w-5" />;
      default:
        return <Sparkles className="h-5 w-5" />;
    }
  };

  const getRitualColor = (type: string, symbolicAsset?: string) => {
    if (symbolicAsset?.includes("flame") || type.toLowerCase().includes("flame")) {
      return "from-orange-500/20 to-red-500/20 border-orange-500/50";
    }
    if (symbolicAsset?.includes("page") || type.toLowerCase().includes("message")) {
      return "from-blue-500/20 to-indigo-500/20 border-blue-500/50";
    }
    if (symbolicAsset?.includes("shield") || type.toLowerCase().includes("boundary")) {
      return "from-green-500/20 to-emerald-500/20 border-green-500/50";
    }
    if (symbolicAsset?.includes("door") || type.toLowerCase().includes("door")) {
      return "from-purple-500/20 to-violet-500/20 border-purple-500/50";
    }
    return "from-gray-500/20 to-slate-500/20 border-gray-500/50";
  };

  const getAuraColor = (color: string) => {
    switch (color.toLowerCase()) {
      case "rose":
      case "pink":
        return "bg-rose-400";
      case "lavender":
      case "purple":
        return "bg-purple-400";
      case "blue":
        return "bg-blue-400";
      case "green":
        return "bg-green-400";
      case "gold":
      case "warm-gold":
        return "bg-yellow-400";
      case "gray":
        return "bg-gray-400";
      default:
        return "bg-gray-400";
    }
  };

  const handleCompleteRitual = async (ritual: RelationalRitual) => {
    setCompletingRituals(prev => new Set(prev).add(ritual.ritualId));
    
    try {
      await onRitualComplete?.(ritual);
    } finally {
      setCompletingRituals(prev => {
        const next = new Set(prev);
        next.delete(ritual.ritualId);
        return next;
      });
    }
  };

  const suggestedRituals = rituals.filter(r => r.status === "suggested");
  const completedRituals = rituals.filter(r => r.status === "completed");

  if (rituals.length === 0) {
    return (
      <Card className="w-full h-48 flex items-center justify-center">
        <CardContent className="text-center">
          <Sparkles className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground">No rituals suggested yet</p>
          <p className="text-sm text-muted-foreground/70 mt-2">
            Symbolic healing actions will appear as relationship patterns emerge
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Suggested Rituals */}
      {suggestedRituals.length > 0 && (
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              Suggested Rituals
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Symbolic actions to heal, release, or honor your relationships
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {suggestedRituals.map((ritual) => (
                <div
                  key={ritual.ritualId}
                  className={cn(
                    "relative border rounded-lg p-4 bg-gradient-to-br",
                    getRitualColor(ritual.type, ritual.symbolicAsset)
                  )}
                >
                  {/* Ritual Header */}
                  <div className="flex items-start gap-3 mb-3">
                    <div className="p-2 rounded-full bg-white/20 backdrop-blur-sm">
                      {getRitualIcon(ritual.type, ritual.symbolicAsset)}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium mb-1">{ritual.type}</h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        {ritual.reason}
                      </p>
                      <p className="text-sm leading-relaxed italic">
                        &quot;{ritual.prompt}&quot;
                      </p>
                    </div>
                  </div>

                  {/* Aura Shift Preview */}
                  <div className="flex items-center gap-2 mb-4 text-xs">
                    <span className="text-muted-foreground">Aura shift:</span>
                    <div className="flex items-center gap-1">
                      <div className={cn("w-3 h-3 rounded-full", getAuraColor(ritual.auraShiftIfCompleted.before))} />
                      <span>&rarr;</span>
                      <div className={cn("w-3 h-3 rounded-full", getAuraColor(ritual.auraShiftIfCompleted.after))} />
                    </div>
                    <span className="text-muted-foreground">
                      {ritual.auraShiftIfCompleted.before} &rarr; {ritual.auraShiftIfCompleted.after}
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-muted-foreground">
                      Suggested {format(new Date(ritual.suggestedAt), "MMM d, h:mm a")}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onRitualDismiss?.(ritual)}
                        className="text-xs"
                      >
                        Later
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleCompleteRitual(ritual)}
                        disabled={completingRituals.has(ritual.ritualId)}
                        className="text-xs"
                      >
                        {completingRituals.has(ritual.ritualId) ? (
                          <>
                            <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin mr-1" />
                            Completing&hellip;
                          </>
                        ) : (
                          <>
                            <Check className="h-3 w-3 mr-1" />
                            Complete
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Completed Rituals */}
      {completedRituals.length > 0 && (
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Check className="h-5 w-5 text-green-500" />
              Completed Rituals
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Your journey of symbolic healing and release
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {completedRituals.slice(0, 5).map((ritual) => (
                <div
                  key={ritual.ritualId}
                  className="flex items-center gap-3 p-3 border rounded-lg bg-green-50/50 border-green-200/50"
                >
                  <div className="p-1.5 rounded-full bg-green-100">
                    {getRitualIcon(ritual.type, ritual.symbolicAsset)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-sm">{ritual.type}</span>
                      <Badge variant="secondary" className="text-xs">
                        Completed
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {ritual.reason}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className={cn("w-2 h-2 rounded-full", getAuraColor(ritual.auraShiftIfCompleted.after))} />
                  </div>
                </div>
              ))}
              {completedRituals.length > 5 && (
                <div className="text-center py-2">
                  <Button variant="ghost" size="sm" className="text-xs">
                    View all {completedRituals.length} completed rituals
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}