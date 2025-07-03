import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { SentimentIcon } from "@/components/sentiment-icon";
import type { AppData } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Users, Tag, CheckSquare, BrainCircuit, TrendingUp, Zap, ShieldCheck } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";

export function NoteCard({ item }: { item: AppData }) {
  const { voiceEvent, transcription } = item;
  const date = new Date(voiceEvent.timestamp).toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  const getProgressColor = (value: number) => {
    if (value < 33) return "bg-chart-5"; // Red
    if (value < 66) return "bg-chart-4"; // Orange/Yellow
    return "bg-chart-2"; // Green
  };

  const toneScoreNormalized = (voiceEvent.toneScore + 1) * 50;
  const echoScoreNormalized = (voiceEvent.emotionalEchoScore + 100) / 2;

  return (
    <div className="animate-fadeIn">
      <Card className="shadow-lg border-border/60 hover:border-accent/80 transition-all duration-300 bg-card">
        <CardHeader className="flex flex-row items-start justify-between pb-2 gap-4">
          <div>
            <CardTitle className="text-lg font-headline">{transcription.summary}</CardTitle>
            <p className="text-sm text-muted-foreground pt-1">{date}</p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <SentimentIcon sentiment={transcription.sentiment} />
            <Badge variant="outline" className="capitalize text-xs border-accent/50 text-accent-foreground">
              {voiceEvent.socialArchetype}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-foreground/80 whitespace-pre-wrap">{transcription.fullText}</p>
        </CardContent>
        <CardFooter className="flex flex-col items-start gap-4 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 w-full">
                <div className="space-y-3">
                    {transcription.tags.length > 0 && (
                        <div className="flex flex-wrap items-center gap-2 text-sm">
                            <Tag className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                            {transcription.tags.map(tag => <Badge key={tag} variant="secondary">{tag}</Badge>)}
                        </div>
                    )}
                    {transcription.people.length > 0 && (
                        <div className="flex flex-wrap items-center gap-2 text-sm">
                            <Users className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                            {transcription.people.map(person => <Badge key={person} variant="secondary">{person}</Badge>)}
                        </div>
                    )}
                    {voiceEvent.detectedEmotions.length > 0 && (
                        <div className="flex flex-wrap items-center gap-2 text-sm">
                            <BrainCircuit className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                            {voiceEvent.detectedEmotions.map(emotion => <Badge key={emotion} variant="outline" className="capitalize">{emotion}</Badge>)}
                        </div>
                    )}
                </div>
                 <div className="space-y-3">
                    <div className="flex items-center gap-3 text-sm">
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium w-32 shrink-0">Tone Score</span>
                        <Progress value={toneScoreNormalized} className="w-full" indicatorClassName={getProgressColor(toneScoreNormalized)} />
                        <span className="text-muted-foreground text-xs w-10 text-right">{voiceEvent.toneScore.toFixed(2)}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                        <Zap className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium w-32 shrink-0">Emotional Echo</span>
                        <Progress value={echoScoreNormalized} className="w-full" indicatorClassName={getProgressColor(echoScoreNormalized)} />
                        <span className="text-muted-foreground text-xs w-10 text-right">{voiceEvent.emotionalEchoScore.toFixed(0)}</span>
                    </div>
                     <div className="flex items-center gap-3 text-sm">
                        <ShieldCheck className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium w-32 shrink-0">Memory Strength</span>
                        <Progress value={voiceEvent.voiceMemoryStrength} className="w-full" indicatorClassName={getProgressColor(voiceEvent.voiceMemoryStrength)} />
                        <span className="text-muted-foreground text-xs w-10 text-right">{voiceEvent.voiceMemoryStrength.toFixed(0)}%</span>
                    </div>
                </div>
            </div>


          {transcription.tasks.length > 0 && (
            <>
                <Separator className="w-full my-2" />
                <div className="flex flex-col items-start gap-2 text-sm w-full">
                    <div className="flex items-center gap-2"><CheckSquare className="h-4 w-4 text-muted-foreground" /><span className="font-medium">Action Items</span></div>
                    <ul className="list-disc list-inside pl-2 space-y-1">
                        {transcription.tasks.map(task => <li key={task} className="text-foreground/90">{task}</li>)}
                    </ul>
                </div>
            </>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
