import Link from "next/link";
import { type NotionPost } from "@/lib/notion";

interface TagFilterProps {
  posts: NotionPost[];
  allTags: string[];
  page: number;
  activeTag: string | null;
  query: string;
}

const ITEMS_PER_PAGE = 8;

function formatDate(dateStr: string): string {
  if (!dateStr) return "---";
  return new Date(dateStr)
    .toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" })
    .toUpperCase();
}

function buildUrl(params: { page?: number; tag?: string | null; q?: string }): string {
  const p = new URLSearchParams();
  if (params.q) p.set("q", params.q);
  if (params.tag) p.set("tag", params.tag);
  if (params.page && params.page > 1) p.set("page", String(params.page));
  const str = p.toString();
  return `/blog${str ? `?${str}` : ""}`;
}

export function TagFilter({ posts, allTags, page, activeTag, query }: TagFilterProps) {
  const filtered = posts.filter((p) => {
    const matchesTag = activeTag ? p.tags.includes(activeTag) : true;
    const matchesQuery = query
      ? p.title.toLowerCase().includes(query.toLowerCase())
      : true;
    return matchesTag && matchesQuery;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const safePage = Math.min(page, totalPages);
  const paginated = filtered.slice((safePage - 1) * ITEMS_PER_PAGE, safePage * ITEMS_PER_PAGE);

  return (
    <>
      {/* Search + Sort controls */}
      <div className="flex flex-col md:flex-row items-center gap-4 mb-8 bg-surface-container p-4">
        <form action="/blog" method="GET" className="relative flex-1 w-full">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-primary text-xs">$</span>
          {activeTag && <input type="hidden" name="tag" value={activeTag} />}
          <input
            name="q"
            defaultValue={query}
            aria-label="Filter articles"
            className="w-full bg-surface-container-lowest border-b border-outline-variant/30 text-xs pl-8 py-3 focus:outline-none focus:border-secondary transition-colors font-mono text-on-surface placeholder:text-outline-variant"
            placeholder="filter --archive --tag architecture"
            autoComplete="off"
          />
        </form>
        <div className="flex gap-2 w-full md:w-auto">
          <div className="flex-1 md:flex-none border border-outline-variant/30 px-4 py-2 text-[10px] uppercase font-mono text-on-surface-variant">
            Sort: [DATE]
          </div>
          <div className="flex-1 md:flex-none border border-outline-variant/30 px-4 py-2 text-[10px] uppercase font-mono text-on-surface-variant">
            View: [LIST]
          </div>
        </div>
      </div>

      {/* Tag pills */}
      {allTags.length > 0 && (
        <div className="flex overflow-x-auto gap-2 pb-2 mb-4 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <Link
            href={buildUrl({ q: query })}
            className={`shrink-0 snap-start text-[9px] font-mono border px-3 py-1 tracking-widest uppercase transition-colors whitespace-nowrap ${
              !activeTag
                ? "border-primary/50 text-primary bg-primary/5"
                : "border-outline-variant/40 text-outline hover:text-on-surface-variant"
            }`}
          >
            ALL
          </Link>
          {allTags.map((tag) => (
            <Link
              key={tag}
              href={buildUrl({ q: query, tag: activeTag === tag ? null : tag })}
              className={`shrink-0 snap-start text-[9px] font-mono border px-3 py-1 tracking-widest uppercase transition-colors whitespace-nowrap ${
                activeTag === tag
                  ? "border-tertiary/50 text-tertiary bg-tertiary/5"
                  : "border-outline-variant/40 text-outline hover:text-tertiary"
              }`}
            >
              #{tag}
            </Link>
          ))}
        </div>
      )}

      {/* Archive table */}
      <div className="border border-outline-variant/20 bg-surface-container-low overflow-hidden">
        {/* Column headers */}
        <div className="hidden md:flex px-6 py-2 bg-surface-container-highest border-b border-outline-variant/20 text-[10px] font-bold text-outline tracking-widest uppercase font-mono">
          <div className="w-28 shrink-0">DATE</div>
          <div className="flex-1">TITLE</div>
          <div className="hidden lg:block w-44 shrink-0">TAGS</div>
          <div className="w-16 shrink-0 text-right">READ</div>
        </div>

        {/* Rows */}
        <div className="divide-y divide-outline-variant/10 font-mono">
          {filtered.length === 0 ? (
            <div className="px-6 py-8 text-center text-[10px] text-outline">
              // no entries match filter
            </div>
          ) : (
            paginated.map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="flex flex-col md:flex-row md:items-center px-6 py-4 hover:bg-surface-container-highest group transition-colors gap-2 md:gap-0"
              >
                <div className="w-28 shrink-0 text-[10px] text-outline">
                  {formatDate(post.date)}
                </div>
                <div className="flex-1 min-w-0 text-sm font-semibold text-on-surface group-hover:text-primary transition-colors truncate">
                  {post.title}
                </div>
                <div className="hidden lg:flex w-44 shrink-0 flex-wrap gap-1.5">
                  {post.tags.slice(0, 2).map((tag) => (
                    <span key={tag} className="text-[9px] border border-outline-variant/40 px-2 py-0.5 text-tertiary">
                      #{tag}
                    </span>
                  ))}
                </div>
                <div className="w-16 shrink-0 text-right text-[10px] text-outline">
                  {post.readTime}
                </div>
              </Link>
            ))
          )}
        </div>

        {/* Pagination footer */}
        <div className="bg-surface-container px-6 py-3 border-t border-outline-variant/20">
          <div className="flex items-center justify-between text-[10px] text-outline font-mono">
            <div>TOTAL {filtered.length} ARTICLES FOUND</div>
            <div className="flex gap-4 items-center">
              {safePage > 1 ? (
                <Link href={buildUrl({ q: query, tag: activeTag, page: safePage - 1 })} className="hover:text-primary transition-colors">
                  [PREV]
                </Link>
              ) : (
                <span className="opacity-30">[PREV]</span>
              )}
              <span className="text-on-surface">
                PAGE {String(safePage).padStart(2, "0")} / {String(totalPages).padStart(2, "0")}
              </span>
              {safePage < totalPages ? (
                <Link href={buildUrl({ q: query, tag: activeTag, page: safePage + 1 })} className="hover:text-primary transition-colors">
                  [NEXT]
                </Link>
              ) : (
                <span className="opacity-30">[NEXT]</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
