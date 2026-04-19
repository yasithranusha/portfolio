import Link from "next/link";
import { type NotionPost } from "@/lib/notion";
import { Tag } from "@/components/ui/tag";

interface PostCardProps {
  post: NotionPost;
}

function formatDate(dateStr: string): string {
  if (!dateStr) return "---";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }).toUpperCase();
}

export function PostCard({ post }: PostCardProps) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 px-4 py-3 border-b border-outline-variant/20 hover:bg-[#131313] transition-colors"
    >
      {/* Permissions / file info */}
      <span className="hidden sm:inline text-[10px] font-mono text-outline-variant flex-shrink-0 select-none">
        -rwxr-xr-x
      </span>

      {/* Date */}
      <span className="text-[10px] font-mono text-outline flex-shrink-0 w-28">
        [{formatDate(post.date)}]
      </span>

      {/* Title */}
      <span className="flex-1 font-mono text-sm text-on-surface-variant group-hover:text-primary transition-colors truncate">
        {post.title.toLowerCase().replace(/\s+/g, "_")}.md
      </span>

      {/* Tags */}
      <div className="flex items-center gap-1 flex-shrink-0">
        {post.tags.slice(0, 3).map((tag) => (
          <Tag key={tag} variant="default" className="text-[9px]">
            #{tag}
          </Tag>
        ))}
      </div>

      {/* Read time */}
      <span className="hidden sm:inline text-[10px] font-mono text-outline flex-shrink-0 w-10 text-right">
        [{post.readTime}]
      </span>
    </Link>
  );
}
