
'use client'

import React, { useState } from 'react';
import { addDreamAction } from '@/app/actions';
import { useAuth } from '@/components/auth-provider';
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
        <form onSubmit={handleSubmit} className="p-4 border rounded-lg bg-background">
             <div className="space-y-4">
                <h3 className="font-headline text-xl">Log a New Dream</h3>
                <Textarea
                    placeholder="Last night I dreamt of..."
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    disabled={isSubmitting}
                    rows={6}
                />
                <div className="flex justify-end">
                    <Button type="submit" disabled={isSubmitting || !text.trim()}>
                        {isSubmitting ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                            <PenLine className="mr-2 h-4 w-4" />
                        )}
                        Save and Analyze
                    </Button>
                </div>
            </div>
        </form>
    );
}
