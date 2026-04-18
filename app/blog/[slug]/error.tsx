"use client";

import { useEffect } from "react";
import Link from "next/link";
import { ErrorDisplay } from "@/components/ui/error-display";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function PostError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error("[blog/post] unhandled error:", error);
  }, [error]);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <div className="mb-8">
        <Link
          href="/blog"
          className="text-[10px] font-mono text-[#adaaaa] hover:text-[#5db4fe] transition-colors tracking-widest"
        >
          ← /archives
        </Link>
      </div>
      <ErrorDisplay
        title="POST RENDER FAULT"
        message={error.message}
        digest={error.digest}
        reset={reset}
      />
    </div>
  );
}
