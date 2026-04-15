"use client";

import { usePathname } from "next/navigation";
import { siteConfig } from "@/config/site";

const pathLabels: Record<string, string> = {
  "/": "~",
  "/blog": "~/blog",
  "/projects": "~/projects",
  "/about": "~/about",
};

export function NavPath() {
  const pathname = usePathname();

  // Match base path for dynamic routes
  let label = "~";
  for (const [key, value] of Object.entries(pathLabels)) {
    if (pathname === key || (key !== "/" && pathname.startsWith(key))) {
      label = value;
      // Handle dynamic segments like /blog/[slug]
      if (pathname !== key) {
        const rest = pathname.slice(key.length);
        label = value + rest;
      }
    }
  }

  return (
    <span className="hidden sm:inline-flex items-center gap-0 text-[11px] font-mono text-[#adaaaa]">
      <span className="text-[#55fe7e]">{siteConfig.handle}</span>
      <span className="text-[#adaaaa]">@portfolio:</span>
      <span className="text-[#5db4fe]">{label}</span>
    </span>
  );
}
