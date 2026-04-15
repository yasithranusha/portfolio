export const siteConfig = {
  handle: "yasith",
  name: "Yasith Ranusha",
  role: "Engineer & Cloud Architect",
  tagline: [
    "whoami",
    "Principal Backend Engineer.",
    "Cloud-native infrastructure.",
    "Open source contributor.",
  ],
  description:
    "Principal Backend Engineer and Cloud Architect specializing in distributed systems, DevOps, and cloud-native infrastructure.",
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
} as const;

export type SiteConfig = typeof siteConfig;
