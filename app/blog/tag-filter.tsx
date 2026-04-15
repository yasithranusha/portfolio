"use client";

import { useState } from "react";
import { type NotionPost } from "@/lib/notion";
import { PostList } from "@/components/blog/post-list";
import { Tag } from "@/components/ui/tag";

interface TagFilterProps {
  posts: NotionPost[];
  allTags: string[];
}

export function TagFilter({ posts, allTags }: TagFilterProps) {
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const filtered = activeTag
    ? posts.filter((p) => p.tags.includes(activeTag))
    : posts;

  return (
    <div className="space-y-4">
      {/* Tag pills */}
      {allTags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveTag(null)}
            className={`text-[10px] font-mono tracking-widest uppercase px-2 py-0.5 border transition-colors ${
              !activeTag
                ? "border-[#55fe7e]/50 text-[#55fe7e] bg-[#55fe7e]/5"
                : "border-[#494847]/40 text-[#494847] hover:text-[#adaaaa]"
            }`}
          >
            ALL
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setActiveTag(activeTag === tag ? null : tag)}
              className={`text-[10px] font-mono tracking-widest uppercase px-2 py-0.5 border transition-colors ${
                activeTag === tag
                  ? "border-[#5db4fe]/50 text-[#5db4fe] bg-[#5db4fe]/5"
                  : "border-[#494847]/40 text-[#494847] hover:text-[#adaaaa]"
              }`}
            >
              #{tag}
            </button>
          ))}
        </div>
      )}

      <PostList posts={filtered} />
    </div>
  );
}
