import type { Metadata } from "next";
import { fetchProjects } from "@/lib/notion";
import { ProjectGrid } from "@/components/projects/project-grid";
import { SectionLabel } from "@/components/ui/section-label";
import { TerminalWindow } from "@/components/ui/terminal-window";
import { StatusDot } from "@/components/ui/status-dot";

export const metadata: Metadata = {
  title: "REGISTRY // Technical Manifest",
  description: "Projects and open source work — infrastructure, systems, and tooling.",
};

export default async function ProjectsPage() {
  const projects = await fetchProjects();
  const online = projects.filter((p) => p.status === "online").length;
  const featured = projects.filter((p) => p.featured).length;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 space-y-10">

      {/* ─── Header ───────────────────────────────────────────────── */}
      <section className="space-y-3">
        <SectionLabel>registry / technical_manifest</SectionLabel>
        <h1 className="text-2xl sm:text-3xl font-bold font-sans text-white">
          Technical Manifest
        </h1>

        <TerminalWindow title="registry — status">
          <div className="p-3 font-mono text-[10px] flex flex-wrap gap-6 text-[#adaaaa]">
            <span>total: <span className="text-white">{projects.length}</span></span>
            <span className="flex items-center gap-1.5">
              <StatusDot status="online" animate />
              <span>online: <span className="text-[#55fe7e]">{online}</span></span>
            </span>
            <span>featured: <span className="text-[#5db4fe]">{featured}</span></span>
          </div>
        </TerminalWindow>
      </section>

      {/* ─── Project Grid ─────────────────────────────────────────── */}
      <ProjectGrid projects={projects} />

    </div>
  );
}
