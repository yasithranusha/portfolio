import type { Metadata } from "next";
import { fetchProjects } from "@/lib/notion";
import { siteConfig } from "@/config/site";
import { ProjectGrid } from "@/components/projects/project-grid";

export const metadata: Metadata = {
  title:       siteConfig.pages.projects.title,
  description: siteConfig.pages.projects.description,
  alternates:  { canonical: `${siteConfig.url}projects` },
};

export default async function ProjectsPage() {
  const projects = await fetchProjects();
  const online  = projects.filter((p) => p.status === "online").length;
  return (
    <div className="flex flex-col gap-12">
        {/* ─── Breadcrumb / Header ────────────────────────────────── */}
        <div className="mb-12">
          <div className="flex items-center gap-2 text-[10px] font-bold text-primary mb-2 opacity-80">
            <span className="bg-primary/10 px-2 py-0.5">AUTH: ROOT</span>
            <span className="opacity-30">/</span>
            <span className="bg-[#262626] px-2 py-0.5">STATUS: SYSTEM_READY</span>
          </div>
          <h1 className="font-sans text-3xl sm:text-5xl md:text-7xl font-bold tracking-tighter text-white mb-4">
            DEPLOYED_SYSTEMS /{" "}
            <span className="text-primary/40">NODES</span>
          </h1>
          <div className="h-1 w-24 bg-primary" />
        </div>

        {/* ─── Dashboard Stats Strip ──────────────────────────────── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-surface-container-low p-4 border-l border-primary">
            <div className="text-[10px] text-on-surface-variant mb-1">TOTAL_UPTIME</div>
            <div className="font-sans text-2xl font-bold">{siteConfig.stats.uptime}</div>
          </div>
          <div className="bg-surface-container-low p-4 border-l border-tertiary">
            <div className="text-[10px] text-on-surface-variant mb-1">ACTIVE_NODES</div>
            <div className="font-sans text-2xl font-bold">{online}</div>
          </div>
          <div className="bg-surface-container-low p-4 border-l border-secondary">
            <div className="text-[10px] text-on-surface-variant mb-1">NETWORK_LATENCY</div>
            <div className="font-sans text-2xl font-bold">{siteConfig.stats.latency}</div>
          </div>
          <div className="bg-surface-container-low p-4 border-l border-error">
            <div className="text-[10px] text-on-surface-variant mb-1">THREAT_LEVEL</div>
            <div className="font-sans text-2xl font-bold text-error">{siteConfig.stats.threatLevel}</div>
          </div>
        </div>

        {/* ─── Project Cards Grid ─────────────────────────────────── */}
        <ProjectGrid projects={projects} />

    </div>
  );
}
