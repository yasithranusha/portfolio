import type { Metadata } from "next";
import { fetchProjects } from "@/lib/notion";
import Link from "next/link";

export const metadata: Metadata = {
  title: "REGISTRY // Technical Manifest",
  description: "Deployed systems, open source nodes, and infrastructure projects.",
};

const statusStyles = {
  online:  { badge: "bg-primary/5 border-primary/20 text-primary",   label: "STABLE",      hover: "group-hover:opacity-100 bg-primary" },
  warn:    { badge: "bg-tertiary/5 border-tertiary/20 text-tertiary", label: "COMPUTING",   hover: "group-hover:opacity-100 bg-tertiary" },
  offline: { badge: "bg-error/5 border-error/20 text-error",         label: "MAINTENANCE", hover: "group-hover:opacity-100 bg-error" },
};

export default async function ProjectsPage() {
  const projects = await fetchProjects();
  const online  = projects.filter((p) => p.status === "online").length;
  const avgLatency = "14ms";

  return (
    <div className="mt-12 mb-10 p-8 min-h-screen">
      <div className="max-w-7xl mx-auto">

        {/* ─── Breadcrumb / Header ────────────────────────────────── */}
        <div className="mb-12">
          <div className="flex items-center gap-2 text-[10px] font-bold text-primary mb-2 opacity-80">
            <span className="bg-primary/10 px-2 py-0.5">AUTH: ROOT</span>
            <span className="opacity-30">/</span>
            <span className="bg-[#262626] px-2 py-0.5">STATUS: SYSTEM_READY</span>
          </div>
          <h1 className="font-sans text-5xl md:text-7xl font-bold tracking-tighter text-white mb-4">
            DEPLOYED_SYSTEMS /{" "}
            <span className="text-primary/40">NODES</span>
          </h1>
          <div className="h-1 w-24 bg-primary" />
        </div>

        {/* ─── Dashboard Stats Strip ──────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-surface-container-low p-4 border-l border-primary">
            <div className="text-[10px] text-on-surface-variant mb-1">TOTAL_UPTIME</div>
            <div className="font-sans text-2xl font-bold">99.999%</div>
          </div>
          <div className="bg-surface-container-low p-4 border-l border-tertiary">
            <div className="text-[10px] text-on-surface-variant mb-1">ACTIVE_NODES</div>
            <div className="font-sans text-2xl font-bold">{online}</div>
          </div>
          <div className="bg-surface-container-low p-4 border-l border-secondary">
            <div className="text-[10px] text-on-surface-variant mb-1">NETWORK_LATENCY</div>
            <div className="font-sans text-2xl font-bold">{avgLatency}</div>
          </div>
          <div className="bg-surface-container-low p-4 border-l border-error">
            <div className="text-[10px] text-on-surface-variant mb-1">THREAT_LEVEL</div>
            <div className="font-sans text-2xl font-bold">MINIMAL</div>
          </div>
        </div>

        {/* ─── Project Cards Grid ─────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {projects.length === 0 ? <FallbackCards /> : projects.map((project, i) => {
            const status = statusStyles[project.status] ?? statusStyles.online;
            const accentColors = ["bg-primary", "bg-tertiary", "bg-secondary", "bg-error"];
            const accent = accentColors[i % accentColors.length];
            return (
              <div key={project.id} className="bg-surface-container-low group relative overflow-hidden transition-colors hover:bg-[#181818]">
                {/* Hover accent strip */}
                <div className={`absolute top-0 left-0 w-1 h-full ${accent} opacity-0 group-hover:opacity-100 transition-opacity`} />

                {/* Terminal header */}
                <div className="h-8 bg-surface-container-high px-4 flex items-center justify-between border-b border-[#494847]/10">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-error/50" />
                    <div className="w-2.5 h-2.5 rounded-full bg-secondary/50" />
                    <div className="w-2.5 h-2.5 rounded-full bg-primary/50" />
                  </div>
                  <div className="text-[10px] font-bold text-on-surface-variant/50 tracking-widest">
                    NODE_SPEC_{String(i + 1).padStart(3, "0")}
                  </div>
                </div>

                {/* Card body */}
                <div className="p-6">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h3 className="font-sans text-2xl font-bold mb-1 uppercase">
                        {project.title}
                      </h3>
                      <p className="text-[10px] text-primary/60 font-bold">
                        $ node_id: 0x{project.id.slice(0, 4).toUpperCase()}-ALPHA
                      </p>
                    </div>
                    <div className={`px-2 py-1 border text-[10px] font-bold ${status.badge}`}>
                      {status.label}
                    </div>
                  </div>

                  {/* Data table */}
                  <div className="space-y-3 mb-8">
                    {project.tags.length > 0 && (
                      <div className="grid grid-cols-3 text-[10px] py-2 border-b border-[#494847]/10">
                        <span className="text-on-surface-variant">STACK</span>
                        <span className="col-span-2 font-bold text-tertiary tracking-wider">
                          {project.tags.join(" / ")}
                        </span>
                      </div>
                    )}
                    <div className="grid grid-cols-3 text-[10px] py-2 border-b border-[#494847]/10">
                      <span className="text-on-surface-variant">STATUS</span>
                      <span className="col-span-2 font-bold text-white tracking-wider uppercase">
                        {project.status}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 text-[10px] py-2">
                      <span className="text-on-surface-variant">MISSION_OBJ</span>
                      <span className="col-span-2 text-on-surface-variant leading-relaxed italic">
                        {project.description || "—"}
                      </span>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex gap-3">
                    {project.github && (
                      <Link
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 bg-[#262626] border border-[#494847]/20 py-2 text-[10px] font-bold text-primary hover:bg-primary hover:text-on-primary transition-colors text-center"
                      >
                        ./view_source
                      </Link>
                    )}
                    {project.live && (
                      <Link
                        href={project.live}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 bg-[#262626] border border-[#494847]/20 py-2 text-[10px] font-bold text-secondary hover:border-secondary transition-colors text-center"
                      >
                        ssh connect --root
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

        </div>
      </div>
    </div>
  );
}

function FallbackCards() {
  const nodes = [
    { id: "0x8892", title: "OBLIVION_CORE",  label: "STABLE",      badge: "bg-primary/5 border-primary/20 text-primary",   stack: "K8S / AWS_US_EAST_1", runtime: "GO_1.21 / GOMOD", mission: "DISTRIBUTED_LEDGER_ORCHESTRATION_AND_FAULT_TOLERANT_INDEXING.", accent: "bg-primary" },
    { id: "0x2210", title: "NEURAL_PIPE",    label: "COMPUTING",   badge: "bg-tertiary/5 border-tertiary/20 text-tertiary", stack: "BARE_METAL / NVIDIA_H100", runtime: "RUST_NIGHTLY / CUDA", mission: "LOW_LATENCY_INFERENCE_ENGINE_FOR_AUTONOMOUS_NETWORK_TRAFFIC_SHAPING.", accent: "bg-tertiary" },
    { id: "0xFA44", title: "GHOST_DB",       label: "MAINTENANCE", badge: "bg-error/5 border-error/20 text-error",           stack: "HYBRID / POSTGRES_CLUSTER", runtime: "ELIXIR_BEAM / OTP", mission: "REAL-TIME_STATE_SYNCHRONIZATION_ACROSS_GEOGRAPHICALLY_ISOLATED_NODES.", accent: "bg-secondary" },
  ];
  return (
    <>
      {nodes.map((n, i) => (
        <div key={n.id} className="bg-surface-container-low group relative overflow-hidden transition-colors hover:bg-[#181818]">
          <div className={`absolute top-0 left-0 w-1 h-full ${n.accent} opacity-0 group-hover:opacity-100 transition-opacity`} />
          <div className="h-8 bg-surface-container-high px-4 flex items-center justify-between border-b border-[#494847]/10">
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-error/50" />
              <div className="w-2.5 h-2.5 rounded-full bg-secondary/50" />
              <div className="w-2.5 h-2.5 rounded-full bg-primary/50" />
            </div>
            <div className="text-[10px] font-bold text-on-surface-variant/50 tracking-widest">
              NODE_SPEC_{String(i + 1).padStart(3, "0")}
            </div>
          </div>
          <div className="p-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="font-sans text-2xl font-bold mb-1">{n.title}</h3>
                <p className="text-[10px] text-primary/60 font-bold">$ node_id: {n.id}-ALPHA</p>
              </div>
              <div className={`px-2 py-1 border text-[10px] font-bold ${n.badge}`}>{n.label}</div>
            </div>
            <div className="space-y-3 mb-8">
              <div className="grid grid-cols-3 text-[10px] py-2 border-b border-[#494847]/10">
                <span className="text-on-surface-variant">ARCHITECTURE</span>
                <span className="col-span-2 font-bold text-white tracking-wider">{n.stack}</span>
              </div>
              <div className="grid grid-cols-3 text-[10px] py-2 border-b border-[#494847]/10">
                <span className="text-on-surface-variant">RUNTIME</span>
                <span className="col-span-2 font-bold text-tertiary tracking-wider">{n.runtime}</span>
              </div>
              <div className="grid grid-cols-3 text-[10px] py-2">
                <span className="text-on-surface-variant">MISSION_OBJ</span>
                <span className="col-span-2 text-on-surface-variant leading-relaxed italic">{n.mission}</span>
              </div>
            </div>
            <div className="flex gap-3">
              <button className="flex-1 bg-[#262626] border border-[#494847]/20 py-2 text-[10px] font-bold text-primary hover:bg-primary hover:text-on-primary transition-colors">./view_source</button>
              <button className="flex-1 bg-[#262626] border border-[#494847]/20 py-2 text-[10px] font-bold text-secondary hover:border-secondary transition-colors">ssh connect --root</button>
            </div>
          </div>
        </div>
      ))}
    </>
  );
}
