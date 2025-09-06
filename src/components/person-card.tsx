'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import type { Person } from '@/lib/types';
import { formatDistanceToNow } from 'date-fns';
import { Badge } from './ui/badge';
import { History, Zap, Hourglass, MemoryStick } from 'lucide-react';
import { useEffect, useState } from 'react';

export function PersonCard({ person }: { person: Person }) {
  const [lastSeen, setLastSeen] = useState('');

  useEffect(() => {
    if (person.lastSeen) {
      setLastSeen(
        formatDistanceToNow(new Date(person.lastSeen), { addSuffix: true })
      );
    }
  }, [person.lastSeen]);

  // Cap progress at 100 for visualization, but show the real number.
  const familiarityProgress = Math.min((person.familiarityIndex || 0) * 5, 100);

  return (
    <div className="animate-fadeIn">
      <Card className="shadow-lg border-border/60 hover:border-accent/80 transition-all duration-300 bg-card h-full flex flex-col">
        <CardHeader className="flex flex-row items-center gap-4">
          <Avatar className="h-16 w-16 border-2 border-primary/50">
            <AvatarImage src={person.avatarUrl} alt={person.name} />
            <AvatarFallback>
              {person.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-grow">
            <CardTitle className="text-xl font-headline">
              {person.name}
            </CardTitle>
            <CardDescription>Last mentioned {lastSeen}</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 flex-grow">
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Zap className="h-4 w-4" /> Familiarity Index
            </label>
            <Progress value={familiarityProgress} className="h-2" />
            <p className="text-xs text-muted-foreground">
              {person.familiarityIndex || 0} interaction
              {(person.familiarityIndex || 0) === 1 ? '' : 's'} logged
            </p>
          </div>

          {person.voiceMemoryStrength !== undefined && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <MemoryStick className="h-4 w-4" /> Voice Memory
              </label>
              <Progress value={person.voiceMemoryStrength} className="h-2" />
              <p className="text-xs text-muted-foreground">
                How impactful their voice has been recently.
              </p>
            </div>
          )}

          {person.silenceDurationDays !== undefined &&
            person.silenceDurationDays > 0 && (
              <div className="space-y-2 text-sm">
                <label className="font-medium text-muted-foreground flex items-center gap-2">
                  <Hourglass className="h-4 w-4" /> Period of Silence
                </label>
                <p className="font-semibold text-foreground">
                  {person.silenceDurationDays} day
                  {person.silenceDurationDays > 1 ? 's' : ''}
                </p>
              </div>
            )}

          {person.socialRoleHistory && person.socialRoleHistory.length > 0 && (
            <div className="space-y-2 pt-4 border-t">
              <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <History className="h-4 w-4" /> Social Roles
              </label>
              <div className="flex flex-wrap gap-1">
                {/* Get unique roles from history */}
                {person.socialRoleHistory
                  .map(h => h.role)
                  .filter((role, i, arr) => arr.indexOf(role) === i)
                  .map(role => (
                    <Badge key={role} variant="secondary">
                      {role}
                    </Badge>
                  ))}
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <p className="text-xs text-muted-foreground text-center w-full">
            More relationship insights coming soon.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
