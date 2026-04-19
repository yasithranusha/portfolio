import type { MetadataRoute } from "next";
import { fetchPosts } from "@/lib/notion";
import { siteConfig } from "@/config/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await fetchPosts();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: siteConfig.url,                   lastModified: new Date(), changeFrequency: "weekly",  priority: 1   },
    { url: `${siteConfig.url}blog`,           lastModified: new Date(), changeFrequency: "daily",   priority: 0.9 },
    { url: `${siteConfig.url}projects`,       lastModified: new Date(), changeFrequency: "weekly",  priority: 0.8 },
    { url: `${siteConfig.url}about`,          lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
  ];

  const blogRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
    url:             `${siteConfig.url}blog/${post.slug}`,
    lastModified:    post.date ? new Date(post.date) : new Date(),
    changeFrequency: "monthly",
    priority:        0.6,
  }));

  return [...staticRoutes, ...blogRoutes];
}
