
import type { InnerVoiceReflection } from "@/lib/types";
import { TextEntryCard } from "@/components/text-entry-card";
import { PenLine } from "lucide-react";

export function TextEntryList({ entries }: { entries: InnerVoiceReflection[] }) {
    if (entries.length === 0) {
        return (
            <div className="text-center text-muted-foreground py-16 px-4 bg-card border rounded-lg animate-fadeIn">
                <PenLine className="mx-auto h-12 w-12 text-primary/50" />
                <h3 className="mt-4 text-lg font-medium text-foreground">No Reflections Yet</h3>
                <p className="mt-1 text-sm">Use the form above to log your first text entry.</p>
            </div>
        )
    }
    return (
        <div className="w-full space-y-4">
        <h2 className="text-2xl font-headline font-bold">Recent Reflections</h2>
        {entries.map((entry) => (
            <TextEntryCard key={entry.id} entry={entry} />
        ))}
        </div>
    );
}
