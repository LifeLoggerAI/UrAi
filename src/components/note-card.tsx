import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { SentimentIcon } from "@/components/sentiment-icon";
import type { AppData } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Users, Tag, CheckSquare, BrainCircuit } from "lucide-react";

export function NoteCard({ item }: { item: AppData }) {
  const { voiceEvent, transcription } = item;
  const date = new Date(voiceEvent.timestamp).toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  return (
    <div className="animate-fadeIn">
      <Card className="shadow-lg border-border/60 hover:border-accent/80 transition-all duration-300 bg-secondary/20">
        <CardHeader className="flex flex-row items-start justify-between pb-2 gap-4">
          <div>
            <CardTitle className="text-lg font-headline">{transcription.summary}</CardTitle>
            <p className="text-sm text-muted-foreground pt-1">{date}</p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <SentimentIcon sentiment={transcription.sentiment} />
            <Badge variant="outline" className="capitalize text-xs border-accent/50 text-accent">
              {voiceEvent.socialArchetype}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-foreground/80 whitespace-pre-wrap line-clamp-4">{transcription.fullText}</p>
        </CardContent>
        <CardFooter className="flex flex-col items-start gap-4 pt-4">
          {transcription.tags.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 text-sm">
                <Tag className="h-4 w-4 text-muted-foreground" />
                {transcription.tags.map(tag => <Badge key={tag} variant="secondary">{tag}</Badge>)}
            </div>
          )}
          {transcription.people.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 text-sm">
                <Users className="h-4 w-4 text-muted-foreground" />
                {transcription.people.map(person => <Badge key={person} variant="secondary">{person}</Badge>)}
            </div>
          )}
          {transcription.tasks.length > 0 && (
            <div className="flex flex-col items-start gap-2 text-sm w-full">
                <div className="flex items-center gap-2"><CheckSquare className="h-4 w-4 text-muted-foreground" /><span className="font-medium">Action Items</span></div>
                <ul className="list-disc list-inside pl-2 space-y-1">
                    {transcription.tasks.map(task => <li key={task} className="text-foreground/90">{task}</li>)}
                </ul>
            </div>
          )}
           {voiceEvent.detectedEmotions.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 text-sm">
                <BrainCircuit className="h-4 w-4 text-muted-foreground" />
                {voiceEvent.detectedEmotions.map(emotion => <Badge key={emotion} variant="outline" className="capitalize">{emotion}</Badge>)}
            </div>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
