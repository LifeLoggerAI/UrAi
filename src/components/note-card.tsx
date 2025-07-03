import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { SentimentIcon } from "@/components/sentiment-icon";
import type { Note } from "@/lib/types";
import { cn } from "@/lib/utils";

export function NoteCard({ note }: { note: Note }) {
  const date = new Date(note.timestamp).toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  return (
    <div className="animate-fadeIn">
      <Card className="shadow-sm hover:shadow-md transition-shadow duration-300">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <p className="text-sm text-muted-foreground">{date}</p>
          <SentimentIcon sentiment={note.sentiment} />
        </CardHeader>
        <CardContent>
          <p className="text-foreground/90 whitespace-pre-wrap">{note.content}</p>
        </CardContent>
      </Card>
    </div>
  );
}
