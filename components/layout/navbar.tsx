import Link from "next/link";
import { NavPath } from "./nav-path";
import { NavLinks } from "./nav-links";
import { MobileNav } from "./mobile-nav";

export function Navbar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-12 flex items-center px-4 sm:px-6 bg-[#131313] border-b border-[#494847]/20">
      {/* Logo */}
      <Link
        href="/"
        className="flex-shrink-0 text-[11px] font-mono font-semibold text-[#55fe7e] tracking-widest uppercase glow-primary mr-4"
      >
        [KERNEL_CONSOLE]
      </Link>

      {/* Path breadcrumb */}
      <div className="flex-1 min-w-0 mr-4">
        <NavPath />
      </div>

      {/* Desktop nav links */}
      <NavLinks />

      {/* Mobile hamburger */}
      <div className="md:hidden">
        <MobileNav />
      </div>
    </header>
  );
}
