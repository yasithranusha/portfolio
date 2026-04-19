"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { siteConfig } from "@/config/site";
import { motion, AnimatePresence } from "motion/react";
import { Icon } from "@/components/ui/icon";

export function MobileMenu() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className="text-[#55fe7e] p-1 flex items-center justify-center hover:bg-[#262626] transition-colors rounded text-sm sm:text-base border border-transparent hover:border-[#494847]/20"
        aria-label="Toggle Menu"
      >
        <Icon name={open ? "close" : "menu"} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="absolute top-12 left-0 w-full bg-[#131313] border-b border-[#494847]/30 flex flex-col shadow-2xl z-40 overflow-hidden"
          >
            <div className="flex flex-col py-2">
              {siteConfig.nav.map((item) => {
                const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={`py-3 px-6 transition-colors duration-100 uppercase tracking-widest text-xs font-bold ${
                      active
                        ? "text-[#55fe7e] bg-primary/10 border-l-2 border-[#55fe7e] pl-5"
                        : "text-[#adaaaa] hover:text-[#55fe7e] hover:bg-[#262626] border-l-2 border-transparent"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
