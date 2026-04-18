import Link from "next/link";
import { NavLinks } from "./nav-links";

export function Navbar() {
  return (
    <header className="flex justify-between items-center px-6 h-12 w-full fixed top-0 z-50 bg-[#131313] font-mono uppercase tracking-widest text-xs">
      {/* Left: logo + nav links */}
      <div className="flex items-center gap-4">
        <Link href="/" className="text-[#55fe7e] font-bold tracking-tighter text-base">
          KERNEL_CONSOLE
        </Link>
        <div className="md:hidden">
          <NavLinks />
        </div>
      </div>

      {/* Right: search + icons */}
      <div className="flex items-center gap-3">
        <form 
          action="https://github.com/yasithranusha" 
          target="_blank"
          className="hidden sm:flex items-center bg-[#262626] px-3 py-1 gap-2 border border-[#494847]/20"
        >
          <span className="text-[#55fe7e] text-[10px]">$</span>
          <input
            className="bg-transparent border-none outline-none text-[10px] w-32 text-[#55fe7e] placeholder:text-[#494847] font-mono"
            placeholder="SEARCH_GITHUB..."
            type="text"
            name="q"
          />
        </form>
        <Link href="/" title="Open Terminal">
          <span className="material-symbols-outlined text-[#55fe7e] cursor-pointer hover:bg-[#262626] p-1 transition-colors text-sm flex items-center justify-center">
            terminal
          </span>
        </Link>
        <Link href="/about" title="System Settings / Identity">
          <span className="material-symbols-outlined text-[#adaaaa] cursor-pointer hover:bg-[#262626] p-1 transition-colors text-sm flex items-center justify-center">
            settings
          </span>
        </Link>
      </div>
    </header>
  );
}
