import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = process.env.NEXT_PUBLIC_URAI_APP_URL ?? process.env.NEXT_PUBLIC_SITE_URL ?? "https://urai.app";

  return {
    rules: {
      userAgent: "*",
      allow: [
        "/",
        "/about",
        "/launch",
        "/demo",
        "/home",
        "/life-map",
        "/focus",
        "/replay",
        "/ground",
        "/orb",
        "/orb-chat",
        "/sky",
        "/horizon",
        "/waitlist",
        "/privacy",
        "/terms",
        "/u/adamclamp",
      ],
      disallow: [
        "/api/",
        "/admin/",
        "/app/",
        "/dashboard",
        "/login",
        "/signup",
        "/system",
        "/settings",
        "/profile-and-privacy",
        "/record",
        "/journal",
        "/memory/",
        "/replay/",
        "/focus/",
        "/spatial/",
      ],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
