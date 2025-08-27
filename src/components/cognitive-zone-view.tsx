
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { Dream, InnerVoiceReflection, PersonaProfile } from '@/lib/types';
import { Brain, MessageSquare, UserCircle2 } from 'lucide-react';

interface CognitiveZoneViewProps {
  dreams: Dream[];
  innerTexts: InnerVoiceReflection[];
  personaProfile?: PersonaProfile;
}

export function CognitiveZoneView({
  dreams,
  innerTexts,
  personaProfile,
}: CognitiveZoneViewProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full p-4 max-h-[80vh] overflow-y-auto">
      {/* Dreams */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" /> Dreams
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[200px] pr-2">
            {dreams.length > 0 ? (
              dreams.map((dream) => (
                <div
                  key={dream.id}
                  className="mb-3 p-3 rounded-md border border-border hover:bg-muted/50 transition-colors"
                >
                  <p className="text-sm font-medium">{dream.title || 'Untitled Dream'}</p>
                  {dream.text && (
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                      {dream.text}
                    </p>
                  )}
                  {dream.sentimentScore !== undefined && (
                    <p className="text-xs mt-1">
                      Sentiment: {Math.round(dream.sentimentScore * 100)}%
                    </p>
                  )}
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground italic">No dreams logged yet.</p>
            )}
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Inner Voice Reflections */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-primary" /> Inner Voice
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[200px] pr-2">
            {innerTexts.length > 0 ? (
              innerTexts.map((reflection) => (
                <div
                  key={reflection.id}
                  className="mb-3 p-3 rounded-md border border-border hover:bg-muted/50 transition-colors"
                >
                  <p className="text-sm line-clamp-3">{reflection.text}</p>
                  {reflection.createdAt && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(reflection.createdAt).toLocaleDateString()}
                    </p>
                  )}
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground italic">
                No inner reflections recorded yet.
              </p>
            )}
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Persona Profile */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserCircle2 className="h-5 w-5 text-primary" /> Persona
          </CardTitle>
        </CardHeader>
        <CardContent>
          {personaProfile ? (
            <div className="space-y-3">
              {personaProfile.dominantPersona && (
                <p className="text-sm">
                  <strong>Dominant:</strong> {personaProfile.dominantPersona}
                </p>
              )}
              {personaProfile.traits && Object.keys(personaProfile.traits).length > 0 && (
                <div>
                  <strong className="text-sm">Traits:</strong>
                  <ul className="text-sm list-disc list-inside mt-1">
                    {Object.entries(personaProfile.traits).map(([trait, value]) => (
                      <li key={trait}>{trait}: {Math.round(value * 100)}%</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground italic">
              Persona profile not available yet.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
