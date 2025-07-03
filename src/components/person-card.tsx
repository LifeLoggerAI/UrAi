import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import type { Person } from "@/lib/types"

export function PersonCard({ person }: { person: Person }) {
  const lastSeenDate = new Date(person.lastSeen).toLocaleDateString(undefined, {
    dateStyle: 'medium'
  });

  const getProgressColor = (value: number) => {
    if (value < 33) return "bg-chart-5"; // Red
    if (value < 66) return "bg-chart-4"; // Orange/Yellow
    return "bg-chart-2"; // Green
  };

  return (
    <div className="flex items-center gap-4 rounded-lg border bg-card p-3 text-card-foreground shadow-sm transition-all hover:bg-accent/20 animate-fadeIn">
      <Avatar className="h-12 w-12">
        <AvatarImage src={person.avatarUrl} data-ai-hint="person portrait" alt={person.displayName} />
        <AvatarFallback>{person.displayName.slice(0, 2).toUpperCase()}</AvatarFallback>
      </Avatar>
      <div className="flex-1 space-y-1">
        <p className="font-medium leading-tight">{person.displayName}</p>
        <p className="text-sm text-muted-foreground">Last seen: {lastSeenDate}</p>
      </div>
      <div className="w-1/3 space-y-1 text-right">
        <p className="text-sm font-medium">Familiarity</p>
        <Progress value={person.familiarityIndex} indicatorClassName={getProgressColor(person.familiarityIndex)} />
        <p className="text-xs text-muted-foreground">{person.familiarityIndex}/100</p>
      </div>
    </div>
  )
}
