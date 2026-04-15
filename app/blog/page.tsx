import type { Metadata } from "next";
import Link from "next/link";
import { fetchPosts } from "@/lib/notion";
import { TagFilter } from "./tag-filter";

export const metadata: Metadata = {
  title: "NODES // Article Registry",
  description: "READ-ONLY ACCESS GRANTED. Exploring technical logs, system documentation, and operational protocols.",
};

function formatDate(dateStr: string) {
  if (!dateStr) return "---";
  return new Date(dateStr)
    .toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" })
    .toUpperCase();
}

export default async function BlogPage() {
  const posts = await fetchPosts();
  const featured = posts.find((p) => p.featured) ?? posts[0];
  const allTags = Array.from(new Set(posts.flatMap((p) => p.tags)));

  return (
    <div className="pt-12 pb-24 px-6 md:px-12 min-h-screen">

      {/* ─── Header ───────────────────────────────────────────────── */}
      <header className="py-12 border-b border-[#494847]/20">
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
            <div className="text-[10px] text-[#494847] font-mono">UPTIME: 1,452H 22M</div>
            <div className="text-[10px] text-primary font-mono">LOAD_AVG: 0.24, 0.41, 0.38</div>
          </div>
        </div>
      </header>

      {/* ─── Featured Article ─────────────────────────────────────── */}
      {featured && (
        <section className="mt-12 mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 border border-[#494847]/30 bg-surface-container-low group overflow-hidden">
            <div className="lg:col-span-7 p-8 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-6">
                  <span className="bg-secondary/10 text-secondary px-2 py-0.5 text-[10px] font-bold">
                    STABLE_DOC
                  </span>
                  <span className="text-[#494847] text-[10px]">#001_FEATURED</span>
                </div>
                <h2 className="font-sans text-3xl font-bold text-on-surface mb-4 uppercase">
                  {featured.title.toUpperCase().replace(/\s+/g, "_")}.MD
                </h2>
                <p className="text-on-surface-variant font-mono text-sm mb-8 line-clamp-3">
                  {featured.excerpt || "An in-depth technical exploration. Click to read the full article."}
                </p>
              </div>
              <div className="flex items-center gap-6">
                <Link
                  href={`/blog/${featured.slug}`}
                  className="bg-primary text-on-primary px-6 py-2 flex items-center gap-2 font-bold text-xs hover:opacity-90 transition-opacity"
                >
                  <span className="material-symbols-outlined text-sm">terminal</span>
                  CAT /path/to/doc
                </Link>
                <div className="flex flex-col">
                  <span className="text-[10px] text-[#494847] uppercase">Timestamp</span>
                  <span className="text-xs text-on-surface">{formatDate(featured.date)}</span>
                </div>
              </div>
            </div>
            <div className="lg:col-span-5 relative h-48 lg:h-auto overflow-hidden bg-[#262626]">
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="material-symbols-outlined text-primary/20 text-[120px]">article</span>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-surface-container-low to-transparent lg:bg-gradient-to-l" />
            </div>
          </div>
        </section>
      )}

      {/* ─── Search + Filter + Archive List ──────────────────────── */}
      <TagFilter posts={posts} allTags={allTags} />

      {/* ─── Terminal Diagnostics ─────────────────────────────────── */}
      <div className="mt-12 p-6 bg-black font-mono text-xs border border-[#494847]/10">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-3 h-3 rounded-full bg-error" />
          <div className="w-3 h-3 rounded-full bg-yellow-500" />
          <div className="w-3 h-3 rounded-full bg-primary" />
          <span className="ml-4 text-[#494847] text-[10px] uppercase tracking-widest">SYSTEM_DIAGNOSTICS</span>
        </div>
        <p className="text-on-surface-variant mb-1">root@kernel:~/archives# tail -n 5 ./registry_status.log</p>
        <p className="text-primary/70">[OK] INDEX_REFRESH_COMPLETE: {posts.length} NODES PARSED</p>
        <p className="text-primary/70">[OK] PERMISSION_SYNC: SECURE</p>
        <p className="text-tertiary/70">[INFO] CACHE_HIT_RATE: 94.2%</p>
        <p className="text-[#494847]">[INFO] SESSION_TOKEN: EXPIRING IN 12:44:02</p>
        <div className="flex mt-4">
          <span className="text-primary mr-2">root@kernel:~/archives#</span>
          <span className="inline-block w-2 h-4 bg-primary animate-pulse" />
        </div>
      </div>
    </div>
  );
}
