import { siteConfig } from "@/config/site";
import { fetchPosts, fetchProjects } from "@/lib/notion";
import Link from "next/link";
import { InteractiveTerminal } from "@/components/ui/interactive-terminal";

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
      <div className="grid grid-cols-1 md:grid-cols-12 md:[grid-template-rows:520px_auto] gap-6">

        {/* Interactive Terminal — 8 cols, stretches to match vitals row height */}
        <InteractiveTerminal
          title={`MAN(1) // ${siteConfig.name.toUpperCase().replace(" ", "_")}`}
          initialCommands={["ls -la", "./yasith.sh"]}
          posts={posts}
          className="md:col-span-8 h-[280px] md:h-full md:min-h-0"
        />

        {/* Vitals Column — 4 cols */}
        <div className="md:col-span-4 flex flex-col gap-6 md:h-full">
          {/* Coffee level */}
          <div className="bg-surface-container-low p-6 flex flex-col justify-between border-b border-primary/30 flex-1">
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
          <div className="bg-surface-container-low p-6 flex flex-col justify-between border-b border-tertiary/30 flex-1">
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
          <div className="bg-surface-container-low p-6 flex flex-col justify-between border-b border-error/30 flex-1">
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
