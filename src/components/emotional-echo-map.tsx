"use client";

import { useState } from "react";
import { Activity, AlertTriangle, TrendingDown, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface EmotionalEcho {
  uid: string;
  contactId: string;
  timestamp: number;
  interactionType: "voice" | "text" | "in-person";
  duration: number;
  preState: string;
  postState: string;
  emotionalDelta: string;
  loopDetected: boolean;
  loopLabel?: string;
  tags: string[];
  intensityScore: number;
}

interface EmotionalEchoMapProps {
  echoes: EmotionalEcho[];
  contacts?: { [contactId: string]: { name: string; archetype?: string } };
}

export function EmotionalEchoMap({ echoes, contacts = {} }: EmotionalEchoMapProps) {
  const [selectedContact, setSelectedContact] = useState<string | null>(null);
  const [selectedTimeRange, setSelectedTimeRange] = useState<"day" | "week" | "month">("week");

  const getTimeRangeFilter = () => {
    const now = Date.now();
    switch (selectedTimeRange) {
      case "day":
        return now - 24 * 60 * 60 * 1000;
      case "week":
        return now - 7 * 24 * 60 * 60 * 1000;
      case "month":
        return now - 30 * 24 * 60 * 60 * 1000;
      default:
        return now - 7 * 24 * 60 * 60 * 1000;
    }
  };

  const filteredEchoes = echoes.filter(echo => {
    const timeFilter = echo.timestamp >= getTimeRangeFilter();
    const contactFilter = selectedContact ? echo.contactId === selectedContact : true;
    return timeFilter && contactFilter;
  });

  const getIntensityColor = (intensity: number) => {
    if (intensity > 0.7) return "text-red-500 bg-red-50 border-red-200";
    if (intensity > 0.4) return "text-orange-500 bg-orange-50 border-orange-200";
    return "text-green-500 bg-green-50 border-green-200";
  };

  const getIntensityIcon = (intensity: number) => {
    if (intensity > 0.7) return <TrendingDown className="h-4 w-4" />;
    if (intensity > 0.4) return <Activity className="h-4 w-4" />;
    return <TrendingUp className="h-4 w-4" />;
  };

  const getDeltaColor = (delta: string) => {
    if (delta.includes("drain") || delta.includes("exhausted") || delta.includes("heavy")) {
      return "text-red-600";
    }
    if (delta.includes("lift") || delta.includes("energized") || delta.includes("light")) {
      return "text-green-600";
    }
    if (delta.includes("confused") || delta.includes("uncertain") || delta.includes("mixed")) {
      return "text-purple-600";
    }
    return "text-gray-600";
  };

  const getContactName = (contactId: string) => {
    return contacts[contactId]?.name || `Contact ${contactId.slice(-4)}`;
  };

  const uniqueContacts = Array.from(new Set(filteredEchoes.map(e => e.contactId)));
  const loopDetectedCount = filteredEchoes.filter(e => e.loopDetected).length;
  const highIntensityCount = filteredEchoes.filter(e => e.intensityScore > 0.7).length;

  if (echoes.length === 0) {
    return (
      <Card className="w-full h-48 flex items-center justify-center">
        <CardContent className="text-center">
          <Activity className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground">No emotional echoes detected yet</p>
          <p className="text-sm text-muted-foreground/70 mt-2">
            Start tracking how interactions affect your emotional state
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Emotional Echo Map
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          How interactions affect your emotional state afterwards
        </p>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 pt-2">
          <div className="flex gap-1">
            {(["day", "week", "month"] as const).map((range) => (
              <button
                key={range}
                onClick={() => setSelectedTimeRange(range)}
                className={cn(
                  "px-3 py-1 text-xs rounded-md transition-colors",
                  selectedTimeRange === range
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted hover:bg-muted/80"
                )}
              >
                {range === "day" ? "24h" : range === "week" ? "7d" : "30d"}
              </button>
            ))}
          </div>
          
          {uniqueContacts.length > 1 && (
            <select
              value={selectedContact || ""}
              onChange={(e) => setSelectedContact(e.target.value || null)}
              className="px-3 py-1 text-xs border rounded-md bg-background"
            >
              <option value="">All contacts</option>
              {uniqueContacts.map((contactId) => (
                <option key={contactId} value={contactId}>
                  {getContactName(contactId)}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Stats */}
        <div className="flex gap-4 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-red-500" />
            <span>{loopDetectedCount} loops detected</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-orange-500" />
            <span>{highIntensityCount} high intensity</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-blue-500" />
            <span>{filteredEchoes.length} total echoes</span>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-3">
            {filteredEchoes
              .sort((a, b) => b.timestamp - a.timestamp)
              .map((echo, index) => (
                <div
                  key={`${echo.contactId}-${echo.timestamp}-${index}`}
                  className={cn(
                    "border rounded-lg p-4 transition-all duration-200",
                    getIntensityColor(echo.intensityScore)
                  )}
                >
                  {/* Echo Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      {getIntensityIcon(echo.intensityScore)}
                      <div>
                        <div className="font-medium text-sm">
                          {getContactName(echo.contactId)}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {echo.interactionType} • {Math.floor(echo.duration / 60)}m {echo.duration % 60}s
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {echo.loopDetected && (
                        <AlertTriangle className="h-4 w-4 text-orange-500" />
                      )}
                      <Badge 
                        variant="outline" 
                        className={cn("text-xs", getIntensityColor(echo.intensityScore).split(" ")[0])}
                      >
                        {echo.intensityScore.toFixed(1)}
                      </Badge>
                    </div>
                  </div>

                  {/* Emotional States */}
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div>
                      <div className="text-xs text-muted-foreground mb-1">Before</div>
                      <div className="text-sm font-medium">{echo.preState}</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground mb-1">After</div>
                      <div className="text-sm font-medium">{echo.postState}</div>
                    </div>
                  </div>

                  {/* Emotional Delta */}
                  <div className="mb-3">
                    <div className="text-xs text-muted-foreground mb-1">Emotional Change</div>
                    <div className={cn("text-sm font-medium", getDeltaColor(echo.emotionalDelta))}>
                      {echo.emotionalDelta}
                    </div>
                  </div>

                  {/* Loop Detection */}
                  {echo.loopDetected && echo.loopLabel && (
                    <div className="mb-3 p-2 bg-orange-50 border border-orange-200 rounded">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="h-3 w-3 text-orange-600" />
                        <span className="text-xs font-medium text-orange-800">
                          Pattern Loop: {echo.loopLabel}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Tags and Timestamp */}
                  <div className="flex items-center justify-between">
                    <div className="flex gap-1 flex-wrap">
                      {echo.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs px-2 py-0">
                          {tag}
                        </Badge>
                      ))}
                      {echo.tags.length > 3 && (
                        <Badge variant="outline" className="text-xs px-2 py-0">
                          +{echo.tags.length - 3}
                        </Badge>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {format(new Date(echo.timestamp), "MMM d, h:mm a")}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </ScrollArea>

        {filteredEchoes.length === 0 && echoes.length > 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Activity className="mx-auto h-8 w-8 mb-2 opacity-50" />
            <p>No echoes found for the selected filters</p>
            <p className="text-xs mt-1">Try adjusting the time range or contact filter</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}