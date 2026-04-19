"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "@/components/ui/icon";

interface NavItem {
  label: string;
  href: string;
}

interface SidebarNavProps {
  items: readonly NavItem[];
  icons: Record<string, string>;
}

export function SidebarNav({ items, icons }: SidebarNavProps) {
  const pathname = usePathname();

  return (
    <nav className="flex-1 py-4 font-mono text-[10px] uppercase">
      {items.map((item) => {
        const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
        const icon = icons[item.href] ?? "chevron_right";
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-4 px-6 py-3 transition-all ${
              active
                ? "bg-[#262626] text-[#55fe7e] border-l-4 border-[#55fe7e]"
                : "text-[#494847] hover:text-[#adaaaa] hover:bg-[#131313]"
            }`}
          >
            <Icon name={icon} className="text-sm" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
