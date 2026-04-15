import { type NotionPost } from "@/lib/notion";
import { PostCard } from "./post-card";

interface PostListProps {
  posts: NotionPost[];
}

export function PostList({ posts }: PostListProps) {
  if (!posts.length) {
    return (
      <div className="px-4 py-8 text-center font-mono text-sm text-[#494847]">
        // no entries found
      </div>
    );
  }

  return (
    <div className="border border-[#494847]/20">
      {/* ls -la header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 px-4 py-2 bg-[#131313] border-b border-[#494847]/30">
        <span className="hidden sm:inline text-[9px] font-mono text-[#494847] flex-shrink-0 w-24">permissions</span>
        <span className="text-[9px] font-mono text-[#494847] flex-shrink-0 w-28">date</span>
        <span className="flex-1 text-[9px] font-mono text-[#494847]">filename</span>
        <span className="hidden sm:inline text-[9px] font-mono text-[#494847]">tags</span>
        <span className="hidden sm:inline text-[9px] font-mono text-[#494847] w-10 text-right">time</span>
      </div>

      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}
