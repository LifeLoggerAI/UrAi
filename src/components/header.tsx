'use client';

import { useAuth } from './auth-provider';
import { Button } from './ui/button';
import { auth } from '@/lib/firebase';
import { Sparkles } from 'lucide-react';

export function Header() {
    const { user } = useAuth();
    
    return (
        <header className="h-16 border-b flex items-center justify-between px-6">
            <div className="flex items-center gap-2">
                <Sparkles className="h-6 w-6 text-primary" />
                <h1 className="text-lg font-bold font-headline">UrAi</h1>
            </div>
            {user && (
                <div className="flex items-center gap-4">
                    <span className="text-sm text-muted-foreground">Welcome, {user.displayName || user.email}</span>
                    <Button variant="outline" size="sm" onClick={() => auth.signOut()}>Sign Out</Button>
                </div>
            )}
        </header>
    )
}
