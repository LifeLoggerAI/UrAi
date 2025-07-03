import type { Person } from "@/lib/types";
import { PersonCard } from "@/components/person-card";

export function PeopleList({ items }: { items: Person[] }) {
  if (items.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-8">
        <p>No people have been mentioned in your memories yet.</p>
        <p className="text-sm">Try recording a memory and mentioning someone's name.</p>
      </div>
    )
  }
  return (
    <div className="w-full space-y-3">
      {items.map((item) => (
        <PersonCard key={item.id} person={item} />
      ))}
    </div>
  );
}
