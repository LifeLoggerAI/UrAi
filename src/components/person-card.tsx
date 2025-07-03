
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import type { Person } from "@/lib/types";
import { formatDistanceToNow } from 'date-fns';
import { Badge } from "./ui/badge";
import { History } from "lucide-react";

export function PersonCard({ person }: { person: Person }) {
  const lastSeen = formatDistanceToNow(new Date(person.lastSeen), { addSuffix: true });
  // Cap progress at 100 for visualization, but show the real number.
  const familiarityProgress = Math.min(person.familiarityIndex * 5, 100); 

  return (
    <div className="animate-fadeIn">
        <Card className="shadow-lg border-border/60 hover:border-accent/80 transition-all duration-300 bg-card">
            <CardHeader className="flex flex-row items-center gap-4">
                <Avatar className="h-12 w-12 border">
                    {person.avatarUrl && (
                      <img src={person.avatarUrl} alt={person.name} className="aspect-square h-full w-full object-cover" />
                    )}
                    <AvatarFallback>{person.name.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="flex-grow">
                    <CardTitle className="text-lg font-headline">{person.name}</CardTitle>
                    <CardDescription>Last mentioned {lastSeen}</CardDescription>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Familiarity Index</label>
                    <Progress value={familiarityProgress} className="h-2" />
                    <p className="text-xs text-muted-foreground">{person.familiarityIndex} interaction{person.familiarityIndex === 1 ? '' : 's'} logged</p>
                </div>
                {person.socialRoleHistory && person.socialRoleHistory.length > 0 && (
                    <div className="space-y-2 pt-2 border-t">
                        <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                            <History className="h-4 w-4" /> Social Roles
                        </label>
                         <div className="flex flex-wrap gap-1">
                            {/* Get unique roles from history */}
                            {[...new Set(person.socialRoleHistory.map(h => h.role))].map(role => (
                                <Badge key={role} variant="secondary">{role}</Badge>
                            ))}
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    </div>
  );
}
