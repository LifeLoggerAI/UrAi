import type { Metadata } from "next";
import SystemCommandCenter from "@/components/system/SystemCommandCenter";
import {
  getStagingEvidenceNotes,
  getStagingEvidenceState,
  getSystemRegistry,
  validateSystemRegistryShape,
  type SystemRepo,
} from "@/lib/system-registry";

export const metadata: Metadata = {
  title: "URAI System Command Center",
  description: "Canonical registry-backed URAI launch truth, evidence gates, blockers, and release posture.",
  alternates: { canonical: "/system" },
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
    },
  },
  openGraph: {
    title: "URAI System Command Center",
    description: "Registry-backed URAI launch truth for system roles, evidence gates, and blockers.",
    url: "/system",
    images: [{ url: "/og/urai-public-demo.svg", width: 1200, height: 630, alt: "URAI system command center" }],
  },
};

const sectionDefinitions: { id: string; title: string; description: string; repos: string[] }[] = [
  {
    id: "genesis-spine",
    title: "Genesis Spine",
    description: "Canonical app, staging proving ground, and privacy gate. This is the safest public launch path and the first place to inspect before claims expand.",
    repos: ["LifeLoggerAI/UrAi", "LifeLoggerAI/urai-staging", "LifeLoggerAI/urai-privacy"],
  },
  {
    id: "admin-jobs-content",
    title: "Admin / Jobs / Content",
    description: "Operator control plane, async execution layer, and canonical content/template layer. These support the spine but still require proof before production claims.",
    repos: ["LifeLoggerAI/urai-admin", "LifeLoggerAI/urai-jobs", "LifeLoggerAI/urai-content"],
  },
  {
    id: "intelligence-media",
    title: "Intelligence / Narrative / Media",
    description: "Spatial, analytics, asset, story, communications, and B2B systems. These stay gated, preview, roadmap, or blocked until privacy and provider evidence exists.",
    repos: ["LifeLoggerAI/urai-spatial", "LifeLoggerAI/asset-factory", "LifeLoggerAI/urai-analytics", "LifeLoggerAI/urai-storytime", "LifeLoggerAI/urai-communications", "LifeLoggerAI/B2Bportal"],
  },
  {
    id: "external-surfaces",
    title: "External Ecosystem Surfaces",
    description: "Marketing, investor, corporate, and foundation surfaces. They may be public, but they are not canonical runtime proof unless registry evidence says so.",
    repos: ["LifeLoggerAI/urai-marketing", "LifeLoggerAI/urai-investors", "LifeLoggerAI/urai-labs-llc", "LifeLoggerAI/urai-foundation", "LifeLoggerAI/urai-studio"],
  },
  {
    id: "legacy-sandbox",
    title: "Legacy / Sandbox Warning",
    description: "Repos that must not be counted as production truth. Useful work must be ported into LifeLoggerAI/UrAi before it matters for launch authority.",
    repos: ["LifeLoggerAI/UrAi-Dev", "LifeLoggerAI/UrAiProd"],
  },
];

function decorateRepo(repo: SystemRepo) {
  return {
    ...repo,
    stagingEvidenceState: getStagingEvidenceState(repo.name),
    stagingEvidenceNotes: getStagingEvidenceNotes(repo.name),
  };
}

export default function SystemPage() {
  const registry = getSystemRegistry();
  const registryValid = validateSystemRegistryShape();
  const repoByName = new Map(registry.repos.map((repo) => [repo.name, repo]));
  const included = new Set<string>();

  const sections = sectionDefinitions.map((section) => {
    const repos = section.repos.flatMap((repoName) => {
      const repo = repoByName.get(repoName);
      if (!repo) return [];
      included.add(repo.name);
      return [decorateRepo(repo)];
    });

    return { ...section, repos };
  });

  const uncategorized = registry.repos.filter((repo) => !included.has(repo.name));
  if (uncategorized.length) {
    sections.push({
      id: "uncategorized",
      title: "Uncategorized Registry Entries",
      description: "Entries present in the canonical registry but not yet assigned to a command-center section.",
      repos: uncategorized.map(decorateRepo),
    });
  }


  return <SystemCommandCenter registry={registry} registryValid={registryValid} sections={sections} />;
}
