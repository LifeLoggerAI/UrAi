export type GenesisOnboardingLayer =
  | "home"
  | "sky"
  | "ground"
  | "orb"
  | "life-map"
  | "focus"
  | "replay"
  | "council"
  | "life-films"
  | "music"
  | "symbolic-people"
  | "spatial"
  | "passport"
  | "global-map"
  | "accessibility"
  | "legacy";

export type GenesisOnboardingScene = {
  id: string;
  title: string;
  timestampRange: string;
  voiceover: string;
  visualDirection: string;
  onScreenText: string[];
  requiredLayers: GenesisOnboardingLayer[];
  trustSafetyNotes: string[];
  assetPrompt: string;
  fallbackAssetPath: string;
  optionalMotionDirection?: string;
  cta?: {
    label: string;
    href: string;
  };
};

export type GenesisOnboardingFilm = {
  title: string;
  subtitle: string;
  coreLine: string;
  duration: string;
  scenes: GenesisOnboardingScene[];
};

export type GenesisOnboardingSeedMemory = {
  id: "genesis-first-light";
  title: string;
  type: "onboarding_seed";
  privacy: "no_private_user_data";
  mode: "genesis_symbolic_replay";
  dateLabel: string;
  emotionLabels: string[];
  meaningLabel: string;
  relationshipLabels: string[];
  outputsAvailable: string[];
  privacyReceipt: {
    title: string;
    source: string;
    mode: string;
    privacy: string;
    userControl: string[];
  };
};

const promptStyle =
  "premium cinematic sci-fi human memory world, emotional realism, dark luminous sky, soft volumetric light, living ground, glowing orb, constellation life map, elegant UI overlays, no copyrighted characters, no brand logos, no real private data, no photoreal clone of any real person, symbolic human forms only";

export const genesisOnboardingSeedMemory: GenesisOnboardingSeedMemory = {
  id: "genesis-first-light",
  title: "The Night Everything Changed",
  type: "onboarding_seed",
  privacy: "no_private_user_data",
  mode: "genesis_symbolic_replay",
  dateLabel: "A turning point",
  emotionLabels: ["threshold", "wonder", "grief", "becoming"],
  meaningLabel: "A private moment becomes visible only as a symbolic Genesis preview.",
  relationshipLabels: ["self", "future self", "trusted person", "place"],
  outputsAvailable: ["Focus image", "Replay preview", "Passport receipt"],
  privacyReceipt: {
    title: "Memory Replay Created",
    source: "onboarding seed memory",
    mode: "Genesis symbolic replay",
    privacy: "no private data used",
    userControl: ["export", "delete", "keep"],
  },
};

export const genesisOnboardingFilm: GenesisOnboardingFilm = {
  title: "URAI Genesis Onboarding Film",
  subtitle: "A launch-safe trailer for a living world around the life you already live.",
  coreLine: "You live. URAI remembers. You choose what becomes real.",
  duration: "03:20 Genesis preview",
  scenes: [
    {
      id: "scattered-life",
      title: "A Life Is Scattered",
      timestampRange: "00:00-00:15",
      voiceover:
        "A life is not one thing. It is moments. People. Places. Pain. Joy. Work. Love. Loss. Dreams. Almosts. Again-and-agains. But most of it gets scattered. Across apps. Across years. Across your body. Across the parts of you nobody sees.",
      visualDirection:
        "Fragments of luminous cards, stars, silhouettes, calendar marks, and memory dust drift through a dark sky before they begin to orbit.",
      onScreenText: ["A life is not one thing.", "Most of it gets scattered."],
      requiredLayers: ["sky", "life-map"],
      trustSafetyNotes: ["Symbolic public preview only.", "No real private messages or personal media appear."],
      assetPrompt: `${promptStyle}, scattered life fragments orbiting in darkness`,
      fallbackAssetPath: "/genesis/onboarding/scattered-life.svg",
      optionalMotionDirection: "Slow drift inward; fragments begin to align around a quiet center.",
    },
    {
      id: "urai-appears",
      title: "URAI Appears",
      timestampRange: "00:15-00:25",
      voiceover: "URAI brings the pieces home. Not another feed. Not another dashboard. A living world for your life.",
      visualDirection:
        "The orb appears as a calm blue-white center. Scattered fragments become a quiet home world around it.",
      onScreenText: ["Not another feed.", "A living world for your life."],
      requiredLayers: ["home", "orb"],
      trustSafetyNotes: ["URAI is introduced as a consent-bound interface, not an all-knowing system."],
      assetPrompt: `${promptStyle}, glowing orb gathers life fragments into a home world`,
      fallbackAssetPath: "/genesis/onboarding/urai-home-world.svg",
      optionalMotionDirection: "Orb breathes softly; fragments settle into rings.",
    },
    {
      id: "you-live",
      title: "You Live",
      timestampRange: "00:25-00:38",
      voiceover:
        "You do not have to build the map. You live. URAI keeps up with you. It notices moments. Connects patterns. Protects context. And helps your life become visible to you.",
      visualDirection:
        "A person-shaped light walks through a symbolic world while the map forms behind them, never in front of them.",
      onScreenText: ["You do not build the map.", "You live."],
      requiredLayers: ["home", "life-map", "passport"],
      trustSafetyNotes: ["Use 'helps' and 'can' language; do not imply automatic private capture before consent."],
      assetPrompt: `${promptStyle}, symbolic person walking while a memory map forms gently behind them`,
      fallbackAssetPath: "/genesis/onboarding/you-live-background.svg",
      optionalMotionDirection: "World grows from footsteps; map lines remain soft and permission-bound.",
    },
    {
      id: "life-map-sky",
      title: "Sky Layer / Life Map",
      timestampRange: "00:38-00:52",
      voiceover:
        "Above you is your Life Map. Every star is a moment. Every cluster is a chapter. Every storm is a signal. Every thread is a relationship. Every path is a pattern.",
      visualDirection:
        "A luminous constellation field opens above a dark horizon with stars, clusters, storms, and relationship threads.",
      onScreenText: ["Every star is a moment.", "Every cluster is a chapter."],
      requiredLayers: ["sky", "life-map"],
      trustSafetyNotes: ["Life Map is a Genesis sample memory field until authenticated owner data is proven."],
      assetPrompt: `${promptStyle}, constellation life map over dark horizon with elegant route overlays`,
      fallbackAssetPath: "/genesis/onboarding/life-map-sky.svg",
      optionalMotionDirection: "Stars pulse in sequence; threads draw lightly between clusters.",
      cta: { label: "Open Life Map", href: "/life-map" },
    },
    {
      id: "orb-speaks",
      title: "Orb Speaks",
      timestampRange: "00:52-01:00",
      voiceover: "I found the moment. But I also found what it became.",
      visualDirection:
        "The orb lowers into the frame and speaks over a selected star without claiming private analysis.",
      onScreenText: ["I found the moment.", "But I also found what it became."],
      requiredLayers: ["orb", "life-map"],
      trustSafetyNotes: ["Orb copy must remain companion preview, not therapist, diagnosis, or autonomous agent."],
      assetPrompt: `${promptStyle}, central orb speaking to a selected memory star, safe companion preview`,
      fallbackAssetPath: "/genesis/onboarding/urai-home-world.svg",
      optionalMotionDirection: "Orb glow opens like an aperture; selected star answers with a soft pulse.",
    },
    {
      id: "focus-image",
      title: "Focus Image",
      timestampRange: "01:00-01:12",
      voiceover: "Tap a star, and the moment comes into Focus. Not just what happened. What it meant.",
      visualDirection:
        "A selected star becomes a cinematic memory image with emotion tags, relationship context, and a visible privacy receipt.",
      onScreenText: ["Focus reveals the meaning of a moment.", "The Night Everything Changed"],
      requiredLayers: ["focus", "life-map", "passport"],
      trustSafetyNotes: ["The focused moment is the onboarding seed memory and uses no private user data."],
      assetPrompt: `${promptStyle}, cinematic focus card for symbolic turning point memory, no private data`,
      fallbackAssetPath: "/genesis/onboarding/focus-night-everything-changed.svg",
      optionalMotionDirection: "Star blooms into a glass card; privacy receipt slides in last.",
      cta: { label: "Enter Replay", href: "/replay" },
    },
    {
      id: "replay-begins",
      title: "Replay Begins",
      timestampRange: "01:12-01:26",
      voiceover:
        "Enter the memory, and Focus becomes Replay. A moment becomes a scene. A scene becomes a film. A film becomes a world you can walk through.",
      visualDirection:
        "A road of light opens inside a memory card, becoming a symbolic cinematic replay path.",
      onScreenText: ["Replay preview", "A moment becomes a scene."],
      requiredLayers: ["replay", "focus"],
      trustSafetyNotes: ["Replay is sample/preview/fallback, not a real generated private life movie."],
      assetPrompt: `${promptStyle}, symbolic memory road opening into cinematic replay, sample only`,
      fallbackAssetPath: "/genesis/onboarding/replay-memory-road.svg",
      optionalMotionDirection: "Camera pushes into the card; path becomes a soft tunnel of memory light.",
    },
    {
      id: "ground-council",
      title: "Ground Layer / AI Council",
      timestampRange: "01:26-01:44",
      voiceover:
        "Below the sky is the ground. This is where URAI's models work. A council of agents, each with a job. Some remember. Some protect. Some create. Some guide. Some translate. Some help you move. Not one assistant. A life system.",
      visualDirection:
        "A grounded chamber opens below the Life Map with council seats labeled by role and a central Guardian boundary.",
      onScreenText: [
        "Archivist",
        "Narrator",
        "Cinematographer",
        "Worldbuilder",
        "Guardian",
        "Pattern Model",
        "Private Coach",
        "Translator",
        "Opportunity Agent",
        "Legacy Keeper",
      ],
      requiredLayers: ["ground", "council"],
      trustSafetyNotes: ["Council remains a preview; autonomous agents do not act without explicit permission."],
      assetPrompt: `${promptStyle}, grounded AI council chamber, symbolic agents, privacy guardian center`,
      fallbackAssetPath: "/genesis/onboarding/council-ground-layer.svg",
      optionalMotionDirection: "Council labels orbit the Guardian boundary; no agent leaves the circle.",
    },
    {
      id: "private-nudges",
      title: "Private Nudges",
      timestampRange: "01:44-01:56",
      voiceover: "URAI does not only replay your life. It helps you live it.",
      visualDirection:
        "Consent-bound nudge cards appear as optional suggestions with a visible permission lock and no hidden surveillance UI.",
      onScreenText: [
        "You usually crash after days like this. Drink water. Text your person. Do not make the big decision tonight.",
        "You have circled this for 11 days. Want the first step?",
        "This song, this place, and this person usually reconnect you.",
      ],
      requiredLayers: ["passport", "orb"],
      trustSafetyNotes: ["Nudges are future/permissioned examples, not live passive sensing proof."],
      assetPrompt: `${promptStyle}, private nudge cards with permission locks, warm and non-surveillance`,
      fallbackAssetPath: "/genesis/onboarding/private-nudges.svg",
      optionalMotionDirection: "Cards appear only after a consent glow; cards can dismiss themselves.",
    },
    {
      id: "life-films",
      title: "Life Films",
      timestampRange: "01:56-02:07",
      voiceover:
        "One memory can become a Replay. Many memories can become a Life Film. Not a slideshow. A cinematic map of becoming.",
      visualDirection:
        "Memory stars align into a film timeline with a sample/fallback badge and a locked provider-backed generation layer.",
      onScreenText: ["Life Film preview", "A cinematic map of becoming."],
      requiredLayers: ["life-films", "replay"],
      trustSafetyNotes: ["Life Films are gated until provider-backed generation, storage, consent, export, delete, tests, and smoke proof exist."],
      assetPrompt: `${promptStyle}, cinematic memory film timeline, symbolic frames, sample preview badge`,
      fallbackAssetPath: "/genesis/onboarding/life-film-timeline.svg",
      optionalMotionDirection: "Frames assemble into a ribbon, then stop at a gated proof marker.",
    },
    {
      id: "memory-music-videos",
      title: "Memory Music Videos",
      timestampRange: "02:07-02:18",
      voiceover:
        "Some memories become films. Some become music. Some become something you can finally feel without explaining.",
      visualDirection:
        "A waveform and lyric line move through a memory sky without implying a final sonic system is live.",
      onScreenText: ["I was not lost. I was becoming."],
      requiredLayers: ["music", "replay"],
      trustSafetyNotes: ["Music videos are concept/preview until real licensed audio, provider pipeline, and user approval are proven."],
      assetPrompt: `${promptStyle}, memory music video waveform through night sky, lyric card, sample preview`,
      fallbackAssetPath: "/genesis/onboarding/memory-music-video.svg",
      optionalMotionDirection: "Waveform glows with the lyric, then fades back into the Life Map.",
    },
    {
      id: "symbolic-people",
      title: "Living Memories / Symbolic People",
      timestampRange: "02:18-02:38",
      voiceover:
        "Some memories are places. Some are people. Some are conversations you still carry. URAI can create symbolic people and living memories: emotional mirrors to help you understand, remember, prepare, forgive, and heal.",
      visualDirection:
        "Two symbolic human silhouettes talk inside a memory mirror while the orb keeps a consent boundary visible.",
      onScreenText: [
        "User: You made it farther than you knew.",
        "Younger self: Then why did it feel like I was losing?",
        "Orb: Because you were surviving before you had language for it.",
        "Symbolic. Consent-based. Not a replacement for real people.",
      ],
      requiredLayers: ["symbolic-people", "orb", "passport"],
      trustSafetyNotes: ["No real-person cloning, no replacement for real people, no therapy/diagnosis claim."],
      assetPrompt: `${promptStyle}, symbolic human silhouettes in memory mirror, consent boundary, no real person likeness`,
      fallbackAssetPath: "/genesis/onboarding/symbolic-people.svg",
      optionalMotionDirection: "Silhouettes remain abstract; consent boundary stays on screen.",
    },
    {
      id: "ar-vr-xr",
      title: "AR / VR / XR",
      timestampRange: "02:38-02:50",
      voiceover:
        "In AR, memories can live in your real space. In VR, memories become worlds. In XR, your outer world and inner world can finally speak.",
      visualDirection:
        "A room, headset portal, and blended horizon appear as labeled preview surfaces.",
      onScreenText: ["AR preview", "VR preview", "XR preview", "Worlds remain gated until proven."],
      requiredLayers: ["spatial"],
      trustSafetyNotes: ["Spatial worlds are preview surfaces, not complete AR/VR/XR production systems."],
      assetPrompt: `${promptStyle}, AR VR XR memory worlds preview, symbolic portals, not production claim`,
      fallbackAssetPath: "/genesis/onboarding/ar-vr-xr-worlds.svg",
      optionalMotionDirection: "Three portals open, then lock behind a preview badge.",
    },
    {
      id: "passport-ownership",
      title: "Passport / Data Ownership",
      timestampRange: "02:50-03:06",
      voiceover:
        "And none of this matters if it is not yours. Your memories. Your emotional map. Your Life Films. Your signals. Your permissions. Your data. Private by default. Shared only with permission. Licensed only with consent. If your life creates value, you should have a say in that value.",
      visualDirection:
        "A Passport receipt lists user-owned data controls, export/delete options, consent receipts, and license-by-consent boundaries.",
      onScreenText: [
        "Private by default",
        "User-owned data",
        "Consent receipts",
        "Export anytime",
        "Delete anytime",
        "Share by permission",
        "License by consent",
      ],
      requiredLayers: ["passport"],
      trustSafetyNotes: ["Do not claim marketplace payouts are live; license by consent remains gated until legal/privacy proof exists."],
      assetPrompt: `${promptStyle}, privacy passport receipt, user-owned controls, export delete consent cards`,
      fallbackAssetPath: "/genesis/onboarding/passport-ownership.svg",
      optionalMotionDirection: "Receipts stack into a protected Passport card.",
      cta: { label: "Open Passport", href: "/passport" },
    },
    {
      id: "global-emotional-map",
      title: "Global Emotional Map",
      timestampRange: "03:06-03:18",
      voiceover:
        "With permission, human signal can help us understand loneliness, stress, recovery, belonging, grief, joy, and hope. Built for care. Not exploitation.",
      visualDirection:
        "An anonymized global field lights up as abstract human signals with clear permission and anonymization badges.",
      onScreenText: ["Anonymized.", "Permissioned.", "Human-centered."],
      requiredLayers: ["global-map", "passport"],
      trustSafetyNotes: ["Global signal is roadmap/permissioned; no live data marketplace or surveillance claim."],
      assetPrompt: `${promptStyle}, anonymized global emotional map, permission badges, care not exploitation`,
      fallbackAssetPath: "/genesis/onboarding/global-emotional-map.svg",
      optionalMotionDirection: "Signals glow only after permission markers appear.",
    },
    {
      id: "accessibility-legacy",
      title: "Accessibility / Legacy",
      timestampRange: "03:18-03:34",
      voiceover:
        "For people who cannot see it, URAI can speak it. For people who cannot hear it, URAI can show it. For people carrying trauma, URAI can soften the doorway. For families, it can preserve what time tries to take.",
      visualDirection:
        "Accessible captions, audio waves, tactile light, and family archive stars gather around a soft legacy tree.",
      onScreenText: ["Speak it.", "Show it.", "Soften the doorway.", "Preserve what time tries to take."],
      requiredLayers: ["accessibility", "legacy"],
      trustSafetyNotes: ["Accessibility and legacy are aspirational/product direction unless proven in code and smoke evidence."],
      assetPrompt: `${promptStyle}, accessible memory interface, captions, audio waves, legacy tree, gentle light`,
      fallbackAssetPath: "/genesis/onboarding/accessibility-legacy.svg",
      optionalMotionDirection: "Caption ribbons and sound waves meet at a legacy star.",
    },
    {
      id: "final-home-return",
      title: "Final Return Home",
      timestampRange: "03:34-03:50",
      voiceover:
        "URAI is your home. Your sky. Your ground. Your orb. Your council. Your map. Your films. Your worlds. Your memories. Your data. Your future. You do not have to feed another app. Just live. You live. URAI remembers. You choose what becomes real.",
      visualDirection:
        "All layers return to the orb and resolve into the URAI Genesis logo and the final Life Map CTA.",
      onScreenText: ["URAI Genesis", "Your life is a living world.", "You live. URAI remembers. You choose what becomes real."],
      requiredLayers: ["home", "sky", "ground", "orb", "life-map", "passport"],
      trustSafetyNotes: ["Final line stays aspirational and user-controlled; no unsupported production claim."],
      assetPrompt: `${promptStyle}, final home return, orb, sky, ground, map, passport, URAI Genesis logo atmosphere`,
      fallbackAssetPath: "/genesis/onboarding/final-home-return.svg",
      optionalMotionDirection: "Every layer collapses into the orb; final CTA appears after a calm pause.",
      cta: { label: "Begin Your Life Map", href: "/life-map" },
    },
  ],
};

export const genesisOnboardingCoreLines = [
  "You live. URAI remembers. You choose what becomes real.",
  "Your life is a living world.",
  "You do not build the map. You live.",
  "Not another feed. A world for your life.",
  "The sky remembers. The ground works. The orb guides.",
];
