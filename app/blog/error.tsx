"use client";

import { useEffect } from "react";
import { ErrorDisplay } from "@/components/ui/error-display";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function BlogError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error("[blog] unhandled error:", error);
  }, [error]);

  return (
    <ErrorDisplay
      title="BLOG SEGMENT FAULT"
      message={error.message}
      digest={error.digest}
      reset={reset}
    />
  );
}
