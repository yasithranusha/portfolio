import { siteConfig } from "@/config/site";
import { fetchPosts, fetchProjects } from "@/lib/notion";
import Link from "next/link";

export default async function HomePage() {
  const [posts, projects] = await Promise.all([fetchPosts(), fetchProjects()]);
  const recentPosts = posts.slice(0, 3);

  return (
    <div className="pt-8 pb-24 px-6 md:px-12 min-h-screen">

      {/* ─── Hero Header ──────────────────────────────────────────── */}
      <div className="mb-12 border-l-4 border-primary pl-6">
        <div className="flex items-center gap-2 text-primary text-xs font-bold mb-2">
          <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
          SYSTEM_BOOT_SEQUENCE_COMPLETE
        </div>
        <h1 className="font-sans text-5xl md:text-7xl font-bold tracking-tighter text-white uppercase">
          {siteConfig.handle}_Ranusha
          <span className="text-primary">.sh</span>
        </h1>
      </div>

      {/* ─── Bento Grid ───────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">

        {/* Man Page Terminal — 8 cols */}
        <section className="md:col-span-8 bg-surface-container-low border border-[#494847]/10 relative overflow-hidden">
          {/* Terminal header */}
          <div className="h-8 bg-[#262626] flex items-center px-4 justify-between">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 bg-error rounded-full opacity-50" />
              <div className="w-3 h-3 bg-tertiary rounded-full opacity-50" />
              <div className="w-3 h-3 bg-primary rounded-full opacity-50" />
            </div>
            <span className="text-[10px] text-on-surface-variant font-bold">
              MAN(1) // {siteConfig.name.toUpperCase().replace(" ", "_")}
            </span>
          </div>

          {/* Man page content */}
          <div className="p-8 font-mono text-sm leading-relaxed">
            <div className="mb-6">
              <span className="text-primary font-bold">NAME</span>
              <div className="pl-8 text-on-surface mt-1">
                {siteConfig.handle} — {siteConfig.role}
              </div>
            </div>
            <div className="mb-6">
              <span className="text-primary font-bold">SYNOPSIS</span>
              <div className="pl-8 text-on-surface mt-1">
                {siteConfig.handle}{" "}
                <span className="text-tertiary">[--lang=go|ts]</span>{" "}
                <span className="text-tertiary">[--env=k8s|aws]</span>{" "}
                <span className="text-tertiary">[--mode=cloud-native]</span>
              </div>
            </div>
            <div className="mb-6">
              <span className="text-primary font-bold">DESCRIPTION</span>
              <div className="pl-8 text-on-surface-variant mt-1 max-w-xl leading-7">
                {siteConfig.description}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 pl-8 border-l border-primary/20 mt-8 py-4">
              <div>
                <span className="text-tertiary block text-[10px] font-bold mb-2">ARGUMENTS</span>
                <ul className="text-on-surface-variant text-xs space-y-1">
                  <li>-D Distributed_Systems</li>
                  <li>-e Event_Driven</li>
                  <li>-k K8s_Native</li>
                </ul>
              </div>
              <div>
                <span className="text-tertiary block text-[10px] font-bold mb-2">EXIT STATUS</span>
                <p className="text-on-surface-variant text-xs">
                  0 on successful deployment.<br />1 on kernel panic (rare).
                </p>
              </div>
            </div>
            {/* Blinking cursor */}
            <div className="mt-8 flex items-center gap-2">
              <span className="text-primary">$</span>
              <span className="w-2 h-5 bg-primary animate-pulse inline-block" />
            </div>
          </div>
        </section>

        {/* Vitals Column — 4 cols */}
        <div className="md:col-span-4 flex flex-col gap-6">
          {/* Coffee level */}
          <div className="bg-surface-container-low p-6 flex flex-col justify-between border-b border-primary/30">
            <div className="flex justify-between items-start">
              <span className="text-[10px] font-bold text-on-surface-variant">VITALS::COFFEE_LEVEL</span>
              <span className="material-symbols-outlined text-primary text-xl">coffee</span>
            </div>
            <div className="mt-8">
              <div className="flex justify-between mb-2 text-xs font-bold">
                <span>CAFFEINE_SATURATION</span>
                <span className="text-primary">82%</span>
              </div>
              <div className="w-full h-1.5 bg-[#262626]">
                <div className="bg-primary h-full" style={{ width: "82%" }} />
              </div>
              <p className="text-[10px] text-on-surface-variant mt-2 italic">
                Status: Operating within nominal parameters.
              </p>
            </div>
          </div>

          {/* Uptime */}
          <div className="bg-surface-container-low p-6 flex flex-col justify-between border-b border-tertiary/30">
            <div className="flex justify-between items-start">
              <span className="text-[10px] font-bold text-on-surface-variant">EXPERIENCE::UPTIME</span>
              <span className="material-symbols-outlined text-tertiary text-xl">schedule</span>
            </div>
            <div className="mt-4">
              <div className="font-sans text-3xl font-bold text-on-surface">
                3,285<span className="text-xs text-tertiary ml-1">DAYS</span>
              </div>
              <p className="text-[10px] text-on-surface-variant mt-1">
                Total operational time in production environments.
              </p>
            </div>
          </div>

          {/* Kernel panics */}
          <div className="bg-surface-container-low p-6 flex flex-col justify-between border-b border-error/30">
            <div className="flex justify-between items-start">
              <span className="text-[10px] font-bold text-on-surface-variant">STRESS::KERNEL_PANICS</span>
              <span className="material-symbols-outlined text-error text-xl">dangerous</span>
            </div>
            <div className="mt-4">
              <div className="font-sans text-3xl font-bold text-on-surface">004</div>
              <p className="text-[10px] text-on-surface-variant mt-1">
                Total mental reboots required this fiscal quarter.
              </p>
            </div>
          </div>
        </div>

        {/* ─── Latest Log Entries ─────────────────────────────────── */}
        <section className="md:col-span-12 mt-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <h2 className="font-sans text-2xl font-bold uppercase tracking-tighter">
                Latest_Log_Entries
              </h2>
              <div className="h-px w-32 bg-[#494847]/30 hidden md:block" />
            </div>
            <Link
              href="/blog"
              className="text-[10px] font-bold text-primary cursor-pointer hover:underline"
            >
              TAIL -F ALL_POSTS
            </Link>
          </div>

          <div className="space-y-4">
            {recentPosts.length === 0 ? (
              <FallbackLogEntries />
            ) : (
              recentPosts.map((post, i) => {
                const levels = ["INFO", "DEBUG", "FATAL"] as const;
                const levelColors = {
                  INFO:  { badge: "bg-primary/10 text-primary",   border: "hover:border-primary",   title: "group-hover:text-primary" },
                  DEBUG: { badge: "bg-tertiary/10 text-tertiary",  border: "hover:border-tertiary",  title: "group-hover:text-tertiary" },
                  FATAL: { badge: "bg-error/10 text-error",        border: "hover:border-error",     title: "group-hover:text-error" },
                };
                const level = levels[i % 3];
                const colors = levelColors[level];
                return (
                  <Link
                    key={post.id}
                    href={`/blog/${post.slug}`}
                    className={`group flex flex-col md:flex-row md:items-center gap-4 bg-surface-container-low p-4 hover:bg-[#262626] transition-colors cursor-pointer border-l-2 border-transparent ${colors.border}`}
                  >
                    <div className="text-[10px] text-on-surface-variant font-mono min-w-[140px]">
                      [{post.date ? new Date(post.date).toISOString().replace("T", " ").slice(0, 16) : "----"}]
                    </div>
                    <div className={`px-2 py-0.5 text-[10px] font-bold w-fit ${colors.badge}`}>
                      {level}
                    </div>
                    <div className="flex-1">
                      <h3 className={`text-sm font-bold text-on-surface uppercase transition-colors ${colors.title}`}>
                        {post.title}
                      </h3>
                      {post.excerpt && (
                        <p className="text-xs text-on-surface-variant mt-1 line-clamp-1">{post.excerpt}</p>
                      )}
                    </div>
                    <span className="material-symbols-outlined text-on-surface-variant group-hover:translate-x-1 transition-transform text-sm">
                      chevron_right
                    </span>
                  </Link>
                );
              })
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

function FallbackLogEntries() {
  const entries = [
    { level: "INFO",  color: "bg-primary/10 text-primary",   border: "hover:border-primary",   title: "group-hover:text-primary",   date: "[2024-05-12 09:42]", text: "Optimizing Garbage Collection in High-Throughput Rust Services" },
    { level: "DEBUG", color: "bg-tertiary/10 text-tertiary",  border: "hover:border-tertiary",  title: "group-hover:text-tertiary",  date: "[2024-04-28 23:15]", text: "Ghost in the Shell: Debugging Mystery Latency Spikes in K8s" },
    { level: "FATAL", color: "bg-error/10 text-error",        border: "hover:border-error",     title: "group-hover:text-error",     date: "[2024-04-15 02:04]", text: "Post-Mortem: Why the Load Balancer Hates Your JSON" },
  ];
  return (
    <>
      {entries.map((e) => (
        <div
          key={e.text}
          className={`group flex flex-col md:flex-row md:items-center gap-4 bg-surface-container-low p-4 hover:bg-[#262626] transition-colors cursor-pointer border-l-2 border-transparent ${e.border}`}
        >
          <div className="text-[10px] text-on-surface-variant font-mono min-w-[140px]">{e.date}</div>
          <div className={`px-2 py-0.5 text-[10px] font-bold w-fit ${e.color}`}>{e.level}</div>
          <div className="flex-1">
            <h3 className={`text-sm font-bold text-on-surface uppercase transition-colors ${e.title}`}>{e.text}</h3>
          </div>
          <span className="material-symbols-outlined text-on-surface-variant group-hover:translate-x-1 transition-transform text-sm">chevron_right</span>
        </div>
      ))}
    </>
  );
}
