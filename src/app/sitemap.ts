import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = process.env.NEXT_PUBLIC_URAI_APP_URL ?? process.env.NEXT_PUBLIC_SITE_URL ?? "https://urai.app";
  const now = new Date();
  const publicDemoRoutes = [
    { path: "", priority: 1 },
    { path: "/about", priority: 0.75 },
    { path: "/launch", priority: 0.7 },
    { path: "/demo", priority: 0.7 },
    { path: "/home", priority: 0.8 },
    { path: "/life-map", priority: 0.7 },
    { path: "/focus", priority: 0.62 },
    { path: "/replay", priority: 0.62 },
    { path: "/ground", priority: 0.62 },
    { path: "/orb", priority: 0.62 },
    { path: "/orb-chat", priority: 0.58 },
    { path: "/sky", priority: 0.62 },
    { path: "/horizon", priority: 0.62 },
    { path: "/waitlist", priority: 0.8 },
    { path: "/privacy", priority: 0.6 },
    { path: "/terms", priority: 0.55 },
    { path: "/u/adamclamp", priority: 0.85 },
  ];

  return publicDemoRoutes.map(({ path, priority }) => ({
    url: `${siteUrl}${path}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority,
  }));
}
