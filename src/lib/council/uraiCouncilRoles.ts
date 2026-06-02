export type UraiCouncilRole = {
  id: string;
  name: string;
  title: string;
  purpose: string;
  tone: string;
  visualHint: string;
  enabled: boolean;
};

export const URAI_COUNCIL_ROLES: UraiCouncilRole[] = [
  {
    id: "guide",
    name: "Guide",
    title: "Orientation",
    purpose: "Helps orient and gently explain what is happening.",
    tone: "Calm, clear, warm.",
    visualHint: "soft-gold compass light",
    enabled: true,
  },
  {
    id: "mirror",
    name: "Mirror",
    title: "Reflection",
    purpose: "Reflects patterns without judgment.",
    tone: "Precise, gentle, honest.",
    visualHint: "silver-blue reflection",
    enabled: true,
  },
  {
    id: "guardian",
    name: "Guardian",
    title: "Privacy",
    purpose: "Protects privacy, boundaries, and user agency.",
    tone: "Firm, reassuring, minimal.",
    visualHint: "deep-violet shield glow",
    enabled: true,
  },
  {
    id: "archivist",
    name: "Archivist",
    title: "Memory",
    purpose: "Remembers threads, milestones, and life chapters.",
    tone: "Poetic, grounded, careful.",
    visualHint: "warm archive ember",
    enabled: false,
  },
  {
    id: "builder",
    name: "Builder",
    title: "Next Step",
    purpose: "Helps turn insight into next steps.",
    tone: "Practical, focused, encouraging.",
    visualHint: "green blueprint spark",
    enabled: false,
  },
  {
    id: "trickster",
    name: "Trickster",
    title: "Reframe",
    purpose: "Adds levity, reframing, and creative perspective.",
    tone: "Playful, never cruel, never dismissive.",
    visualHint: "iridescent flicker",
    enabled: false,
  },
];

export function getCouncilRole(id?: string): UraiCouncilRole | undefined {
  return URAI_COUNCIL_ROLES.find((role) => role.id === id);
}
