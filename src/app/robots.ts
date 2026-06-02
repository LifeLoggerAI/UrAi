import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://urai.app";

  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/u/adamclamp"],
      disallow: ["/api/"]
    },
    sitemap: `${siteUrl}/sitemap.xml`
  };
}
