import { siteConfig } from "@/config/site";
import type { NotionPost } from "@/lib/notion";

// ─── Types ───────────────────────────────────────────────────────────

export type TerminalLine = {
  text: string;
  color?: string;
  html?: boolean;
};

export type HistoryEntry = {
  command: string;
  output: TerminalLine[];
  cwd: string;
};

// ─── Static content ──────────────────────────────────────────────────

const SCRIPT_RUN: TerminalLine[] = [
  { text: "NAME", color: "text-primary" },
  { text: `        ${siteConfig.handle} — ${siteConfig.role}`, color: "text-on-surface" },
  { text: "" },
  { text: "SYNOPSIS", color: "text-primary" },
  { text: `        ${siteConfig.handle} [--lang=java|ts] [--env=aws|azure] [--mode=full-stack]`, color: "text-on-surface-variant" },
  { text: "" },
  { text: "DESCRIPTION", color: "text-primary" },
  { text: `        ${siteConfig.description}`, color: "text-on-surface-variant" },
  { text: "" },
  { text: "ARGUMENTS", color: "text-primary" },
  { text: "        --backend     Java (Spring Boot), Node.js, NestJS, Go", color: "text-on-surface-variant" },
  { text: "        --frontend    React.js, Next.js, TypeScript",            color: "text-on-surface-variant" },
  { text: "        --cloud       AWS, Azure, Docker, GitHub Actions",       color: "text-on-surface-variant" },
  { text: "        --security    OAuth 2.0, SSO, JWT, Microsoft Entra ID",  color: "text-on-surface-variant" },
  { text: "" },
  { text: "EXIT STATUS", color: "text-primary" },
  { text: "        0   on successful deployment.", color: "text-on-surface-variant" },
  { text: "        1   on kernel panic (rare).",   color: "text-on-surface-variant" },
];

const SCRIPT_CAT: TerminalLine[] = [
  { text: "#!/bin/bash",                                                                    color: "text-on-surface-variant" },
  { text: `# ${siteConfig.handle}.sh — system identity manifest`,                          color: "text-[#494847]" },
  { text: "" },
  { text: 'echo "NAME"',                                                                    color: "text-tertiary" },
  { text: `echo "        ${siteConfig.handle} — ${siteConfig.role}"`,                      color: "text-on-surface-variant" },
  { text: 'echo "SYNOPSIS"',                                                                color: "text-tertiary" },
  { text: `echo "        ${siteConfig.handle} [--lang=java|ts] [--env=aws|azure]"`,        color: "text-on-surface-variant" },
  { text: 'echo "DESCRIPTION"',                                                             color: "text-tertiary" },
  { text: `echo "        ${siteConfig.description}"`,                                       color: "text-on-surface-variant" },
  { text: 'echo "ARGUMENTS"',                                                               color: "text-tertiary" },
  { text: 'echo "        --backend     Java (Spring Boot), Node.js, NestJS, Go"',          color: "text-on-surface-variant" },
  { text: 'echo "        --frontend    React.js, Next.js, TypeScript"',                    color: "text-on-surface-variant" },
  { text: 'echo "        --cloud       AWS, Azure, Docker, GitHub Actions"',               color: "text-on-surface-variant" },
  { text: 'echo "        --security    OAuth 2.0, SSO, JWT, Microsoft Entra ID"',          color: "text-on-surface-variant" },
  { text: 'echo "EXIT STATUS"',                                                             color: "text-tertiary" },
  { text: 'echo "        0   on successful deployment."',                                   color: "text-on-surface-variant" },
];

const README_CAT: TerminalLine[] = [
  { text: `# ${siteConfig.handle}`,                                      color: "text-primary" },
  { text: "" },
  { text: "Cloud-native portfolio. Fork-friendly. Kernel aesthetic.", color: "text-on-surface-variant" },
  { text: "" },
  { text: `Run ./${siteConfig.terminal.scriptName} for system identity manifest.`,            color: "text-tertiary" },
  { text: "Explore ~/archives for blog posts.",                       color: "text-tertiary" },
];

const HOME_LS_LA: TerminalLine[] = [
  { text: "total 24",                                                         color: "text-on-surface-variant" },
  { text: "drwxr-xr-x  4 root  staff  128  APR 15 2026  .",                  color: "text-on-surface" },
  { text: "drwxr-xr-x  8 root  staff  256  APR 15 2026  ..",                 color: "text-on-surface" },
  { text: "drwxr-xr-x  2 root  staff   64  APR 15 2026  archives",           color: "text-secondary" },
  { text: `-rwxr-xr-x  1 root  staff  512  APR 15 2026  ${siteConfig.terminal.scriptName}`,          color: "text-primary" },
  { text: "-rw-r--r--  1 root  staff  128  APR 15 2026  readme.md",          color: "text-on-surface" },
];

const CURL_OUTPUT: TerminalLine[] = [
  { text: "  % Total    % Received  Xferd  Average  Speed   Time",  color: "text-[#494847]" },
  { text: "100   842  100   842    0     0   9241      0  --:--:--", color: "text-on-surface-variant" },
  { text: "" },
  { text: "{", color: "text-on-surface-variant" },
  { html: true, text: `  <span class="text-tertiary">"handle"</span>: <span class="text-secondary-fixed-dim">"${siteConfig.handle}"</span>,` },
  { html: true, text: `  <span class="text-tertiary">"name"</span>: <span class="text-secondary-fixed-dim">"${siteConfig.name}"</span>,` },
  { html: true, text: `  <span class="text-tertiary">"role"</span>: <span class="text-secondary-fixed-dim">"${siteConfig.role}"</span>,` },
  { html: true, text: `  <span class="text-tertiary">"status"</span>: <span class="text-primary">"online"</span>,` },
  { html: true, text: `  <span class="text-tertiary">"location"</span>: <span class="text-secondary-fixed-dim">"Sri Lanka / Remote"</span>,` },
  { html: true, text: `  <span class="text-tertiary">"open_to_work"</span>: <span class="text-primary">true</span>,` },
  { html: true, text: `  <span class="text-tertiary">"stack"</span>: [<span class="text-secondary-fixed-dim">"Java"</span>, <span class="text-secondary-fixed-dim">"Spring Boot"</span>, <span class="text-secondary-fixed-dim">"TypeScript"</span>, <span class="text-secondary-fixed-dim">"React.js"</span>, <span class="text-secondary-fixed-dim">"AWS"</span>],` },
  { html: true, text: `  <span class="text-tertiary">"github"</span>: <a href="${siteConfig.socials.github}" target="_blank" rel="noreferrer" class="text-secondary-fixed-dim hover:underline">"${siteConfig.socials.github}"</a>,` },
  { html: true, text: `  <span class="text-tertiary">"linkedin"</span>: <a href="${siteConfig.socials.linkedin}" target="_blank" rel="noreferrer" class="text-secondary-fixed-dim hover:underline">"${siteConfig.socials.linkedin}"</a>` },
  { text: "}", color: "text-on-surface-variant" },
];

const CURL_SUDO_OUTPUT: TerminalLine[] = [
  { text: "  % Total    % Received  Xferd  Average  Speed   Time",  color: "text-[#494847]" },
  { text: "100   412  100   412    0     0   5330      0  --:--:--", color: "text-on-surface-variant" },
  { text: "< X-Elevated: root",                                      color: "text-[#494847]" },
  { text: "" },
  { text: "{", color: "text-on-surface-variant" },
  { html: true, text: `  <span class="text-tertiary">"status"</span>: <span class="text-primary">"GRANTED"</span>,` },
  { html: true, text: `  <span class="text-tertiary">"elevated_to"</span>: <span class="text-primary">"root"</span>,` },
  { html: true, text: `  <span class="text-tertiary">"message"</span>: <span class="text-secondary-fixed-dim">"sudo access granted. with great power comes great responsibility."</span>,` },
  { html: true, text: `  <span class="text-tertiary">"root_secrets"</span>: {` },
  { html: true, text: `    <span class="text-tertiary">"editor"</span>: <span class="text-secondary-fixed-dim">"${siteConfig.sudo.root_secrets.editor}"</span>,` },
  { html: true, text: `    <span class="text-tertiary">"coffee_dependency"</span>: <span class="text-error">"${siteConfig.sudo.root_secrets.coffee_dependency}"</span>,` },
  { html: true, text: `    <span class="text-tertiary">"git_commits_at_2am"</span>: <span class="text-primary">${siteConfig.sudo.root_secrets.git_commits_at_2am}</span>,` },
  { html: true, text: `    <span class="text-tertiary">"tdd"</span>: <span class="text-primary">${siteConfig.sudo.root_secrets.tdd}</span>` },
  { html: true, text: `  },` },
  { html: true, text: `  <span class="text-tertiary">"warning"</span>: <span class="text-error">"${siteConfig.sudo.warning}"</span>` },
  { text: "}", color: "text-on-surface-variant" },
];

const HELP_LINES: TerminalLine[] = [
  { text: "Available commands:", color: "text-primary" },
  { text: "  ls [-la] [-n NUM]                 List files, sorted by date (newest first)", color: "text-on-surface-variant" },
  { text: "  cd <dir>                          Change directory (archives, ~, ..)", color: "text-on-surface-variant" },
  { text: "  cat <file>                        Read a file",                       color: "text-on-surface-variant" },
  { text: `  ./${siteConfig.terminal.scriptName}                       Run identity manifest (in ~/)`,     color: "text-on-surface-variant" },
  { text: "  grep <pattern>                    Search blog posts",                 color: "text-on-surface-variant" },
  { text: `  curl ${siteConfig.domain}${siteConfig.terminal.identityEndpoint}  Fetch identity JSON`,               color: "text-on-surface-variant" },
  { text: "  pwd                               Print working directory",           color: "text-on-surface-variant" },
  { text: "  whoami                            Print current user",               color: "text-on-surface-variant" },
  { text: "  clear                             Clear terminal output",            color: "text-on-surface-variant" },
];

// ─── Pure helpers ─────────────────────────────────────────────────────

function escHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

export function makePrompt(dir: string): string {
  return `root@kernel:${dir}$`;
}

function fmtDate(d: string): string {
  if (!d) return "???  ?? ????";
  return new Date(d)
    .toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" })
    .toUpperCase();
}

// ─── Virtual filesystem executor ─────────────────────────────────────

export function exec(
  raw: string,
  currentCwd: string,
  posts: NotionPost[]
): { output: TerminalLine[] | "__CLEAR__"; nextCwd: string } {
  const trimmed = raw.trim();
  const nextCwd = currentCwd;

  if (!trimmed)                              return { output: [],          nextCwd };
  if (trimmed === "clear")                   return { output: "__CLEAR__", nextCwd };
  if (trimmed === "help" || trimmed === "?" || trimmed === "--help" || trimmed === "-h") return { output: HELP_LINES, nextCwd };

  const spaceIdx = trimmed.indexOf(" ");
  const cmd  = spaceIdx === -1 ? trimmed : trimmed.slice(0, spaceIdx);
  const args = spaceIdx === -1 ? ""      : trimmed.slice(spaceIdx + 1).trim();

  if (cmd === "pwd") {
    const path = currentCwd === "~"
      ? `/home/kernel`
      : `/home/kernel/${currentCwd.replace("~/", "")}`;
    return { output: [{ text: path, color: "text-on-surface" }], nextCwd };
  }

  if (cmd === "whoami") {
    return { output: [{ text: "root", color: "text-primary" }], nextCwd };
  }

  if (cmd === "cd") {
    const target = args || "~";
    if (["~", "", "/home/kernel"].includes(target) || (target === ".." && currentCwd === "~")) {
      return { output: [], nextCwd: "~" };
    }
    if (target === ".." && currentCwd !== "~") {
      return { output: [], nextCwd: "~" };
    }
    if (["archives", "~/archives", "./archives"].includes(target)) {
      return { output: [], nextCwd: "~/archives" };
    }
    return { output: [{ text: `bash: cd: ${target}: No such file or directory`, color: "text-error" }], nextCwd };
  }

  if (cmd === "ls") {
    const detailed = args.includes("-l");
    if (currentCwd === "~") {
      if (detailed) return { output: HOME_LS_LA, nextCwd };
      return { output: [{ text: `archives   ${siteConfig.terminal.scriptName}   readme.md`, color: "text-on-surface" }], nextCwd };
    }
    if (posts.length === 0) {
      return { output: [{ text: "(no posts — check Notion connection)", color: "text-on-surface-variant" }], nextCwd };
    }
    const nMatch = args.match(/-n\s+(\d+)/);
    const limit  = nMatch ? parseInt(nMatch[1], 10) : undefined;
    const sorted = [...posts].sort((a, b) => {
      if (!a.date) return 1;
      if (!b.date) return -1;
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
    const displayed = limit ? sorted.slice(0, limit) : sorted;
    if (detailed) {
      return {
        output: [
          { text: `total ${displayed.length}${limit ? ` (showing ${displayed.length} of ${posts.length})` : ""}`, color: "text-on-surface-variant" },
          ...displayed.map((p) => ({
            html: true,
            text: `<a href="/blog/${escHtml(p.slug)}" class="block hover:bg-white/5 -mx-4 px-4"><span class="text-on-surface">-rwxr-xr-x  1 root  staff  ${escHtml(p.readTime.replace("~", "").trim().padEnd(5))}  ${fmtDate(p.date)}  </span><span class="text-primary">${escHtml(p.slug)}.md</span></a>`,
          })),
        ],
        nextCwd,
      };
    }
    return {
      output: displayed.map((p) => ({
        html: true,
        text: `<a href="/blog/${escHtml(p.slug)}" class="text-secondary block hover:bg-white/5 -mx-4 px-4">${escHtml(p.slug)}.md</a>`,
      })),
      nextCwd,
    };
  }

  if (cmd === "cat") {
    if (!args) return { output: [{ text: "usage: cat <file>", color: "text-error" }], nextCwd };
    if (currentCwd === "~") {
      if (args === siteConfig.terminal.scriptName) return { output: SCRIPT_CAT, nextCwd };
      if (args === "readme.md") return { output: README_CAT, nextCwd };
      return { output: [{ text: `cat: ${args}: No such file or directory`, color: "text-error" }], nextCwd };
    }
    const slug = args.replace(/\.md$/, "");
    const post = posts.find((p) => p.slug === slug);
    if (!post) return { output: [{ text: `cat: ${args}: No such file or directory`, color: "text-error" }], nextCwd };
    return {
      output: [
        { text: `# ${post.title}`,                                                color: "text-primary" },
        { text: `date:  ${fmtDate(post.date)}`,                                   color: "text-on-surface-variant" },
        { text: `tags:  ${post.tags.map((t) => "#" + t).join("  ") || "(none)"}`, color: "text-tertiary" },
        { text: `read:  ${post.readTime}`,                                         color: "text-on-surface-variant" },
        { text: "" },
        { text: post.excerpt || "(no excerpt available)",                          color: "text-on-surface-variant" },
      ],
      nextCwd,
    };
  }

  if (trimmed === `./${siteConfig.terminal.scriptName}`) {
    if (currentCwd === "~") return { output: SCRIPT_RUN, nextCwd };
    return { output: [{ text: `bash: ./${siteConfig.terminal.scriptName}: No such file or directory (try cd ~)`, color: "text-error" }], nextCwd };
  }

  if (cmd === "grep") {
    if (!args) return { output: [{ text: "usage: grep <pattern>", color: "text-error" }], nextCwd };
    if (posts.length === 0) return { output: [{ text: "// no posts found", color: "text-on-surface-variant" }], nextCwd };
    const pattern = args.toLowerCase();
    const matches = posts.filter(
      (p) => p.title.toLowerCase().includes(pattern) || p.tags.some((t) => t.toLowerCase().includes(pattern))
    );
    if (!matches.length) return { output: [{ text: `// no matches for "${args}"`, color: "text-on-surface-variant" }], nextCwd };
    return { output: matches.map((p) => ({ text: `archives/${p.slug}.md:  ${p.title}`, color: "text-primary" as const })), nextCwd };
  }

  if (cmd === "curl") {
    if (!args.includes(siteConfig.domain))
      return { output: [{ text: `curl: (6) Could not resolve host: ${args}`, color: "text-error" }], nextCwd };
    if (args.includes("/api/v1/sudo"))
      return { output: CURL_SUDO_OUTPUT, nextCwd };
    return { output: CURL_OUTPUT, nextCwd };
  }

  return { output: [{ text: `bash: ${cmd}: command not found`, color: "text-error" }], nextCwd };
}

// ─── Tab completion ───────────────────────────────────────────────────

export function commonPrefix(strs: string[]): string {
  if (strs.length === 0) return "";
  let prefix = strs[0];
  for (let i = 1; i < strs.length; i++) {
    while (!strs[i].startsWith(prefix)) {
      prefix = prefix.slice(0, -1);
      if (!prefix) return "";
    }
  }
  return prefix;
}

export function getCompletions(input: string, cwd: string, posts: NotionPost[]): string[] {
  const trimmed  = input.trimStart();
  const spaceIdx = trimmed.indexOf(" ");

  if (spaceIdx === -1) {
    const COMMANDS = ["ls", "cd", "cat", "curl", "clear", "grep", "--help", "pwd", "whoami", `./${siteConfig.terminal.scriptName}`];
    return COMMANDS.filter((c) => c.startsWith(trimmed) && c !== trimmed);
  }

  const cmd       = trimmed.slice(0, spaceIdx);
  const argPrefix = trimmed.slice(spaceIdx + 1);

  if (cmd === "cd") {
    const dirs = cwd === "~" ? ["archives"] : [".."];
    return dirs.filter((d) => d.startsWith(argPrefix)).map((d) => `cd ${d}`);
  }

  if (cmd === "cat") {
    const files = cwd === "~"
      ? [siteConfig.terminal.scriptName, "readme.md"]
      : posts.map((p) => `${p.slug}.md`);
    return files.filter((f) => f.startsWith(argPrefix)).map((f) => `cat ${f}`);
  }

  if (cmd === "curl") {
    return [`${siteConfig.domain}${siteConfig.terminal.identityEndpoint}`]
      .filter((u) => u.startsWith(argPrefix))
      .map((u) => `curl ${u}`);
  }

  if (cmd === "grep") {
    const tags = Array.from(new Set(posts.flatMap((p) => p.tags)));
    return tags
      .filter((t) => t.toLowerCase().startsWith(argPrefix.toLowerCase()))
      .map((t) => `grep ${t}`);
  }

  return [];
}

// ─── Server-side pre-computation ─────────────────────────────────────

/**
 * Call this in Server Components to pre-render terminal output.
 * Pass the result as `initialHistory` to InteractiveTerminal so the
 * SSR HTML already contains the terminal content (no blank flash).
 */
export function buildInitialHistory(
  commands: string[],
  initialCwd: string,
  posts: NotionPost[]
): HistoryEntry[] {
  const history: HistoryEntry[] = [];
  let cwd = initialCwd;
  for (const cmd of commands) {
    const cwdBefore = cwd;
    const { output, nextCwd } = exec(cmd, cwd, posts);
    cwd = nextCwd;
    if (output !== "__CLEAR__") {
      history.push({ command: cmd, output, cwd: cwdBefore });
    }
  }
  return history;
}
