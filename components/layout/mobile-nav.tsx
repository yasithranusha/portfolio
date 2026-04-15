"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { siteConfig } from "@/config/site";

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      <button
        onClick={() => setOpen((v) => !v)}
        className="p-1 text-[#adaaaa] hover:text-[#55fe7e] transition-colors"
        aria-label="Toggle menu"
      >
        <span className="font-mono text-sm">{open ? "[×]" : "[≡]"}</span>
      </button>

      {open && (
        <div className="fixed inset-0 top-12 z-40 bg-[#0e0e0e]/95 flex flex-col gap-1 p-6">
          {siteConfig.nav.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`text-sm font-mono tracking-widest uppercase py-3 border-b border-[#494847]/20 transition-colors ${
                  active ? "text-[#55fe7e]" : "text-[#adaaaa] hover:text-[#55fe7e]"
                }`}
              >
                <span className="text-[#494847] mr-2">&gt;</span>
                {item.label}
              </Link>
            );
          })}
        </div>
      )}
    </>
  );
}
