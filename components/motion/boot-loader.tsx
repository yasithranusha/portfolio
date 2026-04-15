"use client";

import { useEffect, useState } from "react";
import { siteConfig } from "@/config/site";

export function BootLoader() {
  const [visible, setVisible] = useState(false);
  const [hiding, setHiding] = useState(false);

  useEffect(() => {
    // Only show once per session
    if (typeof sessionStorage !== "undefined") {
      if (sessionStorage.getItem("booted")) return;
      sessionStorage.setItem("booted", "1");
    }
    setVisible(true);

    // Start fade-out after last line (~1.4s) + brief pause
    const timer = setTimeout(() => setHiding(true), 1800);
    const remove = setTimeout(() => setVisible(false), 2400);
    return () => {
      clearTimeout(timer);
      clearTimeout(remove);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-[9998] bg-[#0e0e0e] flex items-start justify-start p-8 sm:p-16"
      style={{
        opacity: hiding ? 0 : 1,
        transition: "opacity 500ms ease-in-out",
        pointerEvents: hiding ? "none" : "auto",
      }}
    >
      <div className="font-mono text-sm text-[#55fe7e] space-y-1">
        {siteConfig.bootLines.map((line, i) => (
          <div
            key={i}
            className="boot-line"
            style={{
              opacity: 0,
              animation: `bootFadeIn 80ms ease forwards`,
              animationDelay: `${i * 280}ms`,
            }}
          >
            {line}
          </div>
        ))}
        <div
          className="flex items-center gap-1"
          style={{
            opacity: 0,
            animation: `bootFadeIn 80ms ease forwards`,
            animationDelay: `${siteConfig.bootLines.length * 280 + 100}ms`,
          }}
        >
          <span className="text-[#adaaaa]">$</span>
          <span className="cursor-blink text-white">_</span>
        </div>
      </div>
    </div>
  );
}
