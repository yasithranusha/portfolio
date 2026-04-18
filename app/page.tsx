import { siteConfig } from "@/config/site";
import { fetchPosts, fetchProjects } from "@/lib/notion";
import Link from "next/link";
import { InteractiveTerminal } from "@/components/ui/interactive-terminal";
import { MotionDiv, MotionSpan } from "@/components/ui/motion";

export default async function HomePage() {
  const [posts, projects] = await Promise.all([fetchPosts(), fetchProjects()]);
  const recentPosts = posts.slice(0, 3);

  return (
    <div className="pt-8 pb-24 px-6 md:px-12 min-h-screen">

      {/* ─── Hero Header ──────────────────────────────────────────── */}
      <MotionDiv 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="mb-12 border-l-4 border-primary pl-6"
      >
        <div className="flex items-center gap-2 text-primary text-xs font-bold mb-2">
          <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
          SYSTEM_BOOT_SEQUENCE_COMPLETE
        </div>
        <h1 className="font-sans text-4xl sm:text-5xl md:text-7xl font-bold tracking-tighter text-white uppercase flex flex-wrap items-center">
          <span className="inline-block">
            {siteConfig.handle}_Ranusha
          </span>
          <span className="text-primary">.sh</span>
        </h1>
      </MotionDiv>

      {/* ─── Bento Grid ───────────────────────────────────────────── */}
      <MotionDiv 
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } }
        }}
        className="grid grid-cols-1 md:grid-cols-12 md:[grid-template-rows:520px_auto] gap-6"
      >

        {/* Interactive Terminal — 8 cols, stretches to match vitals row height */}
        <MotionDiv variants={{ hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0 } }} className="md:col-span-8 h-[280px] md:h-full md:min-h-0">
          <InteractiveTerminal
            title={`MAN(1) // ${siteConfig.name.toUpperCase().replace(" ", "_")}`}
            initialCommands={["ls -la", "./yasith.sh"]}
            posts={posts}
            className="h-full"
          />
        </MotionDiv>

        {/* Vitals Column — 4 cols */}
        <div className="md:col-span-4 flex flex-col gap-6 md:h-full">
          {/* Tech Stack */}
          <MotionDiv 
            variants={{ hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0 } }}
            className="bg-surface-container-low p-6 flex flex-col justify-between border-b border-primary/30 flex-1 transition-colors hover:bg-[#181818]"
          >
            <div className="flex justify-between items-start">
              <span className="text-[10px] font-bold text-on-surface-variant">CORE::TECH_STACK</span>
              <span className="material-symbols-outlined text-primary text-xl">terminal</span>
            </div>
            <div className="mt-8">
              <div className="flex flex-wrap gap-2 mb-2">
                <span className="px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-bold">Java (Spring)</span>
                <span className="px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-bold">React.js</span>
                <span className="px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-bold">Node.js</span>
                <span className="px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-bold">TypeScript</span>
              </div>
              <p className="text-[10px] text-on-surface-variant mt-2 italic">
                Status: Cloud-native full-stack engineering.
              </p>
            </div>
          </MotionDiv>

          {/* Experience */}
          <MotionDiv 
            variants={{ hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0 } }}
            className="bg-surface-container-low p-6 flex flex-col justify-between border-b border-tertiary/30 flex-1 transition-colors hover:bg-[#181818]"
          >
            <div className="flex justify-between items-start">
              <span className="text-[10px] font-bold text-on-surface-variant">RUNTIME::EXPERIENCE</span>
              <span className="material-symbols-outlined text-tertiary text-xl">work</span>
            </div>
            <div className="mt-4">
              <div className="font-sans text-3xl font-bold text-on-surface">
                2<span className="text-xs text-tertiary ml-1">YEARS</span>
              </div>
              <p className="text-[10px] text-on-surface-variant mt-1">
                Production architecture & distributed systems.
              </p>
            </div>
          </MotionDiv>

          {/* Cloud Infrastructure */}
          <MotionDiv 
            variants={{ hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0 } }}
            className="bg-surface-container-low p-6 flex flex-col justify-between border-b border-error/30 flex-1 transition-colors hover:bg-[#181818]"
          >
            <div className="flex justify-between items-start">
              <span className="text-[10px] font-bold text-on-surface-variant">CLOUD::INFRASTRUCTURE</span>
              <span className="material-symbols-outlined text-error text-xl">cloud</span>
            </div>
            <div className="mt-4">
              <div className="flex flex-wrap gap-2 mb-2">
                <span className="px-2 py-0.5 bg-error/10 text-error text-[10px] font-bold">AWS & Azure</span>
                <span className="px-2 py-0.5 bg-error/10 text-error text-[10px] font-bold">Docker / K8s</span>
                <span className="px-2 py-0.5 bg-error/10 text-error text-[10px] font-bold">CI/CD</span>
              </div>
              <p className="text-[10px] text-on-surface-variant mt-1">
                Cloud-native deployments & orchestration.
              </p>
            </div>
          </MotionDiv>
        </div>

        {/* ─── Latest Log Entries ─────────────────────────────────── */}
        <MotionDiv 
          variants={{ hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0 } }}
          className="md:col-span-12 mt-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <h2 className="font-sans text-2xl font-bold uppercase tracking-tighter">
                DEVELOPER_LOGS
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
                const levels = ["ARCHITECTURE", "BACKEND", "FRONTEND"] as const;
                const levelColors = {
                  ARCHITECTURE:  { badge: "bg-primary/10 text-primary",   border: "hover:border-primary",   title: "group-hover:text-primary" },
                  BACKEND: { badge: "bg-tertiary/10 text-tertiary",  border: "hover:border-tertiary",  title: "group-hover:text-tertiary" },
                  FRONTEND: { badge: "bg-error/10 text-error",        border: "hover:border-error",     title: "group-hover:text-error" },
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
        </MotionDiv>
      </MotionDiv>
    </div>
  );
}

function FallbackLogEntries() {
  const entries = [
    { level: "ARCHITECTURE",  color: "bg-primary/10 text-primary",   border: "hover:border-primary",   title: "group-hover:text-primary",   date: "[2024-05-12 09:42]", text: "Optimizing Garbage Collection in High-Throughput Rust Services" },
    { level: "BACKEND", color: "bg-tertiary/10 text-tertiary",  border: "hover:border-tertiary",  title: "group-hover:text-tertiary",  date: "[2024-04-28 23:15]", text: "Ghost in the Shell: Debugging Mystery Latency Spikes in K8s" },
    { level: "FRONTEND", color: "bg-error/10 text-error",        border: "hover:border-error",     title: "group-hover:text-error",     date: "[2024-04-15 02:04]", text: "Post-Mortem: Why the Load Balancer Hates Your JSON" },
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
