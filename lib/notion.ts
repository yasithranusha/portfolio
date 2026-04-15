import { Client } from "@notionhq/client";
import { NotionToMarkdown } from "notion-to-md";
import { unstable_cache } from "next/cache";

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

const n2m = new NotionToMarkdown({ notionClient: notion });

export type NotionPost = {
  id: string;
  slug: string;
  title: string;
  date: string;
  tags: string[];
  excerpt: string;
  readTime: string;
  featured: boolean;
};

export type Project = {
  id: string;
  slug: string;
  title: string;
  description: string;
  tags: string[];
  github: string;
  live: string;
  status: "online" | "offline" | "warn";
  featured: boolean;
};

// ─── Blog Posts ───────────────────────────────────────────────────

export const fetchPosts = unstable_cache(
  async (): Promise<NotionPost[]> => {
    if (!process.env.NOTION_BLOG_DB_ID) return [];

    const response = await notion.databases.query({
      database_id: process.env.NOTION_BLOG_DB_ID,
      filter: {
        property: "Status",
        select: { equals: "Published" },
      },
      sorts: [{ property: "Date", direction: "descending" }],
    });

    return response.results.map((page: any) => {
      const props = page.properties;
      return {
        id: page.id,
        slug: props.Slug?.rich_text?.[0]?.plain_text ?? page.id,
        title: props.Title?.title?.[0]?.plain_text ?? "Untitled",
        date: props.Date?.date?.start ?? "",
        tags: props.Tags?.multi_select?.map((t: any) => t.name) ?? [],
        excerpt: props.Excerpt?.rich_text?.[0]?.plain_text ?? "",
        readTime: props.ReadTime?.rich_text?.[0]?.plain_text ?? "~3m",
        featured: props.Featured?.checkbox ?? false,
      };
    });
  },
  ["notion-posts"],
  { revalidate: 3600, tags: ["posts"] }
);

export const fetchPost = unstable_cache(
  async (slug: string): Promise<(NotionPost & { content: string }) | null> => {
    if (!process.env.NOTION_BLOG_DB_ID) return null;

    const response = await notion.databases.query({
      database_id: process.env.NOTION_BLOG_DB_ID,
      filter: {
        property: "Slug",
        rich_text: { equals: slug },
      },
    });

    if (!response.results.length) return null;

    const page = response.results[0] as any;
    const props = page.properties;

    const mdBlocks = await n2m.pageToMarkdown(page.id);
    const content = n2m.toMarkdownString(mdBlocks).parent;

    return {
      id: page.id,
      slug,
      title: props.Title?.title?.[0]?.plain_text ?? "Untitled",
      date: props.Date?.date?.start ?? "",
      tags: props.Tags?.multi_select?.map((t: any) => t.name) ?? [],
      excerpt: props.Excerpt?.rich_text?.[0]?.plain_text ?? "",
      readTime: props.ReadTime?.rich_text?.[0]?.plain_text ?? "~3m",
      featured: props.Featured?.checkbox ?? false,
      content,
    };
  },
  ["notion-post"],
  { revalidate: 3600, tags: ["posts"] }
);

// ─── Projects ─────────────────────────────────────────────────────

export const fetchProjects = unstable_cache(
  async (): Promise<Project[]> => {
    if (!process.env.NOTION_PROJECTS_DB_ID) return [];

    const response = await notion.databases.query({
      database_id: process.env.NOTION_PROJECTS_DB_ID,
      sorts: [{ property: "Featured", direction: "descending" }],
    });

    return response.results.map((page: any) => {
      const props = page.properties;
      return {
        id: page.id,
        slug: props.Slug?.rich_text?.[0]?.plain_text ?? page.id,
        title: props.Title?.title?.[0]?.plain_text ?? "Untitled",
        description: props.Description?.rich_text?.[0]?.plain_text ?? "",
        tags: props.Tags?.multi_select?.map((t: any) => t.name) ?? [],
        github: props.GitHub?.url ?? "",
        live: props.Live?.url ?? "",
        status: (props.Status?.select?.name?.toLowerCase() as Project["status"]) ?? "online",
        featured: props.Featured?.checkbox ?? false,
      };
    });
  },
  ["notion-projects"],
  { revalidate: 3600, tags: ["projects"] }
);
