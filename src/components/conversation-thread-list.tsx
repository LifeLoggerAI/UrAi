"use client";

import { useState } from "react";
import { MessageCircle, Clock, TrendingUp, TrendingDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface ConversationThread {
  uid: string;
  contactId: string;
  threadId: string;
  startedAt: number;
  endedAt: number;
  entries: Array<{
    timestamp: number;
    type: string;
    summary: string;
    emotion: string;
  }>;
  dominantEmotion: string;
  symbolicLabel: string;
  tags: string[];
  strengthShift: number;
}

interface ConversationThreadListProps {
  threads: ConversationThread[];
  onThreadClick?: (thread: ConversationThread) => void;
}

export function ConversationThreadList({ threads, onThreadClick }: ConversationThreadListProps) {
  const [expandedThread, setExpandedThread] = useState<string | null>(null);

  const getEmotionColor = (emotion: string) => {
    if (emotion.includes("warm") || emotion.includes("joy") || emotion.includes("love")) {
      return "text-rose-500 bg-rose-50 border-rose-200";
    }
    if (emotion.includes("calm") || emotion.includes("peace") || emotion.includes("comfort")) {
      return "text-blue-500 bg-blue-50 border-blue-200";
    }
    if (emotion.includes("distant") || emotion.includes("cold") || emotion.includes("silence")) {
      return "text-gray-500 bg-gray-50 border-gray-200";
    }
    if (emotion.includes("tension") || emotion.includes("conflict") || emotion.includes("anger")) {
      return "text-red-500 bg-red-50 border-red-200";
    }
    if (emotion.includes("yearning") || emotion.includes("longing") || emotion.includes("hope")) {
      return "text-purple-500 bg-purple-50 border-purple-200";
    }
    return "text-amber-500 bg-amber-50 border-amber-200";
  };

  const getStrengthIcon = (strengthShift: number) => {
    if (strengthShift > 0.1) {
      return <TrendingUp className="h-4 w-4 text-green-500" />;
    } else if (strengthShift < -0.1) {
      return <TrendingDown className="h-4 w-4 text-red-500" />;
    }
    return <div className="h-4 w-4 rounded-full bg-gray-300" />;
  };

  const formatDuration = (startTime: number, endTime: number) => {
    const durationMs = endTime - startTime;
    const hours = Math.floor(durationMs / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    
    if (days > 0) {
      return `${days} day${days !== 1 ? 's' : ''}`;
    } else if (hours > 0) {
      return `${hours} hour${hours !== 1 ? 's' : ''}`;
    } else {
      return "< 1 hour";
    }
  };

  if (threads.length === 0) {
    return (
      <Card className="w-full h-48 flex items-center justify-center">
        <CardContent className="text-center">
          <MessageCircle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground">No conversation threads yet</p>
          <p className="text-sm text-muted-foreground/70 mt-2">
            Narrative arcs will appear as you interact with people
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5" />
          Conversation Threads
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Narrative arcs and emotional storylines in your relationships
        </p>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-3">
            {threads.map((thread) => (
              <div
                key={thread.threadId}
                className={cn(
                  "border rounded-lg p-4 cursor-pointer transition-all duration-200 hover:shadow-md",
                  getEmotionColor(thread.dominantEmotion)
                )}
                onClick={() => {
                  setExpandedThread(
                    expandedThread === thread.threadId ? null : thread.threadId
                  );
                  onThreadClick?.(thread);
                }}
              >
                {/* Thread Header */}
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h3 className="font-medium text-sm mb-1 leading-tight">
                      {thread.symbolicLabel}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>
                        {format(new Date(thread.startedAt), "MMM d")} - {format(new Date(thread.endedAt), "MMM d")}
                      </span>
                      <span>•</span>
                      <span>{formatDuration(thread.startedAt, thread.endedAt)}</span>
                      <span>•</span>
                      <span>{thread.entries.length} exchange{thread.entries.length !== 1 ? 's' : ''}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-2">
                    {getStrengthIcon(thread.strengthShift)}
                    <Badge variant="outline" className="text-xs">
                      {thread.dominantEmotion}
                    </Badge>
                  </div>
                </div>

                {/* Thread Tags */}
                <div className="flex gap-1 flex-wrap mb-2">
                  {thread.tags.slice(0, 3).map((tag) => (
                    <Badge 
                      key={tag} 
                      variant="secondary" 
                      className="text-xs px-2 py-0"
                    >
                      {tag}
                    </Badge>
                  ))}
                  {thread.tags.length > 3 && (
                    <Badge variant="outline" className="text-xs px-2 py-0">
                      +{thread.tags.length - 3}
                    </Badge>
                  )}
                </div>

                {/* Thread Strength Indicator */}
                <div className="flex items-center gap-2 text-xs">
                  <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                    <div 
                      className={cn(
                        "h-1.5 rounded-full transition-all duration-300",
                        thread.strengthShift > 0 ? "bg-green-500" : 
                        thread.strengthShift < 0 ? "bg-red-500" : "bg-gray-400"
                      )}
                      style={{ 
                        width: `${Math.abs(thread.strengthShift * 100)}%`,
                        marginLeft: thread.strengthShift < 0 ? `${100 - Math.abs(thread.strengthShift * 100)}%` : '0'
                      }}
                    />
                  </div>
                  <span className={cn(
                    "font-medium",
                    thread.strengthShift > 0 ? "text-green-600" : 
                    thread.strengthShift < 0 ? "text-red-600" : "text-gray-600"
                  )}>
                    {thread.strengthShift > 0 ? '+' : ''}{(thread.strengthShift * 100).toFixed(0)}%
                  </span>
                </div>

                {/* Expanded Thread Details */}
                {expandedThread === thread.threadId && (
                  <div className="mt-4 pt-3 border-t border-current/20">
                    <div className="space-y-2">
                      {thread.entries.map((entry, index) => (
                        <div key={index} className="flex items-start gap-3 text-xs">
                          <div className="w-2 h-2 rounded-full bg-current/60 mt-1.5 flex-shrink-0" />
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium capitalize">{entry.type}</span>
                              <span className="text-muted-foreground">
                                {format(new Date(entry.timestamp), "MMM d, h:mm a")}
                              </span>
                            </div>
                            <p className="text-muted-foreground leading-relaxed">
                              {entry.summary}
                            </p>
                            <Badge variant="outline" className="text-xs mt-1">
                              {entry.emotion}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}