import { siteConfig } from "@/config/site";
import { fetchPosts, fetchProjects } from "@/lib/notion";
import { TypingText } from "@/components/motion/typing-text";
import { StaggerReveal } from "@/components/motion/stagger-reveal";
import { SectionLabel } from "@/components/ui/section-label";
import { TerminalWindow } from "@/components/ui/terminal-window";
import { PostCard } from "@/components/blog/post-card";
import { ProjectCard } from "@/components/projects/project-card";
import Link from "next/link";

export default async function HomePage() {
  const [posts, projects] = await Promise.all([
    fetchPosts(),
    fetchProjects(),
  ]);

  const featuredPosts = posts.filter((p) => p.featured).slice(0, 3);
  const recentPosts = featuredPosts.length ? featuredPosts : posts.slice(0, 3);
  const featuredProjects = projects.filter((p) => p.featured).slice(0, 3);
  const displayProjects = featuredProjects.length ? featuredProjects : projects.slice(0, 3);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 space-y-20">

      {/* ─── Hero ─────────────────────────────────────────────────── */}
      <section className="pt-8 space-y-6">
        <SectionLabel>system.boot</SectionLabel>

        <div className="space-y-2">
          <p className="text-[10px] font-mono text-[#494847] tracking-widest">
            KERNEL_CONSOLE v2.0.4 — {siteConfig.role}
          </p>
          <h1 className="text-3xl sm:text-5xl font-bold font-sans text-white leading-tight">
            {siteConfig.name}
          </h1>
          <p className="text-sm font-mono text-[#adaaaa] mt-1">{siteConfig.role}</p>
        </div>

        <TerminalWindow title="terminal — bash" className="max-w-2xl">
          <div className="p-4">
            <TypingText lines={siteConfig.tagline} speed={45} prefix="$" />
          </div>
        </TerminalWindow>

        <div className="flex items-center gap-4">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-sm font-mono text-[#55fe7e] border border-[#55fe7e]/30 px-4 py-2 hover:bg-[#55fe7e]/5 transition-colors"
          >
            &gt; View Projects
          </Link>
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm font-mono text-[#adaaaa] hover:text-[#5db4fe] transition-colors"
          >
            &gt; Read Blog
          </Link>
        </div>
      </section>

      {/* ─── Latest Log Entries ───────────────────────────────────── */}
      {recentPosts.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <SectionLabel>latest_log_entries</SectionLabel>
            <Link
              href="/blog"
              className="text-[10px] font-mono text-[#adaaaa] hover:text-[#5db4fe] transition-colors tracking-widest"
            >
              ls -la /blog →
            </Link>
          </div>

          <StaggerReveal className="border border-[#494847]/20">
            {recentPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </StaggerReveal>
        </section>
      )}

      {/* ─── Featured Projects ─────────────────────────────────────── */}
      {displayProjects.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <SectionLabel>featured_nodes</SectionLabel>
            <Link
              href="/projects"
              className="text-[10px] font-mono text-[#adaaaa] hover:text-[#5db4fe] transition-colors tracking-widest"
            >
              cat /registry →
            </Link>
          </div>

          <StaggerReveal className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {displayProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </StaggerReveal>
        </section>
      )}

      {/* ─── System Diagnostics ───────────────────────────────────── */}
      <section className="space-y-4">
        <SectionLabel>sys.diagnostics</SectionLabel>

        <TerminalWindow title="htop — system monitor">
          <div className="p-4 font-mono text-[11px] space-y-1 text-[#adaaaa]">
            <p><span className="text-[#55fe7e]">CPU</span>  [████████░░░░░░░░]  52% — Distributed Systems</p>
            <p><span className="text-[#5db4fe]">MEM</span>  [███████████░░░░░]  71% — Cloud Architecture</p>
            <p><span className="text-[#85ecff]">NET</span>  [████████████████] 100% — Open Source</p>
            <p><span className="text-[#adaaaa]">DSK</span>  [████░░░░░░░░░░░░]  24% — DevOps & SRE</p>
            <div className="pt-2 border-t border-[#494847]/20 text-[#494847]">
              uptime: ∞ &nbsp;|&nbsp; load: stable &nbsp;|&nbsp; status: <span className="text-[#55fe7e]">online</span>
            </div>
          </div>
        </TerminalWindow>
      </section>

    </div>
  );
}
