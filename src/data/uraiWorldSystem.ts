export type UraiWorldLayerId = "ground" | "sky" | "horizon" | "orb" | "chat";

export type UraiWorldStatus =
  | "Live route"
  | "Preview"
  | "Demo"
  | "Guide"
  | "Consent-first"
  | "Gated"
  | "Roadmap"
  | "Safe"
  | "Connected";

export type UraiWorldAction = {
  label: string;
  href: string;
  note: string;
};

export type UraiWorldNode = {
  id: string;
  label: string;
  status: UraiWorldStatus;
  copy: string;
  href: string;
  positionClass: string;
};

export type UraiWorldCard = {
  title: string;
  status: UraiWorldStatus;
  body: string;
};

export type UraiWorldPrompt = {
  label: string;
  prompt: string;
  status: UraiWorldStatus;
};

export type UraiWorldLayer = {
  id: UraiWorldLayerId;
  route: string;
  name: string;
  navLabel: string;
  navStatus: string;
  eyebrow: string;
  title: string;
  tagline: string;
  body: string;
  trustLine: string;
  orbMood: string;
  orbStatus: string;
  visualLabel: string;
  visualTitle: string;
  visualBody: string;
  spatialRole: string;
  layerFeeling: string;
  metadataDescription: string;
  primaryActions: UraiWorldAction[];
  nodes: UraiWorldNode[];
  cards: UraiWorldCard[];
  prompts: UraiWorldPrompt[];
  isList: string[];
  isNotList: string[];
  safetyTitle: string;
  safetyCopy: string;
};

export const uraiWorldNavigation: Array<{
  id: UraiWorldLayerId | "home" | "life-map" | "focus" | "replay" | "passport";
  label: string;
  href: string;
  status: string;
}> = [
  { id: "home", label: "Home", href: "/home", status: "Entry" },
  { id: "life-map", label: "Life Map", href: "/life-map", status: "Preview" },
  { id: "focus", label: "Focus", href: "/focus", status: "Demo" },
  { id: "replay", label: "Replay", href: "/replay", status: "Preview" },
  { id: "passport", label: "Passport", href: "/passport", status: "Consent" },
  { id: "ground", label: "Ground", href: "/ground", status: "Base" },
  { id: "sky", label: "Sky", href: "/sky", status: "Upper" },
  { id: "horizon", label: "Horizon", href: "/horizon", status: "Bridge" },
  { id: "orb", label: "Orb", href: "/orb", status: "Presence" },
  { id: "chat", label: "Orb Chat", href: "/orb-chat", status: "Cockpit" },
];

export const uraiWorldLayers: UraiWorldLayer[] = [
  {
    id: "ground",
    route: "/ground",
    name: "Ground",
    navLabel: "URAI GROUND",
    navStatus: "Foundation",
    eyebrow: "Ground Layer",
    title: "Stand inside the living foundation beneath your life.",
    tagline: "The base world where memory roots, council logic, private compute, and consent boundaries become visible before anything touches private data.",
    body: "Ground is the infrastructure layer of URAI Genesis: models, jobs, data vaults, signal rivers, and ownership boundaries shown as a safe cinematic preview. Real sensing, health, device, location, and biometric systems remain closed until Passport consent and launch evidence pass.",
    trustLine: "No passive tracking, health inference, location sensing, microphone, camera, biometrics, or autonomous jobs run in this public Ground preview.",
    orbMood: "anchored",
    orbStatus: "Rooted / bounded / not sensing",
    visualLabel: "Foundation visual / council preview",
    visualTitle: "The roots light up before the sensors do.",
    visualBody: "Ground shows the shape of a private base layer without connecting real-world signals or private account sources.",
    spatialRole: "Foundation layer",
    layerFeeling: "Signal rivers below, memory roots around you, the Orb holding the center line.",
    metadataDescription:
      "Ground is URAI Genesis's launch-safe foundation layer: a cinematic preview of roots, model councils, private compute, and consent boundaries while sensing remains gated.",
    primaryActions: [
      { label: "Enter Sky", href: "/sky", note: "upper layer" },
      { label: "Open Horizon", href: "/horizon", note: "future seam" },
      { label: "Talk to Orb", href: "/orb-chat", note: "cockpit" },
      { label: "Review Passport", href: "/passport", note: "consent" },
      { label: "Return Home", href: "/home", note: "entry" },
    ],
    nodes: [
      {
        id: "root-core",
        label: "Root Core",
        status: "Preview",
        copy: "The safe base state. It renders the private-compute metaphor without reading private signals.",
        href: "/ground",
        positionClass: "left-[50%] top-[58%]",
      },
      {
        id: "model-council",
        label: "Council Vault",
        status: "Gated",
        copy: "Multi-model review remains gated until provider, audit, policy, and admin evidence pass.",
        href: "/status",
        positionClass: "left-[72%] top-[68%]",
      },
      {
        id: "job-nodes",
        label: "Job Nodes",
        status: "Gated",
        copy: "Autonomous jobs and workers are visible as future infrastructure, not live action.",
        href: "/status",
        positionClass: "left-[30%] top-[68%]",
      },
      {
        id: "data-vault",
        label: "Data Vault",
        status: "Consent-first",
        copy: "Ownership, export, delete, revoke, and consent boundaries sit below every future layer.",
        href: "/passport",
        positionClass: "left-[24%] top-[45%]",
      },
      {
        id: "signal-river",
        label: "Signal River",
        status: "Roadmap",
        copy: "Passive and contextual signals stay closed until explicit consent and retention rules exist.",
        href: "/status",
        positionClass: "left-[74%] top-[42%]",
      },
      {
        id: "sky-lift",
        label: "Sky Lift",
        status: "Preview",
        copy: "The base layer rises into Sky as symbolic atmosphere, not live emotional inference.",
        href: "/sky",
        positionClass: "left-[50%] top-[24%]",
      },
    ],
    cards: [
      {
        title: "Infrastructure, not surveillance",
        status: "Safe",
        body: "Ground shows the promise of private infrastructure without silently collecting real-world signals.",
      },
      {
        title: "Council and jobs stay gated",
        status: "Gated",
        body: "Model councils, autonomous workers, provider actions, and job execution remain behind release evidence.",
      },
      {
        title: "Ownership is visible first",
        status: "Consent-first",
        body: "Passport boundaries are part of the world, not fine print hidden after the experience begins.",
      },
      {
        title: "The Orb anchors the base",
        status: "Guide",
        body: "The same Orb presence appears here as a stabilizing center, not as an always-on listener.",
      },
    ],
    prompts: [
      { label: "Explain the base", prompt: "Show me what Ground means without using private data.", status: "Demo" },
      { label: "Find consent", prompt: "Take me to the Passport boundary before anything sensitive opens.", status: "Consent-first" },
      { label: "Check gates", prompt: "Which jobs, councils, and signals are still gated?", status: "Safe" },
    ],
    isList: [
      "The foundation layer beneath the URAI world",
      "A cinematic preview of private compute, councils, jobs, and ownership vaults",
      "A consent-first bridge into future physical-world context",
      "A shared world view connected to Sky, Horizon, Orb, and Passport",
    ],
    isNotList: [
      "Passive sensing or background tracking",
      "Medical, therapy, diagnosis, or emergency support",
      "Live health, sleep, location, camera, microphone, or biometric monitoring",
      "Autonomous jobs, provider integrations, or real-world action",
    ],
    safetyTitle: "Ground remains a Genesis preview.",
    safetyCopy:
      "Live sensing, health data, recovery inference, location, device, camera, microphone, calendar, contacts, Gmail, biometrics, autonomous jobs, and provider-backed councils stay closed until consent, rules, retention, export/delete, audit, and smoke evidence pass.",
  },
  {
    id: "sky",
    route: "/sky",
    name: "Sky",
    navLabel: "URAI SKY",
    navStatus: "Upper layer",
    eyebrow: "Sky Layer",
    title: "The dream layer above the system, wide open but not watching.",
    tagline: "Constellations, symbolic weather, memory light, and future selves drift above the world as preview atmosphere, not hidden inference.",
    body: "Sky gives URAI its upper consciousness layer: spacious reflection, possibility, emotional atmosphere, and constellation paths. In Genesis it stays local, symbolic, and public-safe while passive signals and derived intelligence remain gated.",
    trustLine: "No hidden sensing, mood tracking, health inference, location, camera, microphone, device, or biometric capture occurs in this Sky preview.",
    orbMood: "expansive",
    orbStatus: "Expansive / reflective / no passive sensing",
    visualLabel: "Atmosphere visual / safe preview",
    visualTitle: "The sky opens before the sensors do.",
    visualBody: "Sky creates spacious emotional weather as a visual language without claiming live mood, health, or private-context intelligence.",
    spatialRole: "Upper consciousness layer",
    layerFeeling: "Constellations overhead, memory light drifting, the Orb rising into atmosphere.",
    metadataDescription:
      "Sky is URAI Genesis's launch-safe upper layer: a dreamlike visual atmosphere for reflection, constellations, and possibility while passive sensing remains gated.",
    primaryActions: [
      { label: "Open Horizon", href: "/horizon", note: "future seam" },
      { label: "Touch Ground", href: "/ground", note: "base layer" },
      { label: "Talk to Orb", href: "/orb-chat", note: "cockpit" },
      { label: "Open Life Map", href: "/life-map", note: "memory field" },
      { label: "Return Home", href: "/home", note: "entry" },
    ],
    nodes: [
      {
        id: "atmosphere",
        label: "Atmosphere",
        status: "Preview",
        copy: "The visual mood layer of URAI Genesis. It is atmosphere, not live inference.",
        href: "/sky",
        positionClass: "left-[50%] top-[34%]",
      },
      {
        id: "constellation-drift",
        label: "Constellation Drift",
        status: "Preview",
        copy: "Sample stars and arcs show how reflection may feel without using private memory data.",
        href: "/life-map",
        positionClass: "left-[31%] top-[28%]",
      },
      {
        id: "emotional-weather",
        label: "Symbolic Weather",
        status: "Gated",
        copy: "Future emotional-weather systems remain gated. No live mood tracking runs here.",
        href: "/status",
        positionClass: "left-[72%] top-[29%]",
      },
      {
        id: "future-selves",
        label: "Future Selves",
        status: "Roadmap",
        copy: "Future-self visuals are symbolic, not private forecasting or psychological claims.",
        href: "/horizon",
        positionClass: "left-[76%] top-[58%]",
      },
      {
        id: "passport-boundary",
        label: "Passport Boundary",
        status: "Consent-first",
        copy: "Sensitive context opens only through Passport, export/delete controls, and explicit consent.",
        href: "/passport",
        positionClass: "left-[23%] top-[58%]",
      },
      {
        id: "ground-anchor",
        label: "Ground Anchor",
        status: "Preview",
        copy: "Return to the stabilizing base layer. No location, health, or device signals are connected.",
        href: "/ground",
        positionClass: "left-[50%] top-[76%]",
      },
    ],
    cards: [
      {
        title: "Expansive, not empty",
        status: "Preview",
        body: "Sky creates a high atmosphere for reflection without becoming a blank page or fake sensor dashboard.",
      },
      {
        title: "No hidden sensing",
        status: "Safe",
        body: "Location, audio, camera, device, health, sleep, and biometric capture remain closed in public demo mode.",
      },
      {
        title: "Dreams remain symbolic",
        status: "Roadmap",
        body: "Future paths and possible selves are framed as visual metaphor, not predictions or personal advice.",
      },
      {
        title: "Orb rises through the sky",
        status: "Guide",
        body: "The Orb presence remains recognizable, calm, and bounded across the full world system.",
      },
    ],
    prompts: [
      { label: "Read the sky", prompt: "What does this atmosphere mean without tracking me?", status: "Demo" },
      { label: "Open the seam", prompt: "Take me from Sky into Horizon.", status: "Preview" },
      { label: "Protect context", prompt: "Show which emotional systems are gated.", status: "Safe" },
    ],
    isList: [
      "The upper atmosphere of the URAI world",
      "A safe visual layer for dreams, constellations, and possibility",
      "A public preview using sample and symbolic states",
      "Connected to Ground, Horizon, Life Map, Orb, and Passport",
    ],
    isNotList: [
      "Surveillance, passive sensing, or background tracking",
      "Emotional diagnosis, therapy, or emergency support",
      "Live mood, health, location, audio, camera, or biometric capture",
      "Provider-backed private-memory intelligence or autonomous jobs",
    ],
    safetyTitle: "Sky is a visual preview only.",
    safetyCopy:
      "Emotional weather, passive signals, device context, health data, biometrics, location, camera, microphone, provider-backed intelligence, and derived private context remain gated until consent, privacy controls, export/delete, tests, audit, and live smoke evidence are complete.",
  },
  {
    id: "horizon",
    route: "/horizon",
    name: "Horizon",
    navLabel: "URAI HORIZON",
    navStatus: "Transition",
    eyebrow: "Horizon Layer",
    title: "Where life signal becomes generated experience, but only after proof.",
    tagline: "The seam between Ground and Sky: the place where Replay, life films, XR worlds, jobs, nudges, and reflections are visible as a future path, not as live claims.",
    body: "Horizon frames where URAI may help turn approved life signal into cinematic threads, generated worlds, private nudges, and future reflections. In Genesis it remains a roadmap-style preview while owner-scoped systems, media generation, exports, automation, and autonomous jobs stay gated until proven.",
    trustLine: "No personal forecasting, private recommendations, provider-backed life planning, generated media completion, exports, or autonomous systems run in this Horizon preview.",
    orbMood: "generative",
    orbStatus: "Generative / preview / evidence-gated",
    visualLabel: "Horizon visual / roadmap preview",
    visualTitle: "The path opens before it becomes personal.",
    visualBody: "Horizon shows a future edge and generated-experience seam without presenting private forecasting or production media generation as available.",
    spatialRole: "Transition layer",
    layerFeeling: "Ground infrastructure below, Sky possibility above, the Orb illuminating the seam between them.",
    metadataDescription:
      "Horizon is URAI Genesis's launch-safe transition layer: a cinematic roadmap preview for generated experiences, Replay, XR worlds, jobs, and future direction while private systems remain gated.",
    primaryActions: [
      { label: "Open Replay", href: "/replay", note: "cinematic preview" },
      { label: "Open Life Map", href: "/life-map", note: "memory field" },
      { label: "Talk to Orb", href: "/orb-chat", note: "cockpit" },
      { label: "Touch Ground", href: "/ground", note: "base layer" },
      { label: "Join Early Access", href: "/launch", note: "real CTA" },
    ],
    nodes: [
      {
        id: "replay-path",
        label: "Replay Path",
        status: "Preview",
        copy: "Cinematic thread previews begin from selected sample memories. Real generated life films remain gated.",
        href: "/replay",
        positionClass: "left-[66%] top-[39%]",
      },
      {
        id: "life-film-gate",
        label: "Life Film Gate",
        status: "Gated",
        copy: "Full production life movies require owner approval, provider output, storage, artifacts, and smoke proof.",
        href: "/status",
        positionClass: "left-[34%] top-[42%]",
      },
      {
        id: "xr-world-gate",
        label: "XR World Gate",
        status: "Roadmap",
        copy: "XR memory worlds remain preview/gated until device, provider, asset, and fallback evidence exists.",
        href: "/spatial",
        positionClass: "left-[76%] top-[58%]",
      },
      {
        id: "job-gate",
        label: "Job Gate",
        status: "Gated",
        copy: "Autonomous jobs and agents are not live. Worker, cancel, audit, and permission gates must pass first.",
        href: "/status",
        positionClass: "left-[24%] top-[61%]",
      },
      {
        id: "passport-boundary",
        label: "Passport Boundary",
        status: "Consent-first",
        copy: "Future-facing systems open only through consent, ownership, export, delete, and revoke controls.",
        href: "/passport",
        positionClass: "left-[50%] top-[74%]",
      },
      {
        id: "sky-field",
        label: "Sky Field",
        status: "Preview",
        copy: "Sky supplies atmosphere above the seam while emotional inference remains closed.",
        href: "/sky",
        positionClass: "left-[50%] top-[24%]",
      },
    ],
    cards: [
      {
        title: "Generated experiences are framed, not faked",
        status: "Gated",
        body: "Life films, XR worlds, exports, and music-video systems stay closed until real artifacts exist.",
      },
      {
        title: "Replay connects the path",
        status: "Preview",
        body: "Replay is the public-safe cinematic thread that shows direction without pretending full generation is live.",
      },
      {
        title: "Ground and Sky meet here",
        status: "Connected",
        body: "Horizon now visually bridges the infrastructure below and the dream atmosphere above.",
      },
      {
        title: "Passport controls the future edge",
        status: "Consent-first",
        body: "Future-facing systems remain bound by consent, ownership, export, delete, and revoke controls.",
      },
    ],
    prompts: [
      { label: "Explain Replay", prompt: "What can Replay preview today, and what stays gated?", status: "Preview" },
      { label: "Show generated gates", prompt: "Which generated-film and XR systems still need proof?", status: "Safe" },
      { label: "Open Life Map", prompt: "Take me back to the sample memory field.", status: "Demo" },
    ],
    isList: [
      "A transition layer between Ground and Sky",
      "A roadmap-style view of generated experiences and future direction",
      "A bridge into Replay, Life Map, Orb, and Passport",
      "A public-safe preview of what opens only after evidence",
    ],
    isNotList: [
      "Guaranteed forecasting or private-life prediction",
      "Autonomous job planning or action in the world",
      "Production media generation, exports, or marketplace flows",
      "A claim that owner-scoped generated systems are already live",
    ],
    safetyTitle: "Horizon is a roadmap-style Genesis preview.",
    safetyCopy:
      "Real generated life films, autonomous jobs, marketplace flows, export systems, private forecasting, provider-backed life planning, XR worlds, and production media generation remain gated until infrastructure, privacy controls, owner-scoped storage, tests, and smoke evidence are complete.",
  },
  {
    id: "orb",
    route: "/orb",
    name: "Orb",
    navLabel: "URAI ORB",
    navStatus: "Presence",
    eyebrow: "Orb Presence",
    title: "The living intelligence presence binding the whole world.",
    tagline: "The Orb is the recognizable center of URAI: a calm guide, boundary-holder, and interface bridge across Ground, Sky, Horizon, Life Map, Replay, and Passport.",
    body: "The Orb is not decoration. It is URAI's front-facing presence: the companion-shaped interface that can orient the public demo, explain what is sample or gated, and guide the user without claiming private memory access or provider intelligence is live.",
    trustLine: "The Orb is visible and useful in Genesis, but it is not listening, diagnosing, reading private memories, or operating autonomous agents.",
    orbMood: "awake",
    orbStatus: "Awake / bounded / not listening",
    visualLabel: "Central presence / identity preview",
    visualTitle: "The Orb is the face of the world system.",
    visualBody: "The same living presence appears across every layer, holding continuity while private intelligence remains gated.",
    spatialRole: "Central intelligence presence",
    layerFeeling: "The world gathers around one calm center: aware in form, bounded in capability.",
    metadataDescription:
      "The URAI Orb is the Genesis companion presence: a cinematic, privacy-first guide that binds Ground, Sky, Horizon, Replay, Life Map, and Passport while private intelligence remains gated.",
    primaryActions: [
      { label: "Open Orb Chat", href: "/orb-chat", note: "cockpit" },
      { label: "Open Horizon", href: "/horizon", note: "future seam" },
      { label: "Touch Ground", href: "/ground", note: "base layer" },
      { label: "Enter Sky", href: "/sky", note: "upper layer" },
      { label: "Review Passport", href: "/passport", note: "consent" },
    ],
    nodes: [
      {
        id: "orb-core",
        label: "Orb Core",
        status: "Guide",
        copy: "The central presence can orient the demo and explain boundaries without claiming private context.",
        href: "/orb",
        positionClass: "left-[50%] top-[42%]",
      },
      {
        id: "chat-entry",
        label: "Chat Cockpit",
        status: "Demo",
        copy: "Speak to the safe public cockpit. Provider-backed private chat remains gated.",
        href: "/orb-chat",
        positionClass: "left-[50%] top-[73%]",
      },
      {
        id: "life-map-lens",
        label: "Life Map Lens",
        status: "Preview",
        copy: "The Orb points into the sample memory field without reading private user data.",
        href: "/life-map",
        positionClass: "left-[27%] top-[56%]",
      },
      {
        id: "passport-lock",
        label: "Passport Lock",
        status: "Consent-first",
        copy: "Private memory, voice, provider intelligence, and account context open only through consent gates.",
        href: "/passport",
        positionClass: "left-[73%] top-[56%]",
      },
      {
        id: "sky-beacon",
        label: "Sky Beacon",
        status: "Preview",
        copy: "The Orb carries a consistent visual identity into Sky and Horizon.",
        href: "/sky",
        positionClass: "left-[33%] top-[28%]",
      },
      {
        id: "ground-anchor",
        label: "Ground Anchor",
        status: "Preview",
        copy: "The Orb remains grounded in consent, safety, and non-surveillance boundaries.",
        href: "/ground",
        positionClass: "left-[67%] top-[28%]",
      },
    ],
    cards: [
      {
        title: "Companion, not controller",
        status: "Guide",
        body: "The Orb guides and explains without taking over or claiming autonomous action.",
      },
      {
        title: "One presence across all layers",
        status: "Connected",
        body: "Ground, Sky, Horizon, and Chat now share the same Orb identity and world language.",
      },
      {
        title: "Provider intelligence stays gated",
        status: "Gated",
        body: "Deeper AI behavior requires server-only configuration, consent, tests, and smoke evidence.",
      },
      {
        title: "Fallback stays cinematic",
        status: "Safe",
        body: "If live companion state is unavailable, URAI shows a calm chamber, not raw errors.",
      },
    ],
    prompts: [
      { label: "Guide me", prompt: "Where should I go first in Genesis?", status: "Demo" },
      { label: "Explain boundaries", prompt: "What is sample, gated, and private?", status: "Safe" },
      { label: "Open the cockpit", prompt: "Take me into Orb Chat.", status: "Demo" },
    ],
    isList: [
      "The central visual and conversational presence of URAI Genesis",
      "A guide through Ground, Sky, Horizon, Life Map, Replay, and Passport",
      "A boundary-holder that explains what is live, preview, gated, or private",
      "A calm fallback identity when richer provider systems are unavailable",
    ],
    isNotList: [
      "An always-on listener or private-data browser",
      "Therapy, diagnosis, emergency support, or medical advice",
      "Provider-backed private-memory intelligence unless configured and proven",
      "An autonomous agent acting in the world",
    ],
    safetyTitle: "Orb is a Genesis companion preview.",
    safetyCopy:
      "The Orb does not prove therapy, diagnosis, autonomous agents, passive sensing, live voice/listening, provider-backed intelligence, or production private-memory AI. Those systems stay gated until consent, server-only configuration, tests, audit, and live smoke evidence pass.",
  },
  {
    id: "chat",
    route: "/orb-chat",
    name: "Orb Chat",
    navLabel: "URAI ORB CHAT",
    navStatus: "Cockpit",
    eyebrow: "Orb Chat Cockpit",
    title: "Speak to the Orb from inside the living world.",
    tagline: "Orb Chat is not a plain chat box. It is the conversational cockpit for moving through Ground, Sky, Horizon, Passport, Replay, and Life Map safely.",
    body: "In Genesis, Orb Chat can guide public demo routes, explain consent boundaries, and show what remains gated. Private memory context, provider-backed intelligence, voice, passive sources, and account data stay closed until production proof exists.",
    trustLine: "No raw private logs, hidden account memories, Gmail, Calendar, Contacts, location, voice, or passive sources appear in this public cockpit.",
    orbMood: "listening",
    orbStatus: "Listening visually / private chat gated",
    visualLabel: "Conversational cockpit / safe demo",
    visualTitle: "You do not feed the app. You live, and URAI is built to organize around you with consent.",
    visualBody: "Genesis shows the cockpit shape without enabling private provider chat or background data access.",
    spatialRole: "Conversational entry",
    layerFeeling: "A quiet command chamber around the Orb, with Ground, Sky, and Horizon context rails visible.",
    metadataDescription:
      "Orb Chat is URAI Genesis's safe conversational cockpit: a public demo guide embedded in the same world system while private provider-backed intelligence remains gated.",
    primaryActions: [
      { label: "Start with Life Map", href: "/life-map", note: "memory field" },
      { label: "Open Passport", href: "/passport", note: "consent" },
      { label: "Enter Ground", href: "/ground", note: "base layer" },
      { label: "Open Horizon", href: "/horizon", note: "future seam" },
      { label: "Orb Identity", href: "/orb", note: "presence" },
    ],
    nodes: [
      {
        id: "ground-context",
        label: "Ground Context",
        status: "Preview",
        copy: "The cockpit can point to the foundation layer without reading live signals.",
        href: "/ground",
        positionClass: "left-[24%] top-[68%]",
      },
      {
        id: "sky-context",
        label: "Sky Context",
        status: "Preview",
        copy: "The cockpit can open the atmosphere layer without claiming emotional inference.",
        href: "/sky",
        positionClass: "left-[28%] top-[32%]",
      },
      {
        id: "horizon-context",
        label: "Horizon Context",
        status: "Roadmap",
        copy: "The cockpit can explain generated-experience gates without faking generated output.",
        href: "/horizon",
        positionClass: "left-[74%] top-[32%]",
      },
      {
        id: "passport-context",
        label: "Passport Context",
        status: "Consent-first",
        copy: "Consent, export, delete, and revoke boundaries stay visible before private systems open.",
        href: "/passport",
        positionClass: "left-[76%] top-[68%]",
      },
      {
        id: "orb-core",
        label: "Orb Core",
        status: "Guide",
        copy: "The central presence stays calm and bounded while private provider chat remains gated.",
        href: "/orb",
        positionClass: "left-[50%] top-[48%]",
      },
    ],
    cards: [
      {
        title: "Guidance without pretending to know you",
        status: "Demo",
        body: "The cockpit can route and explain Genesis without loading private account memories.",
      },
      {
        title: "Provider chat remains gated",
        status: "Gated",
        body: "Server-only credentials, consent, policy, and live smoke evidence are required before private chat opens.",
      },
      {
        title: "Context rails are visible",
        status: "Connected",
        body: "Ground, Sky, Horizon, Passport, and Orb now appear as one coherent conversational environment.",
      },
      {
        title: "No raw errors or fake thinking",
        status: "Safe",
        body: "Unavailable companion state resolves to a polished safe cockpit, not internal provider or Firebase errors.",
      },
    ],
    prompts: [
      { label: "What is live?", prompt: "Show me what is live, preview, and gated in Genesis.", status: "Safe" },
      { label: "Take me through the world", prompt: "Guide me from Ground to Sky to Horizon.", status: "Demo" },
      { label: "Protect my data", prompt: "Explain the Passport boundary before private systems open.", status: "Consent-first" },
      { label: "Show me Replay", prompt: "Open the cinematic preview without claiming full generation is live.", status: "Preview" },
    ],
    isList: [
      "The conversational cockpit for the URAI world",
      "A safe route guide through public Genesis layers",
      "A place to understand consent, previews, and gated systems",
      "A visual bridge between Orb identity and future private intelligence",
    ],
    isNotList: [
      "A live private-memory chatbot for every user",
      "An always-on listener, therapist, or diagnostic system",
      "A provider-backed AI agent unless configured, consented, tested, and smoke-proven",
      "A raw log viewer for private data, secrets, or internal errors",
    ],
    safetyTitle: "Private companion intelligence stays gated.",
    safetyCopy:
      "Public demo mode uses safe sample or empty states. Private memory, account context, provider-backed intelligence, voice/listening, Gmail, Calendar, Contacts, device data, passive sources, and raw logs remain closed until Passport, server-only configuration, tests, and live evidence pass.",
  },
];

export function getUraiWorldLayer(id: UraiWorldLayerId): UraiWorldLayer {
  const layer = uraiWorldLayers.find((item) => item.id === id);
  if (!layer) {
    throw new Error(`Unknown URAI world layer: ${id}`);
  }
  return layer;
}
