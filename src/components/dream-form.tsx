
'use client'

import React, { useState } from 'react';
import { addDreamAction } from '@/app/actions';
import { useAuth } from '@/components/auth-provider';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Loader2, PenLine } from 'lucide-react';

export function DreamForm() {
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
                description: "Please enter your dream text before submitting.",
            });
            return;
        }

        setIsSubmitting(true);
        try {
            const result = await addDreamAction({ userId: user.uid, text });
            if (result.success) {
                toast({
                    title: "Dream Logged",
                    description: "Your dream has been saved and analyzed.",
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
                    <CardTitle className="font-headline text-2xl">Log a New Dream</CardTitle>
                    <CardDescription>Describe your dream below. The AI will analyze it for symbols, themes, and emotions.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Textarea
                        placeholder="Last night I dreamt of..."
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
                        Save and Analyze Dream
                    </Button>
                </CardFooter>
            </Card>
        </form>
    );
}
