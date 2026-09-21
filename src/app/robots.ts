import type { MetadataRoute } from "next";
import { site } from "@/content/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        // Pre-launch: nothing is indexed until the real domain and
        // reviewed content are live. Flip to allow at launch.
        disallow: "/",
      },
    ],
    sitemap: `${site.url}/sitemap.xml`,
  };
}
