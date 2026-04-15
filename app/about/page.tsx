import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { SectionLabel } from "@/components/ui/section-label";
import { TerminalWindow } from "@/components/ui/terminal-window";
import { Tag } from "@/components/ui/tag";
import { StaggerReveal } from "@/components/motion/stagger-reveal";
import { StatusDot } from "@/components/ui/status-dot";

export const metadata: Metadata = {
  title: "CONNECT // System Identity",
  description: `About ${siteConfig.name} — ${siteConfig.role}`,
};

const skills = [
  { category: "Languages",     items: ["TypeScript", "Go", "Python", "Rust", "Bash"] },
  { category: "Cloud",         items: ["AWS", "GCP", "Kubernetes", "Terraform", "Pulumi"] },
  { category: "Backend",       items: ["Node.js", "gRPC", "GraphQL", "PostgreSQL", "Redis"] },
  { category: "Observability", items: ["Prometheus", "Grafana", "OpenTelemetry", "Jaeger"] },
  { category: "DevOps",        items: ["GitHub Actions", "ArgoCD", "Helm", "Docker"] },
];

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-12">

      {/* ─── Header ───────────────────────────────────────────────── */}
      <section className="space-y-3">
        <SectionLabel>connect / metadata — system_identity</SectionLabel>
        <h1 className="text-2xl sm:text-3xl font-bold font-sans text-white">
          {siteConfig.name}
        </h1>
        <div className="flex items-center gap-2">
          <StatusDot status="online" animate label="online" />
          <span className="text-[10px] font-mono text-[#494847]">|</span>
          <span className="text-[10px] font-mono text-[#adaaaa]">{siteConfig.role}</span>
        </div>
      </section>

      {/* ─── man(1) page style bio ─────────────────────────────────── */}
      <TerminalWindow title={`man ${siteConfig.handle}`}>
        <div className="p-6 font-mono text-sm space-y-6">
          <div>
            <p className="text-[#55fe7e] text-[11px] tracking-widest uppercase mb-2">NAME</p>
            <p className="text-[#adaaaa]">
              <span className="text-white">{siteConfig.handle}</span> — {siteConfig.role}
            </p>
          </div>

          <div>
            <p className="text-[#55fe7e] text-[11px] tracking-widest uppercase mb-2">SYNOPSIS</p>
            <p className="text-[#adaaaa]">
              <span className="text-white">{siteConfig.handle}</span>{" "}
              <span className="text-[#85ecff]">[--build-systems]</span>{" "}
              <span className="text-[#85ecff]">[--ship-fast]</span>{" "}
              <span className="text-[#85ecff]">[--scale-infra]</span>
            </p>
          </div>

          <div>
            <p className="text-[#55fe7e] text-[11px] tracking-widest uppercase mb-2">DESCRIPTION</p>
            <p className="text-[#adaaaa] leading-7 max-w-prose">
              Principal Backend Engineer and Cloud Architect with deep expertise in distributed systems,
              cloud-native infrastructure, and developer tooling. I design and operate systems at scale,
              contribute to open source, and write about engineering challenges that matter.
            </p>
          </div>

          <div>
            <p className="text-[#55fe7e] text-[11px] tracking-widest uppercase mb-2">OPTIONS</p>
            <div className="space-y-2 text-[#adaaaa]">
              <p>
                <span className="text-[#85ecff]">--distributed</span>
                {"  "}Design and operate distributed systems at scale
              </p>
              <p>
                <span className="text-[#85ecff]">--cloud-native</span>
                {"  "}Kubernetes, service mesh, and cloud infrastructure
              </p>
              <p>
                <span className="text-[#85ecff]">--open-source</span>
                {"  "}Active contributor to OSS projects
              </p>
              <p>
                <span className="text-[#85ecff]">--mentorship</span>
                {"  "}Enjoy growing engineering teams and sharing knowledge
              </p>
            </div>
          </div>

          <div>
            <p className="text-[#55fe7e] text-[11px] tracking-widest uppercase mb-2">EXIT STATUS</p>
            <p className="text-[#adaaaa]">
              Returns <span className="text-[#55fe7e]">0</span> on successful collaboration.
            </p>
          </div>
        </div>
      </TerminalWindow>

      {/* ─── Skills stdout ─────────────────────────────────────────── */}
      <section className="space-y-4">
        <SectionLabel>stdout — skills.list</SectionLabel>

        <StaggerReveal className="space-y-3">
          {skills.map((group) => (
            <div key={group.category} className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4">
              <span className="text-[10px] font-mono text-[#494847] w-28 flex-shrink-0 uppercase tracking-widest pt-0.5">
                {group.category}
              </span>
              <div className="flex flex-wrap gap-1.5">
                {group.items.map((skill) => (
                  <Tag key={skill} variant="tertiary">
                    {skill}
                  </Tag>
                ))}
              </div>
            </div>
          ))}
        </StaggerReveal>
      </section>

      {/* ─── Social Links ──────────────────────────────────────────── */}
      <section className="space-y-4">
        <SectionLabel>contact / socials</SectionLabel>

        <div className="flex flex-col gap-2">
          {Object.entries(siteConfig.socials).map(([platform, url]) => (
            <Link
              key={platform}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-mono text-[#adaaaa] hover:text-[#85ecff] transition-colors group"
            >
              <span className="text-[#494847] group-hover:text-[#85ecff] transition-colors">&gt;</span>
              <span className="uppercase tracking-widest text-[11px]">{platform}</span>
              <span className="text-[#494847] text-[10px] truncate">{url}</span>
            </Link>
          ))}
          <Link
            href={`mailto:hello@${siteConfig.url.replace("https://", "")}`}
            className="inline-flex items-center gap-2 text-sm font-mono text-[#adaaaa] hover:text-[#55fe7e] transition-colors group"
          >
            <span className="text-[#494847] group-hover:text-[#55fe7e] transition-colors">&gt;</span>
            <span className="uppercase tracking-widest text-[11px]">email</span>
          </Link>
        </div>
      </section>

    </div>
  );
}
