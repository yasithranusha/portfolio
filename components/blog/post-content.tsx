"use client";

import { useEffect, useRef, useState } from "react";
import type { BlogHeading } from "./post-renderer";
import { cn } from "@/lib/utils";

function TocLink({
  heading,
  activeId,
  mobile = false,
}: {
  heading: BlogHeading;
  activeId?: string;
  mobile?: boolean;
}) {
  const isActive = !mobile && activeId === heading.id;
  const indent = (mobile ? ["pl-0", "pl-4", "pl-8"] : ["pl-4", "pl-8", "pl-12"])[heading.level - 1] ?? "pl-4";

  return (
    <a
      href={`#${heading.id}`}
      className={cn(
        "block text-[11px] font-mono transition-all duration-300 hover:text-white border-l",
        indent,
        heading.level === 1 ? "font-bold" : "text-[#7e7e7e]",
        mobile
          ? "border-transparent hover:border-primary/30 text-[#adaaaa]"
          : ["-ml-px", isActive ? "text-primary border-primary font-bold" : "border-transparent text-[#adaaaa]"],
      )}
      onClick={(e) => {
        e.preventDefault();
        document.getElementById(heading.id)?.scrollIntoView({ behavior: "smooth" });
      }}
    >
      {heading.level === 1 ? "> " : ""}
      {heading.text}
    </a>
  );
}

export function PostContent({ html, headings }: { html: string; headings: BlogHeading[] }) {
  const ref = useRef<HTMLElement>(null);
  const [activeId, setActiveId] = useState<string>(headings[0]?.id || "");
  const activeIdRef = useRef(activeId);
  useEffect(() => { activeIdRef.current = activeId; }, [activeId]);

  useEffect(() => {
    const handleScroll = () => {
      // Avoid unnecessary calculations on mobile viewports
      if (window.innerWidth < 1024) return;

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
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const handleCopy = (e: Event) => {
      const btn = (e.target as Element).closest<HTMLButtonElement>(".copy-btn");
      if (!btn) return;
      const pre = btn.closest(".group")?.querySelector("pre");
      const code = pre?.querySelector("code")?.textContent ?? pre?.textContent ?? "";
      navigator.clipboard.writeText(code).then(() => {
        const orig = btn.textContent;
        btn.textContent = "COPIED";
        btn.classList.add("border-primary", "text-primary", "bg-primary/5", "animate-pulse");
        setTimeout(() => {
          btn.textContent = orig;
          btn.classList.remove("border-primary", "text-primary", "bg-primary/5", "animate-pulse");
        }, 2000);
      });
    };

    el.addEventListener("click", handleCopy);
    return () => el.removeEventListener("click", handleCopy);
  }, []);

  // Handle markdown image loading and skeleton removal
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const images = el.querySelectorAll<HTMLImageElement>('img[data-md-img="true"]');
    
    const onLoad = (img: HTMLImageElement) => {
      // Find the sibling skeleton overlay
      const skeleton = img.previousElementSibling;
      if (skeleton && skeleton.classList.contains('skeleton-overlay')) {
        skeleton.remove();
      }
      // Remove min-height from parent to let it shrink to actual image height
      const parent = img.parentElement;
      if (parent) {
        parent.classList.remove('min-h-[250px]');
      }
      // Fade in the image
      img.classList.remove("opacity-0", "invisible");
      img.classList.add("opacity-100", "visible");
    };

    images.forEach(img => {
      if (img.complete) {
        onLoad(img);
      } else {
        img.addEventListener('load', () => onLoad(img));
        // Add error handler fallback just in case
        img.addEventListener('error', () => onLoad(img)); 
      }
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
              <TocLink key={heading.id} heading={heading} activeId={activeId} />
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
          <nav className="p-4 space-y-3">
            {headings.map((heading) => (
              <TocLink key={`mobile-${heading.id}`} heading={heading} mobile />
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
