import { Client, LogLevel } from "@notionhq/client";
import { NotionToMarkdown } from "notion-to-md";
import { cacheLife, cacheTag } from "next/cache";
import type { PageObjectResponse } from "@notionhq/client";

if (!process.env.NOTION_TOKEN) {
  throw new Error("[notion] NOTION_TOKEN is not set in environment variables");
}

const notion = new Client({ 
  auth: process.env.NOTION_TOKEN,
  logLevel: LogLevel.ERROR,
});

if (!process.env.NOTION_TOKEN && process.env.NODE_ENV === "production") {
  console.error("[notion] CRITICAL: NOTION_TOKEN is missing in production environment.");
}

// notion-to-md v3 accepts Client from @notionhq/client — no cast needed
const n2m = new NotionToMarkdown({ notionClient: notion });

/**
 * Extended Notion Client interfaces to support the Data Sources API.
 */
type NotionClient = Client & {
  dataSources: {
    query: (args: {
      data_source_id: string;
      filter?:       object;
      sorts?:        object[];
      start_cursor?: string;
      page_size?:    number;
    }) => Promise<{ results: unknown[] }>;
  };
};

/**
 * ID Resolver Cache
 * Maps Database IDs to their corresponding Data Source IDs.
 */
const dataSourceMap = new Map<string, string>();

async function getDataSourceId(databaseId: string | undefined): Promise<string | null> {
  if (!databaseId) return null;
  if (dataSourceMap.has(databaseId)) return dataSourceMap.get(databaseId)!;
  
  try {
    const db = await (notion.databases as unknown as { retrieve: (args: { database_id: string }) => Promise<unknown> }).retrieve({ database_id: databaseId });
    const dsId = (db as { data_sources?: Array<{ id: string }> }).data_sources?.[0]?.id ?? databaseId;
    dataSourceMap.set(databaseId, dsId);
    return dsId;
  } catch {
    // metadata retrieval may be restricted; fallback to direct ID usage
    dataSourceMap.set(databaseId, databaseId);
    return databaseId;
  }
}

// ─── Public types ──────────────────────────────────────────────────

export type NotionPost = {
  id:           string;
  slug:         string;
  title:        string;
  date:         string;
  lastEditedAt: string;
  tags:         string[];
  excerpt:      string;
  readTime:     string;
  readTimeMin:  number;
  featured:     boolean;
  cover:        string;
};

export type GitHubRepo = { label: string; url: string };

export type Project = {
  id:          string;
  slug:        string;
  title:       string;
  description: string;
  tags:        string[];
  github:      string;
  githubRepos: GitHubRepo[];
  live:        string;
  status:      "online" | "offline" | "warn";
  featured:    boolean;
};

// ─── Property Schemas ───────────────────────────────────────────────
/**
 * Minimal interfaces for Notion properties. Use these to safely cast
 * page.properties once per mapper function.
 */

type RichTextProp    = { rich_text: Array<{ plain_text: string }> };
type TitleProp       = { title:     Array<{ plain_text: string }> };
type DateProp        = { date: { start: string } | null };
type MultiSelectProp = { multi_select: Array<{ name: string }> };
type NumberProp      = { number: number | null };
type CheckboxProp    = { checkbox: boolean };
type UrlProp         = { url: string | null };
type SelectOrStatusProp = {
  select?: { name: string } | null;
  status?: { name: string } | null;
};

interface BlogPostProps {
  Slug?:     RichTextProp;
  Title?:    TitleProp;
  Date?:     DateProp;
  Tags?:     MultiSelectProp;
  Tag?:      MultiSelectProp;
  Excerpt?:  RichTextProp;
  ReadTime?: NumberProp;      // number column (minutes)
  Featured?: CheckboxProp;
}

interface ProjectProps {
  Slug?:          TitleProp;
  Title?:         TitleProp;
  Description?:   RichTextProp;
  Tags?:          MultiSelectProp;
  Tag?:           MultiSelectProp;
  GitHub_Repos?:  RichTextProp;
  Live?:          UrlProp;
  Status?:        SelectOrStatusProp;
  Featured?:      CheckboxProp;
  Published?:     CheckboxProp;
}

// ─── Mappers ───────────────────────────────────────────────────────

function getCoverUrl(page: PageObjectResponse): string {
  if (!page.cover) return "";
  if (page.cover.type === "external") return page.cover.external.url;
  if (page.cover.type === "file")     return page.cover.file.url;
  return "";
}

function pageToPost(page: PageObjectResponse): NotionPost {
  const props = page.properties as unknown as BlogPostProps;
  const readTimeNum = props.ReadTime?.number ?? 3;
  return {
    id:           page.id,
    slug:         props.Slug?.rich_text[0]?.plain_text  ?? page.id,
    title:        props.Title?.title[0]?.plain_text     ?? "Untitled",
    date:         props.Date?.date?.start               ?? "",
    lastEditedAt: page.last_edited_time,
    tags:         props.Tag?.multi_select.map((t) => t.name)
               ?? props.Tags?.multi_select.map((t) => t.name)
               ?? [],
    excerpt:      props.Excerpt?.rich_text[0]?.plain_text ?? "",
    readTime:     `~${readTimeNum}m`,
    readTimeMin:  readTimeNum,
    featured:     props.Featured?.checkbox              ?? false,
    cover:        getCoverUrl(page),
  };
}

function pageToProject(page: PageObjectResponse): Project {
  const props = page.properties as unknown as ProjectProps;
  const rawStatus = (
    props.Status?.select?.name ??
    props.Status?.status?.name ??
    "online"
  ).toLowerCase();
  const status: Project["status"] =
    rawStatus === "offline" || rawStatus === "warn" ? rawStatus : "online";
  const title =
    props.Slug?.title[0]?.plain_text  ??
    props.Title?.title[0]?.plain_text ??
    "Untitled";
  const slug = title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
  const reposText = props.GitHub_Repos?.rich_text.map((r) => r.plain_text).join("") ?? "";
  const githubRepos: GitHubRepo[] = reposText
    .split("\n")
    .map((line) => {
      const idx = line.indexOf(":");
      if (idx === -1) return null;
      const label = line.slice(0, idx).trim();
      const url   = line.slice(idx + 1).trim();
      return label && url.startsWith("http") ? { label, url } : null;
    })
    .filter((r): r is GitHubRepo => r !== null);

  return {
    id:          page.id,
    slug,
    title,
    description: props.Description?.rich_text[0]?.plain_text ?? "",
    tags:        props.Tags?.multi_select.map((t) => t.name)
              ?? props.Tag?.multi_select.map((t) => t.name)
              ?? [],
    github:      githubRepos[0]?.url ?? "",
    githubRepos,
    live:        props.Live?.url ?? "",
    status,
    featured:    props.Featured?.checkbox ?? false,
  };
}

// ─── Content Retrieval ─────────────────────────────────────────────

export async function fetchPosts(): Promise<NotionPost[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("posts");

  if (!process.env.NOTION_BLOG_DB_ID) {
    console.error("[notion] NOTION_BLOG_DB_ID is not set");
    return [];
  }
  try {
    const dataSourceId = await getDataSourceId(process.env.NOTION_BLOG_DB_ID);
    if (!dataSourceId) return [];

    const response = await (notion as unknown as NotionClient).dataSources.query({
      data_source_id: dataSourceId,
      filter: { property: "Status", status: { equals: "Published" } },
      sorts:  [{ property: "Date", direction: "descending" }],
    });

    return (response.results as unknown[])
      .filter((p: unknown): p is PageObjectResponse => 
        typeof p === "object" && p !== null && "object" in p && p.object === "page" && "properties" in p
      )
      .map(pageToPost);
  } catch (err) {
    console.error("[notion] fetchPosts failed:", err);
    return [];
  }
}

export async function fetchPost(slug: string): Promise<(NotionPost & { content: string }) | null> {
  "use cache";
  cacheLife("hours");
  cacheTag("posts");

  if (!process.env.NOTION_BLOG_DB_ID) {
    console.error("[notion] NOTION_BLOG_DB_ID is not set");
    return null;
  }
  try {
    const dataSourceId = await getDataSourceId(process.env.NOTION_BLOG_DB_ID);
    if (!dataSourceId) return null;

    const response = await (notion as unknown as NotionClient).dataSources.query({
      data_source_id: dataSourceId,
      filter: { property: "Slug", rich_text: { equals: slug } },
    });
    const page = (response.results as unknown[]).find(
      (p: unknown): p is PageObjectResponse => 
        typeof p === "object" && p !== null && "object" in p && p.object === "page" && "properties" in p
    );
    if (!page) return null;

    const mdBlocks = await n2m.pageToMarkdown(page.id);
    const content  = n2m.toMarkdownString(mdBlocks).parent ?? "";
    return { ...pageToPost(page), slug, content };
  } catch (err) {
    console.error("[notion] fetchPost failed for slug '%s':", slug, err);
    return null;
  }
}

/**
 * Lightweight version of fetchPost for metadata purposes (like OG images).
 * Skips expensive markdown conversion.
 */
export async function fetchPostMetadata(slug: string): Promise<NotionPost | null> {
  "use cache";
  cacheLife("hours");
  cacheTag("posts");

  if (!process.env.NOTION_BLOG_DB_ID) {
    console.error("[notion] NOTION_BLOG_DB_ID is not set");
    return null;
  }
  try {
    const dataSourceId = await getDataSourceId(process.env.NOTION_BLOG_DB_ID);
    if (!dataSourceId) return null;

    const response = await (notion as unknown as NotionClient).dataSources.query({
      data_source_id: dataSourceId,
      filter: { property: "Slug", rich_text: { equals: slug } },
    });
    const page = (response.results as unknown[]).find(
      (p: unknown): p is PageObjectResponse => 
        typeof p === "object" && p !== null && "object" in p && p.object === "page" && "properties" in p
    );
    if (!page) return null;

    return pageToPost(page);
  } catch (err) {
    console.error("[notion] fetchPostMetadata failed for slug '%s':", slug, err);
    return null;
  }
}

// ─── Projects ─────────────────────────────────────────────────────

export async function fetchProjects(): Promise<Project[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("projects");

  if (!process.env.NOTION_PROJECTS_DB_ID) {
    console.error("[notion] NOTION_PROJECTS_DB_ID is not set");
    return [];
  }
  try {
    const dataSourceId = await getDataSourceId(process.env.NOTION_PROJECTS_DB_ID);
    if (!dataSourceId) return [];

    const response = await (notion as unknown as NotionClient).dataSources.query({
      data_source_id: dataSourceId,
      filter: { property: "Published", checkbox: { equals: true } },
      sorts: [{ property: "Featured", direction: "descending" }],
    });
    return (response.results as unknown[])
      .filter((p: unknown): p is PageObjectResponse => 
        typeof p === "object" && p !== null && "object" in p && p.object === "page" && "properties" in p
      )
      .map(pageToProject);
  } catch (err) {
    console.error("[notion] fetchProjects failed:", err);
    return [];
  }
}
