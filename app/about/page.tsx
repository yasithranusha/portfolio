import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { ConnectLayout } from "@/components/about/connect-client";

export const metadata: Metadata = {
  title: "CONNECT // System Identity",
  description: `About ${siteConfig.name} — ${siteConfig.role}`,
};

export default function AboutPage() {
  const sidePanel = (
    <div className="lg:flex-1 flex flex-col gap-4">

      {/* Identity card */}
      <div className="bg-surface-container-low border border-[#494847]/20 p-5">
        <div className="text-[10px] text-on-surface-variant mb-3 font-bold tracking-widest">IDENTITY_RECORD</div>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-primary/10 border border-primary/20 flex items-center justify-center">
            <span className="material-symbols-outlined text-primary">person</span>
          </div>
          <div>
            <div className="font-sans font-bold text-on-surface">{siteConfig.name}</div>
            <div className="text-[10px] text-primary font-mono">{siteConfig.role}</div>
          </div>
        </div>
        <div className="space-y-2 text-[10px] font-mono">
          <div className="flex justify-between">
            <span className="text-on-surface-variant">STATUS</span>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              <span className="text-primary font-bold">ONLINE</span>
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-on-surface-variant">UPTIME</span>
            <span className="text-on-surface font-bold">3,285 DAYS</span>
          </div>
          <div className="flex justify-between">
            <span className="text-on-surface-variant">KERNEL_PANICS</span>
            <span className="text-error font-bold">004</span>
          </div>
          <div className="flex justify-between">
            <span className="text-on-surface-variant">OPEN_TO_WORK</span>
            <span className="text-primary font-bold">TRUE</span>
          </div>
        </div>
      </div>

      {/* Social links */}
      <div className="bg-surface-container-low border border-[#494847]/20 p-5">
        <div className="text-[10px] text-on-surface-variant mb-3 font-bold tracking-widest">CONTACT_NODES</div>
        <div className="space-y-2">
          {Object.entries(siteConfig.socials).map(([platform, url]) => (
            <Link
              key={platform}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-[10px] font-mono text-on-surface-variant hover:text-secondary transition-colors group py-1"
            >
              <span className="text-[#494847] group-hover:text-secondary">{">"}</span>
              <span className="uppercase tracking-widest font-bold">{platform}</span>
              <span className="ml-auto text-[#494847] group-hover:text-secondary truncate max-w-[120px]">
                {url.replace("https://", "")}
              </span>
            </Link>
          ))}
          <Link
            href="mailto:hello@yasithranusha.dev"
            className="flex items-center gap-2 text-[10px] font-mono text-on-surface-variant hover:text-primary transition-colors group py-1"
          >
            <span className="text-[#494847] group-hover:text-primary">{">"}</span>
            <span className="uppercase tracking-widest font-bold">EMAIL</span>
            <span className="ml-auto text-[#494847] group-hover:text-primary">hello@...</span>
          </Link>
        </div>
      </div>

      {/* System metrics */}
      <div className="bg-surface-container-low border border-[#494847]/20 p-5">
        <div className="text-[10px] text-on-surface-variant mb-3 font-bold tracking-widest">SYSTEM_METRICS</div>
        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-[10px] mb-1">
              <span className="text-on-surface-variant">CAFFEINE_SAT</span>
              <span className="text-primary font-bold">82%</span>
            </div>
            <div className="w-full h-1 bg-[#262626]">
              <div className="bg-primary h-full" style={{ width: "82%" }} />
            </div>
          </div>
          <div>
            <div className="flex justify-between text-[10px] mb-1">
              <span className="text-on-surface-variant">FOCUS_LEVEL</span>
              <span className="text-tertiary font-bold">94%</span>
            </div>
            <div className="w-full h-1 bg-[#262626]">
              <div className="bg-tertiary h-full" style={{ width: "94%" }} />
            </div>
          </div>
          <div>
            <div className="flex justify-between text-[10px] mb-1">
              <span className="text-on-surface-variant">BUG_TOLERANCE</span>
              <span className="text-secondary font-bold">67%</span>
            </div>
            <div className="w-full h-1 bg-[#262626]">
              <div className="bg-secondary h-full" style={{ width: "67%" }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="mt-12 mb-10 p-8 min-h-screen">
      <div className="max-w-5xl mx-auto">

        {/* ─── Breadcrumb / Header ─────────────────────────────────── */}
        <div className="mb-12">
          <div className="flex items-center gap-2 text-[10px] font-bold text-primary mb-2 opacity-80">
            <span className="bg-primary/10 px-2 py-0.5">AUTH: ROOT</span>
            <span className="opacity-30">/</span>
            <span className="bg-[#262626] px-2 py-0.5">ENDPOINT: /api/v1/identity</span>
          </div>
          <h1 className="font-sans text-5xl md:text-7xl font-bold tracking-tighter text-white mb-4">
            SYSTEM_IDENTITY /{" "}
            <span className="text-primary/40">CONNECT</span>
          </h1>
          <div className="h-1 w-24 bg-primary" />
        </div>

        {/* ─── Terminal + Side Panel + System Log ──────────────────── */}
        <ConnectLayout sidePanel={sidePanel} />

      </div>
    </div>
  );
}
