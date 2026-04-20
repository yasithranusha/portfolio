import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { fetchPosts, type NotionPost } from "@/lib/notion";
import { TagFilter } from "./tag-filter";
import { InteractiveTerminal } from "@/components/ui/interactive-terminal";
import { siteConfig } from "@/config/site";
import { Icon } from "@/components/ui/icon";

export const metadata: Metadata = {
  title:       siteConfig.pages.blog.title,
  description: siteConfig.pages.blog.description,
};

function formatDate(dateStr: string): string {
  if (!dateStr) return "---";
  return new Date(dateStr)
    .toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" })
    .toUpperCase();
}

async function DynamicContent({
  searchParams,
  posts,
  allTags,
}: {
  searchParams: Promise<{ page?: string; tag?: string; q?: string }>;
  posts: NotionPost[];
  allTags: string[];
}) {
  const { page = "1", tag, q = "" } = await searchParams;
  const currentPage = Math.max(1, parseInt(page, 10) || 1);

  const terminalPosts = posts.filter((p) => {
    const matchesTag = tag ? p.tags.includes(tag) : true;
    const matchesQuery = q ? p.title.toLowerCase().includes(q.toLowerCase()) : true;
    return matchesTag && matchesQuery;
  });
  const filterCmd = tag ? `grep ${tag}` : q ? `grep ${q}` : null;
  const initialCommands = filterCmd ? [filterCmd, "ls -la -n 5"] : ["ls -la -n 5"];

  return (
    <>
      <InteractiveTerminal
        title="BLOG_SHELL :: ~/archives"
        initialCwd="~/archives"
        initialCommands={initialCommands}
        posts={terminalPosts}
        className="mt-8 h-72"
      />
      <TagFilter posts={posts} allTags={allTags} page={currentPage} activeTag={tag ?? null} query={q} />
    </>
  );
}

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; tag?: string; q?: string }>;
}) {
  const posts = await fetchPosts();
  const featured = posts.find((p) => p.featured) ?? posts[0];
  const allTags = Array.from(new Set(posts.flatMap((p) => p.tags)));

  return (
    <div className="pt-12 pb-24 px-6 md:px-12 min-h-screen">

      {/* ─── Header ───────────────────────────────────────────────── */}
      <header className="py-12 border-b border-outline-variant/20">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="font-sans text-5xl font-bold tracking-tighter text-primary uppercase mb-2"
                style={{ textShadow: "0 0 8px rgba(85,254,126,0.4)" }}>
              MAN_PAGES / ARCHIVES
            </h1>
            <p className="text-on-surface-variant font-mono max-w-2xl text-sm leading-relaxed">
              READ-ONLY ACCESS GRANTED. EXPLORING TECHNICAL LOGS, SYSTEM DOCUMENTATION, AND
              OPERATIONAL PROTOCOLS. ENVIRONMENT:{" "}
              <span className="text-tertiary">PROD_NODE_01</span>
            </p>
          </div>
          <div className="hidden lg:block text-right">
            <div className="text-[10px] text-outline-variant font-mono">UPTIME: 1,452H 22M</div>
            <div className="text-[10px] text-primary font-mono">LOAD_AVG: 0.24, 0.41, 0.38</div>
          </div>
        </div>
      </header>

      {/* ─── Featured Article ─────────────────────────────────────── */}
      {featured && (
        <section className="mt-12 mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 border border-outline-variant/30 bg-surface-container-low group overflow-hidden">
            {featured.cover && (
              <div className="order-first lg:order-last lg:col-span-5 relative h-56 lg:h-auto overflow-hidden bg-surface-container-highest">
                <Image
                  src={featured.cover}
                  alt={featured.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 40vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/10 lg:bg-gradient-to-l lg:from-surface-container-low lg:via-surface-container-low/40 lg:to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4 lg:hidden">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-secondary/10 text-secondary px-2 py-0.5 text-[10px] font-bold shrink-0">
                      STABLE_DOC
                    </span>
                    <span className="text-on-surface-variant text-[10px]">#001_FEATURED</span>
                  </div>
                  <h2 className="font-sans text-xl font-bold text-on-surface uppercase break-words leading-tight">
                    {featured.title}
                  </h2>
                </div>
              </div>
            )}
            <div className={`${featured.cover ? "lg:col-span-7" : "lg:col-span-12"} p-6 sm:p-8 flex flex-col justify-between min-w-0 overflow-hidden`}>
              <div>
                <div className={`${featured.cover ? "hidden lg:flex" : "flex"} items-center gap-2 mb-4`}>
                  <span className="bg-secondary/10 text-secondary px-2 py-0.5 text-[10px] font-bold shrink-0">
                    STABLE_DOC
                  </span>
                  <span className="text-outline-variant text-[10px]">#001_FEATURED</span>
                </div>
                <h2 className={`${featured.cover ? "hidden lg:block" : ""} font-sans text-2xl sm:text-3xl font-bold text-on-surface mb-4 uppercase break-words leading-tight`}>
                  {featured.title}
                </h2>
                <p className="text-on-surface-variant font-mono text-sm mb-6 line-clamp-3">
                  {featured.excerpt || "An in-depth technical exploration. Click to read the full article."}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-4">
                <Link
                  href={`/blog/${featured.slug}`}
                  className="bg-primary text-on-primary px-5 py-2 flex items-center gap-2 font-bold text-xs hover:opacity-90 transition-opacity shrink-0"
                >
                  <Icon name="terminal" className="text-sm" />
                  CAT /path/to/doc
                </Link>
                <div className="flex flex-col">
                  <span className="text-[10px] text-outline uppercase">Timestamp</span>
                  <span className="text-xs text-on-surface">{formatDate(featured.date)}</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ─── Dynamic: Terminal + Search + Filter ──────────────────── */}
      <Suspense>
        <DynamicContent searchParams={searchParams} posts={posts} allTags={allTags} />
      </Suspense>
    </div>
  );
}
