"use client";

import { useState, useEffect } from "react";
import { makePrompt } from "@/lib/terminal-exec";

export function TerminalLoading() {
  const [progress, setProgress] = useState(0);
  const [dots, setDots] = useState("");

  useEffect(() => {
    // Simulate progression
    const pTimer = setInterval(() => {
      setProgress((v) => {
        if (v >= 95) return v; // Keep at 95 until real data takes over
        return v + Math.floor(Math.random() * 8) + 2;
      });
    }, 120);

    // Animate trailing dots
    const dTimer = setInterval(() => {
      setDots((v) => (v.length < 3 ? v + "." : ""));
    }, 350);

    return () => {
      clearInterval(pTimer);
      clearInterval(dTimer);
    };
  }, []);

  const barWidth = 12;
  const filled = Math.floor((progress / 100) * barWidth);
  const bar = "#".repeat(filled).padEnd(barWidth, "-");

  return (
    <div className="flex flex-col bg-black border border-[#494847]/20 font-mono text-xs overflow-hidden mt-8 h-72">
      {/* Stoplight header */}
      <div className="h-8 bg-[#1a1919] px-4 flex items-center justify-between border-b border-[#494847]/10 flex-shrink-0 focus:outline-none">
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-error/60" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]/60" />
          <div className="w-2.5 h-2.5 rounded-full bg-primary/60" />
        </div>
        <span className="text-[10px] font-bold text-on-surface-variant/40 tracking-widest uppercase">
          Archive
        </span>
      </div>

      {/* Body with simulated command and progress */}
      <div className="p-4 space-y-0.5 min-h-0">
        <div className="flex gap-2 leading-5">
          <span className="text-primary select-none flex-shrink-0">{makePrompt("~")}</span>
          <span className="text-on-surface">ls -la -n 5</span>
        </div>
        <div className="text-on-surface-variant leading-5 whitespace-pre">
           [{bar}] {String(progress).padStart(3, " ")}% indexing /archives{dots.padEnd(3, " ")}
        </div>
      </div>
    </div>
  );
}
