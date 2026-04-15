import Link from "next/link";
import { siteConfig } from "@/config/site";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-[#494847]/20 bg-[#131313]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-[10px] font-mono text-[#494847] tracking-widest uppercase">
          {siteConfig.handle}@kernel:~${" "}
          <span className="text-[#adaaaa]">uptime: ∞</span>
        </p>

        <div className="flex items-center gap-4">
          {Object.entries(siteConfig.socials).map(([platform, url]) => (
            <Link
              key={platform}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[10px] font-mono text-[#adaaaa] hover:text-[#85ecff] transition-colors tracking-widest uppercase"
            >
              &gt; {platform}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
