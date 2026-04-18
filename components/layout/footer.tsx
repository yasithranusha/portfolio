import Link from "next/link";
import { siteConfig } from "@/config/site";

export function Footer() {
  return (
    <footer className="fixed bottom-0 w-full flex flex-col sm:flex-row justify-between items-center px-4 py-2 z-50 bg-[#000000] border-t border-[#494847]/20 font-mono text-[10px]">
      <div className="text-[#494847] order-2 sm:order-1 uppercase">
        © 2026 YASITH.SYS | UPTIME: 99.9% |{" "}
        <span className="text-[#55fe7e] animate-pulse">SYSTEM_READY</span>
      </div>
      <div className="flex gap-4 order-1 sm:order-2 mb-1 sm:mb-0">
        <Link
          href={siteConfig.socials.github}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#55fe7e] underline hover:text-[#85ecff] transition-colors uppercase"
        >
          GITHUB_URI
        </Link>
        <Link
          href={siteConfig.socials.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#494847] hover:text-[#55fe7e] transition-colors uppercase"
        >
          LINKEDIN_URI
        </Link>
        <div className="flex items-center text-[#494847] italic ml-2">
          <span className="mr-1">{siteConfig.handle}@kernel:~$</span>
          <span className="w-1.5 h-3 bg-[#55fe7e] cursor-blink inline-block" />
        </div>
      </div>
    </footer>
  );
}
