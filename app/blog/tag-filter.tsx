"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { type NotionPost } from "@/lib/notion";

interface TagFilterProps {
  posts: NotionPost[];
  allTags: string[];
}

function formatDate(dateStr: string): string {
  if (!dateStr) return "---";
  return new Date(dateStr)
    .toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" })
    .toUpperCase();
}

const ITEMS_PER_PAGE = 8;

export function TagFilter({ posts, allTags }: TagFilterProps) {
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  const filtered = posts.filter((p) => {
    const matchesTag = activeTag ? p.tags.includes(activeTag) : true;
    const matchesQuery = query
      ? p.title.toLowerCase().includes(query.toLowerCase())
      : true;
    return matchesTag && matchesQuery;
  });

  useEffect(() => { setPage(1); }, [activeTag, query]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

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

      {/* Archive table */}
      <div className="border border-[#494847]/20 bg-surface-container-low overflow-hidden">
        {/* Column headers */}
        <div className="hidden md:flex px-6 py-2 bg-[#262626] border-b border-[#494847]/20 text-[10px] font-bold text-[#494847] tracking-widest uppercase font-mono">
          <div className="w-28 shrink-0">DATE</div>
          <div className="flex-1">TITLE</div>
          <div className="hidden lg:block w-44 shrink-0">TAGS</div>
          <div className="w-16 shrink-0 text-right">READ</div>
        </div>

        {/* Rows */}
        <div className="divide-y divide-[#494847]/10 font-mono">
          {filtered.length === 0 ? (
            <div className="px-6 py-8 text-center text-[10px] text-[#494847]">
              // no entries match filter
            </div>
          ) : (
            paginated.map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="flex flex-col md:flex-row md:items-center px-6 py-4 hover:bg-[#262626] group transition-colors gap-2 md:gap-0"
              >
                <div className="w-28 shrink-0 text-[10px] text-[#494847]">
                  {formatDate(post.date)}
                </div>
                <div className="flex-1 min-w-0 text-sm font-semibold text-on-surface group-hover:text-primary transition-colors truncate">
                  {post.title}
                </div>
                <div className="hidden lg:flex w-44 shrink-0 flex-wrap gap-1.5">
                  {post.tags.slice(0, 2).map((tag) => (
                    <span key={tag} className="text-[9px] border border-[#494847]/40 px-2 py-0.5 text-tertiary">
                      #{tag}
                    </span>
                  ))}
                </div>
                <div className="w-16 shrink-0 text-right text-[10px] text-[#494847]">
                  {post.readTime}
                </div>
              </Link>
            ))
          )}
        </div>

        {/* Pagination footer */}
        <div className="bg-surface-container px-6 py-3 border-t border-[#494847]/20">
          <div className="flex items-center justify-between text-[10px] text-[#494847] font-mono">
            <div>TOTAL {filtered.length} ARTICLES FOUND</div>
            <div className="flex gap-4 items-center">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className={`hover:text-primary transition-colors ${page === 1 ? "opacity-30 cursor-not-allowed" : ""}`}
              >
                [PREV]
              </button>
              <span className="text-on-surface">
                PAGE {String(page).padStart(2, "0")} / {String(totalPages).padStart(2, "0")}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className={`hover:text-primary transition-colors ${page === totalPages ? "opacity-30 cursor-not-allowed" : ""}`}
              >
                [NEXT]
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
