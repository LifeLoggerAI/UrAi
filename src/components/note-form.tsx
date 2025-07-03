'use client'

import { useFormState } from 'react-dom'
import React, { useEffect, useRef } from 'react'

import { addVoiceEventAction } from '@/app/actions'
import type { AppData } from '@/lib/types'
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { SubmitButton } from '@/components/submit-button'

const initialState = {
  data: null,
  error: null,
}

export function NoteForm({ onNoteAdded }: { onNoteAdded: (data: AppData) => void }) {
  const [state, formAction] = useFormState(addVoiceEventAction, initialState)
  const formRef = useRef<HTMLFormElement>(null)
  
  useEffect(() => {
    if (state.data) {
      onNoteAdded(state.data)
      formRef.current?.reset()
    }
  }, [state, onNoteAdded])

  return (
    <Card className="w-full shadow-lg border-border/60">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Log a New Voice Event</CardTitle>
        <CardDescription>Enter the transcript of a conversation or a voice note. The AI will analyze and categorize it for you.</CardDescription>
      </CardHeader>
      <form ref={formRef} action={formAction}>
        <CardContent>
          <Textarea
            name="content"
            placeholder="What was said?"
            rows={5}
            required
            className="resize-none bg-secondary/20 focus:bg-background"
          />
          {state.error && (
            <p className="mt-2 text-sm text-destructive">{state.error}</p>
          )}
        </CardContent>
        <CardFooter className="flex justify-end">
          <SubmitButton />
        </CardFooter>
      </form>
    </Card>
  )
}
