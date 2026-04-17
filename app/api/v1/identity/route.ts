import { NextResponse } from "next/server";
import { siteConfig } from "@/config/site";

export async function GET() {
  return NextResponse.json(
    {
      handle:         siteConfig.handle,
      name:           siteConfig.name,
      role:           siteConfig.role,
      status:         "online",
      location:       "Sri Lanka / Remote",
      open_to_work:   true,
      specialization: [
        "Distributed Systems",
        "Cloud-Native Infrastructure",
        "DevOps & Platform Engineering",
        "Open Source",
      ],
      stack: {
        languages:  ["Go", "TypeScript", "Python", "Rust", "Bash"],
        cloud:      ["AWS", "GCP", "Kubernetes", "Terraform", "Pulumi"],
        backend:    ["Node.js", "gRPC", "GraphQL", "PostgreSQL", "Redis"],
        devops:     ["GitHub Actions", "ArgoCD", "Helm", "Docker"],
      },
      contact: {
        github:   siteConfig.socials.github,
        linkedin: siteConfig.socials.linkedin,
        twitter:  siteConfig.socials.twitter,
        email:    `hello@${new URL(siteConfig.url).hostname}`,
      },
      kernel_panics: 4,
    },
    {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "X-Powered-By":  "KERNEL_CONSOLE",
        "X-Handle":      siteConfig.handle,
      },
    }
  );
}
