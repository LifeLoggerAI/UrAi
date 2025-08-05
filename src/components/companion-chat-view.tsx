'use client';

import { useState, useRef, useEffect } from 'react';
import type { ChatMessage } from '@/lib/types';
import { companionChatAction } from '@/app/actions';
import { useAuth } from './auth-provider';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { BotMessageSquare, CornerDownLeft, Loader2, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Skeleton } from './ui/skeleton';

export function CompanionChatView() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', content: `Hello ${user?.displayName || 'there'}. What's on your mind today?` },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll to bottom when new messages are added
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const history = [...messages, userMessage];
      const result = await companionChatAction({ history, message: userMessage.content });

      if (result.error) {
        throw new Error(result.error);
      }

      if (result.response) {
        const modelMessage: ChatMessage = { role: 'model', content: result.response };
        setMessages(prev => [...prev, modelMessage]);
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: (error as Error).message,
      });
      // remove the user message if the call failed
      setMessages(prev => prev.slice(0, -1));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='flex flex-col h-[calc(100vh-10rem)] bg-card border rounded-lg shadow-lg'>
      <ScrollArea className='flex-1 p-4' ref={scrollAreaRef}>
        <div className='space-y-6'>
          {messages.map((message, index) => (
            <div
              key={index}
              className={cn(
                'flex items-start gap-4 animate-fadeIn',
                message.role === 'user' ? 'justify-end' : 'justify-start'
              )}
            >
              {message.role === 'model' && (
                <Avatar className='h-8 w-8 border-2 border-primary/50'>
                  <AvatarFallback>
                    <BotMessageSquare className='text-primary' />
                  </AvatarFallback>
                </Avatar>
              )}
              <div
                className={cn(
                  'max-w-md p-3 rounded-lg',
                  message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'
                )}
              >
                <p className='whitespace-pre-wrap'>{message.content}</p>
              </div>
              {message.role === 'user' && (
                <Avatar className='h-8 w-8'>
                  <AvatarImage src={user?.photoURL || undefined} />
                  <AvatarFallback>
                    <User />
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}
          {isLoading && (
            <div className='flex items-start gap-4 animate-fadeIn'>
              <Avatar className='h-8 w-8 border-2 border-primary/50'>
                <AvatarFallback>
                  <BotMessageSquare className='text-primary' />
                </AvatarFallback>
              </Avatar>
              <div className='max-w-md p-3 rounded-lg bg-muted space-y-2'>
                <Skeleton className='h-4 w-32' />
                <Skeleton className='h-4 w-48' />
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
      <div className='p-4 border-t'>
        <form onSubmit={handleSubmit} className='flex items-center gap-2'>
          <Input
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder='Ask your companion anything...'
            disabled={isLoading}
            autoComplete='off'
          />
          <Button type='submit' disabled={isLoading || !input.trim()} size='icon'>
            {isLoading ? <Loader2 className='animate-spin' /> : <CornerDownLeft />}
            <span className='sr-only'>Send</span>
          </Button>
        </form>
      </div>
    </div>
  );
}
