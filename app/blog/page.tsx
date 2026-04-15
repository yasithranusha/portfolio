import type { Metadata } from "next";
import { fetchPosts } from "@/lib/notion";
import { PostList } from "@/components/blog/post-list";
import { PostCard } from "@/components/blog/post-card";
import { SectionLabel } from "@/components/ui/section-label";
import { TerminalWindow } from "@/components/ui/terminal-window";
import { Tag } from "@/components/ui/tag";
import { TagFilter } from "./tag-filter";

export const metadata: Metadata = {
  title: "NODES // Article Registry",
  description: "Log entries — articles on distributed systems, cloud architecture, and engineering.",
};

export default async function BlogPage() {
  const posts = await fetchPosts();
  const featured = posts.find((p) => p.featured);
  const allTags = Array.from(new Set(posts.flatMap((p) => p.tags)));

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 space-y-12">

      {/* ─── Header ───────────────────────────────────────────────── */}
      <section className="space-y-3">
        <SectionLabel>man_pages / archives</SectionLabel>
        <h1 className="text-2xl sm:text-3xl font-bold font-sans text-white">
          Article Registry
        </h1>

        <TerminalWindow title="sysinfo">
          <div className="p-3 font-mono text-[10px] flex flex-wrap gap-6 text-[#adaaaa]">
            <span>entries: <span className="text-[#55fe7e]">{posts.length}</span></span>
            <span>tags: <span className="text-[#5db4fe]">{allTags.length}</span></span>
            <span>status: <span className="text-[#55fe7e]">active</span></span>
          </div>
        </TerminalWindow>
      </section>

      {/* ─── Featured Post ────────────────────────────────────────── */}
      {featured && (
        <section className="space-y-3">
          <SectionLabel>featured_entry</SectionLabel>
          <div className="border border-[#55fe7e]/20 bg-[#131313]">
            <div className="px-4 py-2 bg-[#55fe7e]/5 border-b border-[#55fe7e]/20">
              <span className="text-[10px] font-mono text-[#55fe7e] tracking-widest">PINNED</span>
            </div>
            <PostCard post={featured} />
          </div>
        </section>
      )}

      {/* ─── Tag Filter + Archive ─────────────────────────────────── */}
      <section className="space-y-4">
        <SectionLabel>ls -la /archives</SectionLabel>
        <TagFilter posts={posts} allTags={allTags} />
      </section>

      {/* ─── System Diagnostics footer ────────────────────────────── */}
      <section>
        <TerminalWindow title="log — end of file">
          <div className="p-4 font-mono text-[11px] text-[#494847] space-y-1">
            <p>// EOF — {posts.length} entries in registry</p>
            <p>// use ctrl+f to search, or filter by tag above</p>
          </div>
        </TerminalWindow>
      </section>
    </div>
  );
}
