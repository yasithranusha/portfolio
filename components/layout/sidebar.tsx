import Link from "next/link";
import { siteConfig } from "@/config/site";
import { SidebarNav } from "./sidebar-nav";
import { Icon } from "@/components/ui/icon";

const sidebarIcons: Record<string, string> = {
  "/":        "account_tree",
  "/blog":    "database",
  "/projects":"lan",
  "/about":   "security",
};

export function Sidebar() {
  return (
    <aside className="fixed left-0 top-12 bottom-0 flex flex-col bg-surface w-64 border-r border-outline-variant/10 z-40 hidden md:flex">
      {/* Identity header */}
      <div className="p-6 bg-surface-container-low border-b border-outline-variant/10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-surface-container-highest border border-primary/30 flex items-center justify-center flex-shrink-0">
            <Icon name="terminal" className="text-primary text-sm" />
          </div>
          <div>
            <div className="text-primary font-black font-mono text-xs tracking-wide">SYSTEM_EXPLORER</div>
            <div className="text-outline-variant text-[10px] font-mono uppercase">v2.0.4-stable</div>
          </div>
        </div>
      </div>

      {/* Nav items */}
      <SidebarNav items={siteConfig.nav} icons={sidebarIcons} />

      {/* Bottom actions */}
      <div className="p-6 border-t border-outline-variant/10 mt-auto">
        <a
          href={siteConfig.socials.github}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full bg-primary text-on-primary py-2 font-bold text-[10px] font-mono uppercase tracking-widest hover:shadow-[0_0_15px_rgba(85,254,126,0.4)] transition-all flex items-center justify-center text-center cursor-pointer"
        >
          EXECUTE_FORK
        </a>
        <div className="mt-4 flex flex-col gap-2 font-mono text-[10px] uppercase">
          <Link href="/about" className="flex items-center gap-2 text-outline hover:text-on-surface-variant cursor-pointer transition-colors">
            <Icon name="settings" className="text-xs" />
            SETTINGS
          </Link>
          <a href={`mailto:${siteConfig.email}`} className="flex items-center gap-2 text-outline hover:text-error cursor-pointer transition-colors">
            <Icon name="power_settings_new" className="text-xs" />
            DISCONNECT (MAIL)
          </a>
        </div>
      </div>
    </aside>
  );
}
