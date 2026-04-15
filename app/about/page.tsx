import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "CONNECT // System Identity",
  description: `About ${siteConfig.name} — ${siteConfig.role}`,
};

const identityJson = {
  status: "200 OK",
  endpoint: "GET /api/v1/identity",
  lines: [
    { n: 1,  content: `{` },
    { n: 2,  content: `  <span class="text-tertiary">"handle"</span>: <span class="text-secondary-fixed-dim">"${siteConfig.handle}"</span>,` },
    { n: 3,  content: `  <span class="text-tertiary">"name"</span>: <span class="text-secondary-fixed-dim">"${siteConfig.name}"</span>,` },
    { n: 4,  content: `  <span class="text-tertiary">"role"</span>: <span class="text-secondary-fixed-dim">"${siteConfig.role}"</span>,` },
    { n: 5,  content: `  <span class="text-tertiary">"status"</span>: <span class="text-primary">"online"</span>,` },
    { n: 6,  content: `  <span class="text-tertiary">"location"</span>: <span class="text-secondary-fixed-dim">"Sri Lanka / Remote"</span>,` },
    { n: 7,  content: `  <span class="text-tertiary">"specialization"</span>: [` },
    { n: 8,  content: `    <span class="text-secondary-fixed-dim">"Distributed Systems"</span>,` },
    { n: 9,  content: `    <span class="text-secondary-fixed-dim">"Cloud-Native Infrastructure"</span>,` },
    { n: 10, content: `    <span class="text-secondary-fixed-dim">"DevOps & Platform Engineering"</span>,` },
    { n: 11, content: `    <span class="text-secondary-fixed-dim">"Open Source"</span>` },
    { n: 12, content: `  ],` },
    { n: 13, content: `  <span class="text-tertiary">"stack"</span>: {` },
    { n: 14, content: `    <span class="text-tertiary">"languages"</span>: [<span class="text-secondary-fixed-dim">"Go"</span>, <span class="text-secondary-fixed-dim">"TypeScript"</span>, <span class="text-secondary-fixed-dim">"Python"</span>, <span class="text-secondary-fixed-dim">"Rust"</span>],` },
    { n: 15, content: `    <span class="text-tertiary">"cloud"</span>: [<span class="text-secondary-fixed-dim">"AWS"</span>, <span class="text-secondary-fixed-dim">"GCP"</span>, <span class="text-secondary-fixed-dim">"Kubernetes"</span>],` },
    { n: 16, content: `    <span class="text-tertiary">"backend"</span>: [<span class="text-secondary-fixed-dim">"gRPC"</span>, <span class="text-secondary-fixed-dim">"GraphQL"</span>, <span class="text-secondary-fixed-dim">"PostgreSQL"</span>],` },
    { n: 17, content: `    <span class="text-tertiary">"devops"</span>: [<span class="text-secondary-fixed-dim">"Terraform"</span>, <span class="text-secondary-fixed-dim">"ArgoCD"</span>, <span class="text-secondary-fixed-dim">"Helm"</span>]` },
    { n: 18, content: `  },` },
    { n: 19, content: `  <span class="text-tertiary">"contact"</span>: {` },
    { n: 20, content: `    <span class="text-tertiary">"github"</span>: <span class="text-secondary-fixed-dim">"${siteConfig.socials.github}"</span>,` },
    { n: 21, content: `    <span class="text-tertiary">"linkedin"</span>: <span class="text-secondary-fixed-dim">"${siteConfig.socials.linkedin}"</span>,` },
    { n: 22, content: `    <span class="text-tertiary">"twitter"</span>: <span class="text-secondary-fixed-dim">"${siteConfig.socials.twitter}"</span>` },
    { n: 23, content: `  },` },
    { n: 24, content: `  <span class="text-tertiary">"open_to_work"</span>: <span class="text-primary">true</span>,` },
    { n: 25, content: `  <span class="text-tertiary">"kernel_panics"</span>: <span class="text-error">4</span>` },
    { n: 26, content: `}` },
  ],
};

export default function AboutPage() {
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

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* ─── API Response Viewer ─────────────────────────────── */}
          <div className="lg:col-span-8">
            {/* HTTP request header */}
            <div className="bg-[#262626] border border-[#494847]/20 px-4 py-2 flex items-center justify-between mb-0">
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-bold text-primary border border-primary/30 px-2 py-0.5">GET</span>
                <span className="text-xs font-mono text-on-surface-variant">/api/v1/identity</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <span className="text-[10px] font-bold text-primary">200 OK</span>
              </div>
            </div>

            {/* JSON viewer */}
            <div className="bg-surface-container-low border border-[#494847]/20 border-t-0 overflow-hidden">
              {/* Terminal stoplight header */}
              <div className="h-8 bg-surface-container-high px-4 flex items-center justify-between border-b border-[#494847]/10">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-error/50" />
                  <div className="w-2.5 h-2.5 rounded-full bg-secondary/50" />
                  <div className="w-2.5 h-2.5 rounded-full bg-primary/50" />
                </div>
                <div className="text-[10px] font-bold text-on-surface-variant/50 tracking-widest">
                  RESPONSE_BODY :: application/json
                </div>
              </div>

              {/* Code lines */}
              <div className="p-0 font-mono text-xs overflow-x-auto">
                {identityJson.lines.map((line) => (
                  <div key={line.n} className="flex hover:bg-[#262626]/50 group">
                    <span className="select-none w-10 text-right pr-4 text-[#494847] text-[10px] py-1 border-r border-[#494847]/10 flex-shrink-0 group-hover:text-on-surface-variant">
                      {line.n}
                    </span>
                    <span
                      className="pl-4 py-1 text-on-surface-variant leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: line.content }}
                    />
                  </div>
                ))}
              </div>

              {/* Terminal footer */}
              <div className="border-t border-[#494847]/10 px-4 py-3 bg-black">
                <div className="flex items-center gap-2 text-xs font-mono">
                  <span className="text-primary">$</span>
                  <span className="text-on-surface-variant">sudo contact --me</span>
                  <span className="inline-block w-2 h-4 bg-primary animate-pulse" />
                </div>
              </div>
            </div>

            {/* MAN PAGE hint */}
            <div className="mt-3 flex items-center gap-2">
              <span className="material-symbols-outlined text-xs text-on-surface-variant/50">info</span>
              <span className="text-[10px] font-mono text-on-surface-variant/50 uppercase tracking-widest">
                MAN PAGE: CONTACT(1) — see socials below for direct channels
              </span>
            </div>
          </div>

          {/* ─── Side Panel ──────────────────────────────────────── */}
          <div className="lg:col-span-4 flex flex-col gap-4">

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
                  href={`mailto:hello@yasithranusha.dev`}
                  className="flex items-center gap-2 text-[10px] font-mono text-on-surface-variant hover:text-primary transition-colors group py-1"
                >
                  <span className="text-[#494847] group-hover:text-primary">{">"}</span>
                  <span className="uppercase tracking-widest font-bold">EMAIL</span>
                  <span className="ml-auto text-[#494847] group-hover:text-primary">hello@...</span>
                </Link>
              </div>
            </div>

            {/* Quick stats */}
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
        </div>

        {/* ─── Terminal Diagnostics ──────────────────────────────── */}
        <div className="mt-8 bg-black p-4 border border-[#494847]/10 font-mono text-[10px]">
          <div className="flex items-center gap-2 mb-2 text-primary border-b border-primary/20 pb-1">
            <span className="material-symbols-outlined text-xs">terminal</span>
            <span>IDENTITY_RESOLUTION_LOG</span>
          </div>
          <div className="space-y-1 opacity-70">
            <div className="flex gap-4">
              <span className="text-[#494847]">[09:14:01]</span>
              <span className="text-secondary">INFO</span>
              <span>Identity record fetched from master registry.</span>
            </div>
            <div className="flex gap-4">
              <span className="text-[#494847]">[09:14:02]</span>
              <span className="text-primary">SUCCESS</span>
              <span>Permissions verified: READ_ONLY access granted.</span>
            </div>
            <div className="flex gap-4">
              <span className="text-[#494847]">[09:14:03]</span>
              <span className="text-tertiary">INFO</span>
              <span>Contact nodes reachable. Response time: 12ms.</span>
            </div>
            <div className="flex gap-4 animate-pulse">
              <span className="text-[#494847]">[09:14:04]</span>
              <span className="text-white">WAIT</span>
              <span>Awaiting connection request...</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
