import type { MetadataRoute } from "next";
import { site, nav } from "@/content/site";
import { chapters } from "@/content/chapters";
import { archive } from "@/content/archive";
import { products } from "@/content/products";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes = nav.map((item) => ({
    url: `${site.url}${item.href === "/" ? "" : item.href}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: item.href === "/" ? 1 : 0.8,
  }));

  return [
    ...staticRoutes,
    ...chapters.map((c) => ({
      url: `${site.url}/chapters/${c.slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.9,
    })),
    ...archive.map((e) => ({
      url: `${site.url}/archive/${e.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...products.map((p) => ({
      url: `${site.url}/shop/${p.slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];
}
