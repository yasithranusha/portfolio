import { Skeleton } from "@/components/ui/skeleton";
import { SectionLabel } from "@/components/ui/section-label";

export default function BlogPostLoading() {
  return (
    <div className="max-w-6xl mx-auto w-full">
      {/* Breadcrumb Skeleton */}
      <div className="mb-8 flex items-center justify-between">
        <Skeleton className="h-4 w-32 bg-surface-container-highest" />
      </div>

      {/* Post header Skeleton */}
      <header className="mb-10 space-y-4 pb-8 border-b border-outline-variant/20">
        <SectionLabel>log_entry</SectionLabel>
        <Skeleton className="h-10 sm:h-12 w-3/4 bg-surface-container-highest" />
        <Skeleton className="h-4 w-1/3 bg-surface-container-highest" />
        <div className="flex flex-wrap gap-1.5 pt-2">
          <Skeleton className="h-6 w-16 rounded-full bg-surface-container-highest" />
          <Skeleton className="h-6 w-20 rounded-full bg-surface-container-highest" />
        </div>
      </header>

      {/* Cover Image Skeleton - EXACTLY matching the Cover Image layout */}
      <div className="relative aspect-[2.6/1] mb-12 rounded-lg overflow-hidden border border-outline-variant/30">
        {/* We use bg-surface-container-low to match the /blog skeleton styling */}
        <Skeleton className="absolute inset-0 bg-surface-container-low" />
        
        {/* Same overlays as the real cover image so the aesthetic perfectly matches */}
        <div className="absolute inset-0 bg-black/10 mix-blend-overlay pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent pointer-events-none" />
        <div className="absolute inset-0 pointer-events-none opacity-20 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />
      </div>

      {/* Content Skeleton */}
      <div className="space-y-6">
        <Skeleton className="h-4 w-full bg-surface-container-highest" />
        <Skeleton className="h-4 w-5/6 bg-surface-container-highest" />
        <Skeleton className="h-4 w-4/6 bg-surface-container-highest" />
        <Skeleton className="h-32 w-full mt-8 bg-surface-container-highest" />
        <Skeleton className="h-4 w-full bg-surface-container-highest" />
        <Skeleton className="h-4 w-3/4 bg-surface-container-highest" />
      </div>
    </div>
  );
}
