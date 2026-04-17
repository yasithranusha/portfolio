export const siteConfig = {
  handle: "yasith",
  name: "Yasith Ranusha",
  role: "Full-Stack Software Engineer",
  tagline: [
    "whoami",
    "2+ years of production experience.",
    "Spring Boot, Node.js & React.",
    "Cloud-native & API Security specialist.",
  ],
  description:
    "Full-Stack Software Engineer specializing in building scalable, cloud-native applications with Java (Spring Boot), Node.js/TypeScript, and React.js. Expert in API Security, OAuth 2.0, and distributed systems.",
  url: "https://yasithranusha.dev",
  socials: {
    github: "https://github.com/yasithranusha",
    linkedin: "https://linkedin.com/in/yasithranusha",
    twitter: "https://twitter.com/yasithranusha",
  },
  nav: [
    { label: "ROOT",     href: "/" },
    { label: "NODES",    href: "/blog" },
    { label: "REGISTRY", href: "/projects" },
    { label: "CONNECT",  href: "/about" },
  ],
  bootLines: [
    "[  0.000] Booting KERNEL_CONSOLE v2.0.4",
    "[  0.241] Loading modules...",
    "[  0.489] Mounting filesystem...",
    "[  0.731] Starting services...",
    "[  1.024] System ready.",
  ],
  sudo: {
    root_secrets: {
      editor:               "neovim",
      theme:                "dark (always)",
      tabs_vs_spaces:       "tabs",
      coffee_dependency:    "critical",
      git_commits_at_2am:   true,
      favorite_debugger:    "console.log",
    },
    warning: "this session will self-destruct in 30s",
  },
} as const;

export type SiteConfig = typeof siteConfig;
