import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { SentimentIcon } from '@/components/sentiment-icon';
import type { VoiceEvent } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { BrainCircuit, TrendingUp, Zap, MicVocal, Users, ListTodo } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

export function NoteCard({ item }: { item: VoiceEvent }) {
  const date = new Date(item.createdAt).toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  const getProgressColor = (value: number) => {
    if (value < -0.33) return 'bg-chart-5'; // Red
    if (value < 0.33) return 'bg-chart-4'; // Orange/Yellow
    return 'bg-chart-2'; // Green
  };

  const sentiment =
    item.sentimentScore > 0.1 ? 'positive' : item.sentimentScore < -0.1 ? 'negative' : 'neutral';
  const sentimentScoreNormalized = (item.sentimentScore + 1) * 50;

  return (
    <div className='animate-fadeIn'>
      <Card className='shadow-lg border-border/60 hover:border-accent/80 transition-all duration-300 bg-card'>
        <CardHeader className='flex flex-row items-start justify-between pb-2 gap-4'>
          <div>
            <CardTitle className='text-lg font-headline line-clamp-2'>{item.text}</CardTitle>
            <p className='text-sm text-muted-foreground pt-1'>{date}</p>
          </div>
          <div className='flex flex-col items-end gap-2'>
            <SentimentIcon sentiment={sentiment} />
            <Badge
              variant='outline'
              className='capitalize text-xs border-accent/50 text-accent-foreground'
            >
              {item.voiceArchetype}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <p className='text-foreground/80 whitespace-pre-wrap'>{item.text}</p>
        </CardContent>
        <CardFooter className='flex flex-col items-start gap-4 pt-4'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 w-full'>
            <div className='space-y-3'>
              <div className='flex flex-wrap items-center gap-2 text-sm'>
                <BrainCircuit className='h-4 w-4 text-muted-foreground flex-shrink-0' />
                <Badge variant='outline' className='capitalize'>
                  {item.emotion}
                </Badge>
              </div>
              <div className='flex flex-wrap items-center gap-2 text-sm'>
                <MicVocal className='h-4 w-4 text-muted-foreground flex-shrink-0' />
                <Badge variant='secondary' className='capitalize'>
                  {item.speakerLabel}
                </Badge>
              </div>
            </div>
            <div className='space-y-3'>
              <div className='flex items-center gap-3 text-sm'>
                <TrendingUp className='h-4 w-4 text-muted-foreground' />
                <span className='font-medium w-32 shrink-0'>Sentiment</span>
                <Progress
                  value={sentimentScoreNormalized}
                  className='w-full'
                  indicatorClassName={getProgressColor(item.sentimentScore)}
                />
                <span className='text-muted-foreground text-xs w-10 text-right'>
                  {item.sentimentScore.toFixed(2)}
                </span>
              </div>
              <div className='flex items-center gap-3 text-sm'>
                <Zap className='h-4 w-4 text-muted-foreground' />
                <span className='font-medium w-32 shrink-0'>Tone Shift</span>
                <Progress value={item.toneShift * 100} className='w-full' />
                <span className='text-muted-foreground text-xs w-10 text-right'>
                  {item.toneShift.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
          {item.people && item.people.length > 0 && (
            <div className='flex items-center gap-2 pt-4 border-t w-full mt-4'>
              <Users className='h-4 w-4 text-muted-foreground flex-shrink-0' />
              <div className='flex flex-wrap gap-1'>
                {item.people.map(name => (
                  <Badge key={name} variant='secondary'>
                    {name}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          {item.tasks && item.tasks.length > 0 && (
            <div className='flex flex-col gap-2 pt-4 border-t w-full mt-4'>
              <div className='flex items-center gap-2'>
                <ListTodo className='h-4 w-4 text-muted-foreground flex-shrink-0' />
                <h4 className='text-sm font-medium'>Action Items</h4>
              </div>
              <ul className='list-disc list-inside pl-2 space-y-1 text-foreground/80'>
                {item.tasks.map((task, index) => (
                  <li key={index}>{task}</li>
                ))}
              </ul>
            </div>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
