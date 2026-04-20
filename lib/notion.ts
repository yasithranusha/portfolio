import { Client } from "@notionhq/client";
import { NotionToMarkdown } from "notion-to-md";
import { cacheLife, cacheTag } from "next/cache";
import type { PageObjectResponse } from "@notionhq/client";

if (!process.env.NOTION_TOKEN) {
  throw new Error("[notion] NOTION_TOKEN is not set in environment variables");
}

const notion = new Client({ auth: process.env.NOTION_TOKEN });

// notion-to-md v3 accepts Client from @notionhq/client — no cast needed
const n2m = new NotionToMarkdown({ notionClient: notion });

// ─── Public types ──────────────────────────────────────────────────

export type NotionPost = {
  id:       string;
  slug:     string;
  title:    string;
  date:     string;
  tags:     string[];
  excerpt:  string;
  readTime: string;
  featured: boolean;
  cover:    string;
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

// ─── Notion property shapes ────────────────────────────────────────
// Minimal interfaces describing only the fields we actually read.
// We cast page.properties once per mapper function (as unknown as T)
// instead of scattering `as any` across every property access.

type RichTextProp    = { rich_text: Array<{ plain_text: string }> };
type TitleProp       = { title:     Array<{ plain_text: string }> };
type DateProp        = { date: { start: string } | null };
type MultiSelectProp = { multi_select: Array<{ name: string }> };
type NumberProp      = { number: number | null };
type CheckboxProp    = { checkbox: boolean };
type UrlProp         = { url: string | null };
// Notion "Status" can be either a select or status property type
type SelectOrStatusProp = {
  select?: { name: string } | null;
  status?: { name: string } | null;
};

interface BlogPostProps {
  Slug?:     RichTextProp;
  Title?:    TitleProp;
  Date?:     DateProp;
  Tag?:      MultiSelectProp; // "Tag" (singular) in this DB schema
  Tags?:     MultiSelectProp;
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
  const readTimeNum = props.ReadTime?.number;
  return {
    id:       page.id,
    slug:     props.Slug?.rich_text[0]?.plain_text  ?? page.id,
    title:    props.Title?.title[0]?.plain_text     ?? "Untitled",
    date:     props.Date?.date?.start               ?? "",
    tags:     props.Tag?.multi_select.map((t) => t.name)
           ?? props.Tags?.multi_select.map((t) => t.name)
           ?? [],
    excerpt:  props.Excerpt?.rich_text[0]?.plain_text ?? "",
    readTime: readTimeNum != null ? `~${readTimeNum}m` : "~3m",
    featured: props.Featured?.checkbox              ?? false,
    cover:    getCoverUrl(page),
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

// ─── Blog Posts ───────────────────────────────────────────────────

export async function fetchPosts(): Promise<NotionPost[]> {
  "use cache";
  cacheLife("days");
  cacheTag("posts");

  if (!process.env.NOTION_BLOG_DB_ID) {
    console.error("[notion] NOTION_BLOG_DB_ID is not set");
    return [];
  }
  try {
    const response = await notion.dataSources.query({
      data_source_id: process.env.NOTION_BLOG_DB_ID,
      filter: { property: "Status", status: { equals: "Published" } },
      sorts:  [{ property: "Date", direction: "descending" }],
    });
    return response.results
      .filter((p): p is PageObjectResponse => p.object === "page" && "properties" in p)
      .map(pageToPost);
  } catch (err) {
    console.error("[notion] fetchPosts failed:", err);
    return [];
  }
}

export async function fetchPost(slug: string): Promise<(NotionPost & { content: string }) | null> {
  "use cache";
  cacheLife("days");
  cacheTag("posts");

  if (!process.env.NOTION_BLOG_DB_ID) {
    console.error("[notion] NOTION_BLOG_DB_ID is not set");
    return null;
  }
  try {
    const response = await notion.dataSources.query({
      data_source_id: process.env.NOTION_BLOG_DB_ID,
      filter: { property: "Slug", rich_text: { equals: slug } },
    });
    const page = response.results.find(
      (p): p is PageObjectResponse => p.object === "page" && "properties" in p
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

// ─── Projects ─────────────────────────────────────────────────────

export async function fetchProjects(): Promise<Project[]> {
  "use cache";
  cacheLife("days");
  cacheTag("projects");

  if (!process.env.NOTION_PROJECTS_DB_ID) {
    console.error("[notion] NOTION_PROJECTS_DB_ID is not set");
    return [];
  }
  try {
    const response = await notion.dataSources.query({
      data_source_id: process.env.NOTION_PROJECTS_DB_ID,
      filter: { property: "Published", checkbox: { equals: true } },
      sorts: [{ property: "Featured", direction: "descending" }],
    });
    return response.results
      .filter((p): p is PageObjectResponse => p.object === "page" && "properties" in p)
      .map(pageToProject);
  } catch (err) {
    console.error("[notion] fetchProjects failed:", err);
    return [];
  }
}
