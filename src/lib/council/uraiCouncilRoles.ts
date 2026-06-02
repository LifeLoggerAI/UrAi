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
    title: "Orientation Voice",
    purpose: "Helps orient and gently explain what is happening.",
    tone: "Calm, clear, warm",
    visualHint: "soft gold compass glow",
    enabled: true,
  },
  {
    id: "mirror",
    name: "Mirror",
    title: "Pattern Reflection",
    purpose: "Reflects patterns without judgment.",
    tone: "Precise, gentle, honest",
    visualHint: "silver reflection ripple",
    enabled: true,
  },
  {
    id: "guardian",
    name: "Guardian",
    title: "Privacy Boundary",
    purpose: "Protects privacy, boundaries, and user agency.",
    tone: "Firm, reassuring, minimal",
    visualHint: "deep blue shield halo",
    enabled: true,
  },
  {
    id: "archivist",
    name: "Archivist",
    title: "Memory Keeper",
    purpose: "Remembers threads, milestones, and life chapters.",
    tone: "Poetic, grounded, careful",
    visualHint: "constellation archive thread",
    enabled: false,
  },
  {
    id: "builder",
    name: "Builder",
    title: "Next Step Maker",
    purpose: "Helps turn insight into next steps.",
    tone: "Practical, focused, encouraging",
    visualHint: "warm ember blueprint lines",
    enabled: false,
  },
  {
    id: "trickster",
    name: "Trickster",
    title: "Creative Reframe",
    purpose: "Adds levity, reframing, and creative perspective.",
    tone: "Playful, never cruel, never dismissive",
    visualHint: "soft prism flicker",
    enabled: false,
  },
];

export function getCouncilRole(id?: string): UraiCouncilRole | undefined {
  if (!id) return undefined;
  return URAI_COUNCIL_ROLES.find((role) => role.id === id);
}

export function getEnabledCouncilRoles(): UraiCouncilRole[] {
  return URAI_COUNCIL_ROLES.filter((role) => role.enabled);
}
