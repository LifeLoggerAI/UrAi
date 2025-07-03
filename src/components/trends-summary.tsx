'use client'

import React, { useState } from 'react'
import { summarizeTrendsAction } from '@/app/actions'
import type { Note } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Loader2, Sparkles, Terminal } from 'lucide-react'
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
} from '@/components/ui/alert-dialog'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

export function TrendsSummary({ notes }: { notes: Note[] }) {
  const [summary, setSummary] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleSummarize = async () => {
    if (notes.length < 2) {
        setError("You need at least two notes to identify trends.");
        setIsDialogOpen(true);
        return;
    }
    
    setIsLoading(true)
    setError(null)
    setSummary(null)
    setIsDialogOpen(true)
    
    const noteContents = notes.map((n) => n.content)
    const result = await summarizeTrendsAction(noteContents)
    
    if (result.summary) {
      setSummary(result.summary)
    } else {
      setError(result.error || 'An unknown error occurred.')
    }

    setIsLoading(false)
  }

  return (
    <>
      <div className="w-full flex justify-center">
        <Button onClick={handleSummarize} disabled={isLoading || notes.length === 0} variant="outline">
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Sparkles className="mr-2 h-4 w-4" />
          )}
          Summarize Trends
        </Button>
      </div>

      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Trends Summary</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogDescription asChild>
            <div className="min-h-[6rem]">
              {isLoading && (
                <div className="flex items-center justify-center h-full">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              )}
              {error && (
                <Alert variant="destructive">
                  <Terminal className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              {summary && <p className="text-foreground">{summary}</p>}
            </div>
          </AlertDialogDescription>
          <AlertDialogFooter>
            <AlertDialogCancel>Close</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
