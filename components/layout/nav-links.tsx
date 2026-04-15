"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { siteConfig } from "@/config/site";

export function NavLinks() {
  const pathname = usePathname();

  return (
    <div className="hidden md:flex gap-6 ml-8">
      {siteConfig.nav.map((item) => {
        const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`transition-colors duration-100 ${
              active
                ? "text-[#55fe7e] border-b-2 border-[#55fe7e] pb-1"
                : "text-[#494847] hover:text-[#55fe7e]"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </div>
  );
}
