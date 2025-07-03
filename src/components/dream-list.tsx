
import type { Dream } from "@/lib/types";
import { DreamCard } from "@/components/dream-card";
import { NotebookPen } from "lucide-react";

export function DreamList({ dreams }: { dreams: Dream[] }) {
    if (dreams.length === 0) {
        return (
            <div className="text-center text-muted-foreground py-16 px-4 bg-card border rounded-lg animate-fadeIn">
                <NotebookPen className="mx-auto h-12 w-12 text-primary/50" />
                <h3 className="mt-4 text-lg font-medium text-foreground">Your Dream Journal is Empty</h3>
                <p className="mt-1 text-sm">Use the form above to log your first dream.</p>
            </div>
        )
    }
    return (
        <div className="w-full space-y-4">
        {dreams.map((dream) => (
            <DreamCard key={dream.id} dream={dream} />
        ))}
        </div>
    );
}
