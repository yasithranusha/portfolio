"use client";

import { useEffect } from "react";
import { ErrorDisplay } from "@/components/ui/error-display";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error("[app] unhandled error:", error);
  }, [error]);

  return (
    <ErrorDisplay
      message={error.message}
      digest={error.digest}
      reset={reset}
    />
  );
}
