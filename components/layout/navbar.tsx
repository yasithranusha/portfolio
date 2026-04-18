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
        <NavLinks />
      </div>

      {/* Right: socials / functional links could go here if needed in future */}
      <div className="flex items-center gap-3">
        {/* Placeholder for real functional actions */}
      </div>
    </header>
  );
}
