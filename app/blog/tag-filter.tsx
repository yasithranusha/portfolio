"use client";

import { useState } from "react";
import Link from "next/link";
import { type NotionPost } from "@/lib/notion";

interface TagFilterProps {
  posts: NotionPost[];
  allTags: string[];
}

function formatDate(dateStr: string) {
  if (!dateStr) return "---";
  return new Date(dateStr)
    .toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" })
    .toUpperCase();
}

export function TagFilter({ posts, allTags }: TagFilterProps) {
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  const filtered = posts.filter((p) => {
    const matchesTag = activeTag ? p.tags.includes(activeTag) : true;
    const matchesQuery = query
      ? p.title.toLowerCase().includes(query.toLowerCase())
      : true;
    return matchesTag && matchesQuery;
  });

  return (
    <>
      {/* Search + Sort controls */}
      <div className="flex flex-col md:flex-row items-center gap-4 mb-8 bg-surface-container p-4">
        <div className="relative flex-1 w-full">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-primary text-xs">$</span>
          <input
            className="w-full bg-[#000000] border-b border-[#494847]/30 text-xs pl-8 py-3 focus:outline-none focus:border-secondary transition-colors font-mono text-on-surface placeholder:text-[#494847]"
            placeholder="filter --archive --tag architecture"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <button className="flex-1 md:flex-none border border-[#494847]/30 px-4 py-2 text-[10px] hover:bg-[#262626] uppercase font-mono text-on-surface-variant">
            Sort: [DATE]
          </button>
          <button className="flex-1 md:flex-none border border-[#494847]/30 px-4 py-2 text-[10px] hover:bg-[#262626] uppercase font-mono text-on-surface-variant">
            View: [LIST]
          </button>
        </div>
      </div>

      {/* Tag pills */}
      {allTags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setActiveTag(null)}
            className={`text-[9px] font-mono border px-2 py-0.5 tracking-widest uppercase transition-colors ${
              !activeTag
                ? "border-primary/50 text-primary bg-primary/5"
                : "border-[#494847]/40 text-[#494847] hover:text-on-surface-variant"
            }`}
          >
            ALL
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setActiveTag(activeTag === tag ? null : tag)}
              className={`text-[9px] font-mono border px-2 py-0.5 tracking-widest uppercase transition-colors ${
                activeTag === tag
                  ? "border-tertiary/50 text-tertiary bg-tertiary/5"
                  : "border-[#494847]/40 text-[#494847] hover:text-tertiary"
              }`}
            >
              #{tag}
            </button>
          ))}
        </div>
      )}

      {/* ls -la registry table */}
      <div className="border border-[#494847]/20 bg-surface-container-low overflow-hidden">
        {/* Column headers */}
        <div className="hidden md:grid grid-cols-12 bg-[#262626] px-6 py-2 text-[10px] font-bold text-[#494847] border-b border-[#494847]/20 tracking-widest uppercase">
          <div className="col-span-1">PERMISSIONS</div>
          <div className="col-span-1 text-center">SIZE</div>
          <div className="col-span-2">TIMESTAMP</div>
          <div className="col-span-5">FILENAME</div>
          <div className="col-span-2">TAGS</div>
          <div className="col-span-1 text-right">READ_TIME</div>
        </div>

        {/* Rows */}
        <div className="divide-y divide-[#494847]/10 font-mono">
          {filtered.length === 0 ? (
            <div className="px-6 py-8 text-center text-[10px] text-[#494847]">
              // no entries match filter
            </div>
          ) : (
            filtered.map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="grid grid-cols-1 md:grid-cols-12 items-center px-6 py-4 hover:bg-[#262626] group cursor-pointer transition-colors"
              >
                <div className="col-span-1 text-secondary text-[10px] hidden md:block">-rwxr-xr-x</div>
                <div className="col-span-1 text-[#494847] text-[10px] text-center hidden md:block">
                  {post.readTime.replace("~", "").trim()}
                </div>
                <div className="col-span-2 text-[#494847] text-[10px] mb-2 md:mb-0">
                  [{formatDate(post.date)}]
                </div>
                <div className="col-span-5 flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary text-lg flex-shrink-0">description</span>
                  <span className="text-on-surface group-hover:text-primary transition-colors text-sm font-semibold truncate">
                    {post.title.toLowerCase().replace(/\s+/g, "_")}.md
                  </span>
                </div>
                <div className="col-span-2 flex flex-wrap gap-2 my-2 md:my-0">
                  {post.tags.slice(0, 2).map((tag) => (
                    <span
                      key={tag}
                      className="text-[9px] border border-[#494847]/40 px-2 py-0.5 text-tertiary"
                    >
                      #{tag.toUpperCase()}
                    </span>
                  ))}
                </div>
                <div className="col-span-1 text-right text-xs text-on-surface-variant font-bold hidden md:block">
                  [{post.readTime}]
                </div>
              </Link>
            ))
          )}
        </div>

        {/* Pagination footer */}
        <div className="bg-surface-container px-6 py-3 border-t border-[#494847]/20">
          <div className="flex items-center justify-between text-[10px] text-[#494847] font-mono">
            <div>TOTAL {filtered.length} ARTICLES FOUND</div>
            <div className="flex gap-4">
              <button className="hover:text-primary">[PREV]</button>
              <span className="text-on-surface">PAGE 01 / 01</span>
              <button className="hover:text-primary">[NEXT]</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
