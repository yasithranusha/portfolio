"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface ReadingProgressProps {
  className?: string;
}

export function ReadingProgress({ className }: ReadingProgressProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const updateProgress = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollHeight === 0) return;
      const currentProgress = (window.scrollY / scrollHeight) * 100;
      setProgress(Math.min(100, Math.max(0, currentProgress)));
    };

    window.addEventListener("scroll", updateProgress);
    updateProgress();

    return () => window.removeEventListener("scroll", updateProgress);
  }, []);

  // Create the [##########..........] string
  const barLength = 20;
  const filledLength = Math.round((progress / 100) * barLength);
  const emptyLength = barLength - filledLength;
  const bar = `${"#".repeat(filledLength)}${".".repeat(emptyLength)}`;

  return (
    <div className={cn(
      "fixed bottom-0 left-0 right-0 z-50 h-8 bg-[#0a0a0a]/90 backdrop-blur-sm border-t border-outline-variant/20 flex items-center justify-center px-4 transition-all duration-300",
      className
    )}>
      <div className="max-w-6xl w-full flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-primary px-3 h-8 -ml-4 skew-x-[-20deg]">
            <span className="font-bold text-[10px] text-black skew-x-[20deg] uppercase tracking-wider">
              PRG
            </span>
          </div>
          <div className="font-mono text-[10px] flex items-center gap-3 select-none">
            <div className="text-[#adaaaa] tracking-widest hidden sm:block">
              [{bar}]
            </div>
            <span className="text-primary font-bold min-w-[4ch]">
              {Math.round(progress)}%
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-4 text-[9px] font-mono">
          <div className="text-outline/60 hidden md:block">
            LC: {Math.round(progress * 10)} lines
          </div>
          <div className="flex items-center gap-2 text-primary/80">
            <span className="w-1 h-1 bg-primary rounded-full animate-pulse" />
            LIVE_BUFFER
          </div>
        </div>
      </div>
    </div>
  );
}
