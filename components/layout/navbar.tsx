import Link from "next/link";
import { MobileMenu } from "./mobile-menu";
import { siteConfig } from "@/config/site";
import { Icon } from "@/components/ui/icon";

export function Navbar() {
  return (
    <header className="flex justify-between items-center px-6 h-12 w-full fixed top-0 z-50 bg-[#131313] font-mono uppercase tracking-widest text-xs">
      {/* Left: logo + nav links */}
      <div className="flex items-center gap-3 md:gap-4">
        <Link href="/" className="text-[#55fe7e] font-bold tracking-tighter text-base">
          {siteConfig.branding}
        </Link>
      </div>

      {/* Right: search + icons + mobile menu */}
      <div className="flex items-center gap-3">
        <div className="md:hidden flex items-center">
          <MobileMenu />
        </div>
        
        <div className="hidden sm:flex items-center gap-3">
          {/* <form 
            action={siteConfig.socials.github} 
            target="_blank"
            className="flex items-center bg-[#262626] px-3 py-1 gap-2 border border-[#494847]/20"
          >
            <span className="text-[#55fe7e] text-[10px]">$</span>
            <input
              aria-label="Search GitHub"
              className="bg-transparent border-none outline-none text-[10px] w-32 text-[#55fe7e] placeholder:text-[#494847] font-mono"
              placeholder="SEARCH_GITHUB..."
              type="text"
              name="q"
            />
          </form> */}
          <Link href="/" title="Open Terminal">
            <Icon name="terminal" className="text-[#55fe7e] cursor-pointer hover:bg-[#262626] p-1 transition-colors text-sm flex items-center justify-center" />
          </Link>
          <Link href="/about" title="System Settings / Identity">
            <Icon name="settings" className="text-[#adaaaa] cursor-pointer hover:bg-[#262626] p-1 transition-colors text-sm flex items-center justify-center" />
          </Link>
        </div>
      </div>
    </header>
  );
}
