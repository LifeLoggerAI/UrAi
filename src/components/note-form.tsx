'use client'

import { useFormState } from 'react-dom'
import React, { useEffect, useRef } from 'react'

import { addNoteAction } from '@/app/actions'
import type { Note } from '@/lib/types'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { SubmitButton } from '@/components/submit-button'

const initialState = {
  note: null,
  error: null,
}

export function NoteForm({ onNoteAdded }: { onNoteAdded: (note: Note) => void }) {
  const [state, formAction] = useFormState(addNoteAction, initialState)
  const formRef = useRef<HTMLFormElement>(null)
  
  useEffect(() => {
    if (state.note) {
      onNoteAdded(state.note)
      formRef.current?.reset()
    }
  }, [state, onNoteAdded])

  return (
    <Card className="w-full shadow-md">
      <CardHeader>
        <CardTitle className="font-headline text-xl">Add a new thought</CardTitle>
      </CardHeader>
      <form ref={formRef} action={formAction}>
        <CardContent>
          <Textarea
            name="content"
            placeholder="What's on your mind?"
            rows={4}
            required
            className="resize-none"
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
