"use client";

import { useEffect, useRef, useState } from "react";
import type { BlogHeading } from "./post-renderer";
import { cn } from "@/lib/utils";

export function PostContent({ html, headings }: { html: string; headings: BlogHeading[] }) {
  const ref = useRef<HTMLElement>(null);
  const [activeId, setActiveId] = useState<string>(headings[0]?.id || "");
  const initialized = useRef(false);

  useEffect(() => {
    const handleScroll = () => {
      const headingElements = Array.from(ref.current?.querySelectorAll("h1, h2, h3") || []);
      if (headingElements.length === 0) return;

      // Find the heading that is closest to the top of the viewport but still below it
      // or the last one that passed the top
      let currentActiveId = activeId;
      const scrollThreshold = 120; // Distance from top to trigger highlight

      // Check if we are at the bottom of the page
      const isAtBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 100;
      
      if (isAtBottom && headingElements.length > 0) {
        currentActiveId = headingElements[headingElements.length - 1].id;
      } else {
        for (const el of headingElements) {
          const rect = el.getBoundingClientRect();
          if (rect.top < scrollThreshold) {
            currentActiveId = el.id;
          } else {
            break;
          }
        }
      }

      if (currentActiveId !== activeId) {
        setActiveId(currentActiveId);
      }
    };

    // Throttle scroll events for performance
    let timeoutId: NodeJS.Timeout | null = null;
    const throttledScroll = () => {
      if (!timeoutId) {
        timeoutId = setTimeout(() => {
          handleScroll();
          timeoutId = null;
        }, 100);
      }
    };

    window.addEventListener("scroll", throttledScroll, { passive: true });
    // Initial check
    handleScroll();

    return () => {
      window.removeEventListener("scroll", throttledScroll);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [activeId]); // Re-run when activeId changes to keep listener up to date

  useEffect(() => {
    if (!ref.current) return;
    ref.current.querySelectorAll("pre").forEach((pre) => {
      if (pre.querySelector(".copy-btn")) return;

      const code = pre.querySelector("code")?.textContent ?? pre.textContent ?? "";

      // Wrap pre in a relative container so the button doesn't scroll with code
      const wrapper = document.createElement("div");
      wrapper.className = "relative group";
      pre.parentNode?.insertBefore(wrapper, pre);
      wrapper.appendChild(pre);

      const btn = document.createElement("button");
      btn.className =
        "copy-btn absolute top-2 right-2 text-[10px] font-mono border border-[#494847]/60 px-2 py-1 text-[#adaaaa] hover:text-primary hover:border-primary/40 transition-colors bg-[#0e0e0e] cursor-pointer opacity-0 group-hover:opacity-100";
      btn.textContent = "COPY";
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        navigator.clipboard.writeText(code).then(() => {
          const originalText = btn.textContent;
          btn.textContent = "COPIED";
          btn.classList.add("border-primary", "text-primary", "bg-primary/5", "animate-pulse");
          
          setTimeout(() => { 
            btn.textContent = originalText;
            btn.classList.remove("border-primary", "text-primary", "bg-primary/5", "animate-pulse");
          }, 2000);
        });
      });

      wrapper.appendChild(btn);
    });
  }, [html]);

  return (
    <div className="relative flex flex-col md:flex-row gap-12 mt-8">
      {/* Table of Contents - Desktop Only */}
      <aside className="hidden lg:block w-64 shrink-0">
        <div className="sticky top-24">
          <div className="text-[10px] font-mono text-primary/70 mb-4 tracking-widest flex items-center gap-2">
            <span className="w-2 h-2 bg-primary animate-pulse rounded-full" />
            CONTENT_INDEX
          </div>
          <nav className="space-y-4 border-l border-outline-variant/10">
            {headings.map((heading) => (
              <a
                key={heading.id}
                href={`#${heading.id}`}
                className={cn(
                  "block text-[11px] font-mono transition-all duration-300 pl-4 border-l -ml-px hover:text-white",
                  heading.level === 1 ? "font-bold" : "text-[#7e7e7e]",
                  heading.level === 3 ? "pl-8" : "",
                  activeId === heading.id 
                    ? "text-primary border-primary font-bold" 
                    : "border-transparent text-[#adaaaa]"
                )}
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById(heading.id)?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                {heading.level === 1 ? "> " : ""}
                {heading.text}
              </a>
            ))}
          </nav>
        </div>
      </aside>

      <article
        ref={ref}
        className="font-mono text-sm max-w-none flex-1 [&_pre]:my-6 [&_pre]:overflow-x-auto [&_pre]:p-4 [&_pre]:border [&_pre]:border-[#494847]/30 [&_pre]:bg-[#0e0e0e]"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}
