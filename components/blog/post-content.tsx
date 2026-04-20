"use client";

import { useEffect, useRef, useState } from "react";
import type { BlogHeading } from "./post-renderer";
import { cn } from "@/lib/utils";

export function PostContent({ html, headings }: { html: string; headings: BlogHeading[] }) {
  const ref = useRef<HTMLElement>(null);
  const [activeId, setActiveId] = useState<string>(headings[0]?.id || "");
  const activeIdRef = useRef(activeId);
  useEffect(() => { activeIdRef.current = activeId; }, [activeId]);

  useEffect(() => {
    const handleScroll = () => {
      const headingElements = Array.from(ref.current?.querySelectorAll("h1, h2, h3") || []);
      if (headingElements.length === 0) return;

      let currentActiveId = activeIdRef.current;
      const scrollThreshold = 120;

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

      if (currentActiveId !== activeIdRef.current) {
        setActiveId(currentActiveId);
      }
    };

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
    handleScroll();

    return () => {
      window.removeEventListener("scroll", throttledScroll);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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
    <div className="relative flex flex-col lg:flex-row gap-12 mt-8">
      {/* Table of Contents - Desktop Only (Sticky Sidebar) */}
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

      <div className="flex-1 min-w-0">
        {/* Mobile Table of Contents (Top of Page) */}
        <div className="block lg:hidden w-full mb-10 border border-outline-variant/20 rounded-sm bg-surface-container-low/20 overflow-hidden">
          <div className="bg-surface-container px-3 py-1.5 border-b border-outline-variant/20 flex items-center justify-between">
            <div className="text-[9px] font-mono text-primary flex items-center gap-2 uppercase tracking-tighter">
              <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
              JUMP_LIST.LOG
            </div>
            <div className="text-[9px] font-mono text-outline lowercase opacity-50">
              {headings.length} sections found
            </div>
          </div>
          <nav className="p-4 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
            {headings.map((heading) => (
              <a
                key={`mobile-${heading.id}`}
                href={`#${heading.id}`}
                className={cn(
                  "text-[11px] font-mono transition-colors hover:text-primary flex items-start gap-2 group",
                  heading.level === 1 ? "text-white font-bold" : "text-[#7e7e7e]"
                )}
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById(heading.id)?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                <span className="text-primary/40 group-hover:text-primary transition-colors">→</span>
                <span className="truncate">{heading.text}</span>
              </a>
            ))}
          </nav>
        </div>

        <article
          ref={ref}
          className="font-mono text-sm max-w-none [&_pre]:my-6 [&_pre]:overflow-x-auto [&_pre]:p-4 [&_pre]:border [&_pre]:border-[#494847]/30 [&_pre]:bg-[#0e0e0e]"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
    </div>
  );
}
