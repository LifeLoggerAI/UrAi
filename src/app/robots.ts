import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3014";

  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/u/adamclamp"],
      disallow: ["/api/"]
    },
    sitemap: `${siteUrl}/sitemap.xml`
  };
}
