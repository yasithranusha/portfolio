import Link from "next/link";
import { siteConfig } from "@/config/site";
import { SidebarNav } from "./sidebar-nav";

const sidebarIcons: Record<string, string> = {
  "/":        "account_tree",
  "/blog":    "database",
  "/projects":"lan",
  "/about":   "security",
};

export function Sidebar() {
  return (
    <aside className="fixed left-0 top-12 bottom-0 flex flex-col bg-[#0e0e0e] w-64 border-r border-[#494847]/10 z-40 hidden md:flex">
      {/* Identity header */}
      <div className="p-6 bg-[#131313] border-b border-[#494847]/10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[#262626] border border-[#55fe7e]/30 flex items-center justify-center flex-shrink-0">
            <span className="material-symbols-outlined text-[#55fe7e] text-sm">terminal</span>
          </div>
          <div>
            <div className="text-[#55fe7e] font-black font-mono text-xs tracking-wide">SYSTEM_EXPLORER</div>
            <div className="text-[#494847] text-[10px] font-mono uppercase">v2.0.4-stable</div>
          </div>
        </div>
      </div>

      {/* Nav items */}
      <SidebarNav items={siteConfig.nav} icons={sidebarIcons} />

      {/* Bottom actions */}
      <div className="p-6 border-t border-[#494847]/10 mt-auto">
        <a 
          href={siteConfig.socials.github} 
          target="_blank" 
          rel="noopener noreferrer"
          className="w-full bg-[#55fe7e] text-[#005d23] py-2 font-bold text-[10px] font-mono uppercase tracking-widest hover:shadow-[0_0_15px_rgba(85,254,126,0.4)] transition-all flex items-center justify-center text-center cursor-pointer"
        >
          EXECUTE_FORK
        </a>
      </div>
    </aside>
  );
}
