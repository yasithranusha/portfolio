export const siteConfig = {
  handle: "yasith",
  name: "Yasith Ranusha",
  email: "yasithranusha@gmail.com",
  role: "Full-Stack Software Engineer",
  domain: "yasithranusha.me",
  branding: "YASITH.SYS",
  url: "https://www.yasithranusha.me/",
  tagline: [
    "whoami",
    "Full-Stack Software Engineer.",
    "Java, Spring Boot & Node.js/TypeScript.",
    "API Security & Cloud-Native specialist.",
  ],
  description:
    "Full-Stack Software Engineer with 2 years of production experience building scalable, cloud-native applications using Java (Spring Boot), Node.js/TypeScript, and React.js. Specializing in Zero-Trust Architecture, Identity Federation (OIDC/SAML), and securing distributed systems across AWS and Azure.",
  socials: {
    github:   "https://github.com/yasithranusha",
    linkedin: "https://linkedin.com/in/yasithranusha",
  },
  nav: [
    { label: "HOME",     href: "/" },
    { label: "ARTICLES",    href: "/blog" },
    { label: "PROJECTS", href: "/projects" },
    { label: "CONTACT",  href: "/about" },
  ],
  // NEW: Personal Vitals for Homepage
  vitals: {
    experience: {
      value: "2",
      label: "YEARS",
      desc: "Production architecture & distributed systems."
    },
    techStack: [
      "Java (Spring)", "React.js", "Node.js", "TypeScript"
    ],
    cloud: [
      "AWS & Azure", "Docker / K8s", "CI/CD"
    ]
  },
  // NEW: Project Registry Stats
  stats: {
    uptime: "99.999%",
    latency: "14ms",
    threatLevel: "MINIMAL"
  },
  // NEW: About Page Proficiencies
  about: {
    stats: [
      { label: "BACKEND_ENG (Java/Node)", value: "95%", color: "primary" },
      { label: "FRONTEND_DEV (React)", value: "85%", color: "tertiary" },
      { label: "CLOUD_ARCHITECTURE", value: "80%", color: "secondary" },
    ]
  },
  // NEW: Terminal Defaults
  terminal: {
    scriptName: "yasith.sh",
    identityEndpoint: "/api/v1/identity",
    suffix: "Ranusha" // for handle_Suffix.sh
  },
  bootLines: [
    "[  0.000] Booting KERNEL_CONSOLE v2.0.4",
    "[  0.241] Loading modules...",
    "[  0.489] Mounting filesystem...",
    "[  0.731] Starting services...",
    "[  1.024] System ready.",
  ],
  sudo: {
    root_secrets: {
      editor:             "VS Code / IntelliJ IDEA",
      theme:              "dark (always)",
      tabs_vs_spaces:     "spaces (2)",
      coffee_dependency:  "high",
      git_commits_at_2am: true,
      tdd:                true,
    },
    warning: "this session will self-destruct in 30s",
  },
} as const;

export type SiteConfig = typeof siteConfig;
