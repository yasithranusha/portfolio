"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { siteConfig } from "@/config/site";

export function NavLinks() {
  const pathname = usePathname();

  return (
    <nav className="hidden md:flex items-center gap-5">
      {siteConfig.nav.map((item) => {
        const active =
          item.href === "/"
            ? pathname === "/"
            : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`text-[11px] font-mono tracking-widest uppercase transition-colors duration-150 ${
              active
                ? "text-[#55fe7e] glow-primary"
                : "text-[#adaaaa] hover:text-[#55fe7e]"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
