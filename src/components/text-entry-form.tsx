
'use client'

import React, { useState } from 'react';
import { addInnerTextAction } from '@/app/actions';
import { useAuth } from '@/components/auth-provider';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Loader2, PenLine } from 'lucide-react';

export function TextEntryForm() {
    const { user } = useAuth();
    const { toast } = useToast();
    const [text, setText] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || !text.trim()) {
            toast({
                variant: "destructive",
                title: "Missing Information",
                description: "Please enter your thoughts before submitting.",
            });
            return;
        }

        setIsSubmitting(true);
        try {
            const result = await addInnerTextAction({ userId: user.uid, text });
            if (result.success) {
                toast({
                    title: "Reflection Logged",
                    description: "Your entry has been saved.",
                });
                setText('');
            } else {
                throw new Error(result.error || "An unknown error occurred.");
            }
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Submission Failed",
                description: (error as Error).message,
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <Card className="w-full shadow-lg border-border/60">
                <CardHeader>
                    <CardTitle className="font-headline text-2xl">Inner Voice</CardTitle>
                    <CardDescription>Type your thoughts, feelings, or reflections. The AI will analyze the sentiment.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Textarea
                        placeholder="What's on your mind?..."
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        disabled={isSubmitting}
                        rows={6}
                    />
                </CardContent>
                <CardFooter className="flex justify-center">
                    <Button type="submit" disabled={isSubmitting || !text.trim()}>
                        {isSubmitting ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                            <PenLine className="mr-2 h-4 w-4" />
                        )}
                        Save Reflection
                    </Button>
                </CardFooter>
            </Card>
        </form>
    );
}
