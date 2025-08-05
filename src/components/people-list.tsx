import type { Person } from '@/lib/types';
import { PersonCard } from '@/components/person-card';
import { Users } from 'lucide-react';

export function PeopleList({ people }: { people: Person[] }) {
  if (people.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-16 px-4 bg-card border rounded-lg animate-fadeIn">
        <Users className="mx-auto h-12 w-12 text-primary/50" />
        <h3 className="mt-4 text-lg font-medium text-foreground">
          Your Social Constellation is Forming
        </h3>
        <p className="mt-1 text-sm">
          Mention someone in a voice note, and they will appear here.
        </p>
      </div>
    );
  }
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-fadeIn">
      {people.map(person => (
        <PersonCard key={person.id} person={person} />
      ))}
    </div>
  );
}
