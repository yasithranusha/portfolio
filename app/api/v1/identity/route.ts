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
        "Full-Stack Development (Java / Node.js / React.js)",
        "API Security (OAuth 2.0, SSO, JWT, Microsoft Entra ID)",
        "Cloud-Native Systems (AWS, Azure, Docker, CI/CD)",
        "Microservices & Event-Driven Architecture",
      ],
      stack: {
        languages:  ["Java", "TypeScript", "JavaScript", "Python", "Go", "SQL"],
        backend:    ["Spring Boot", "NestJS", "Node.js", "Fiber (Go)", "gRPC", "GraphQL", "RabbitMQ", "Kafka"],
        frontend:   ["React.js", "Next.js", "shadcn UI", "React Query", "Zustand", "Redux Toolkit"],
        databases:  ["PostgreSQL", "MySQL", "MongoDB", "Redis", "Pinecone"],
        cloud:      ["AWS (EC2, S3, KMS, Lambda)", "Azure (Entra ID, App Services)", "Docker", "GitHub Actions", "CircleCI"],
        security:   ["OAuth 2.0", "SSO", "JWT", "Microsoft Entra ID", "RBAC"],
      },
      contact: {
        github:   siteConfig.socials.github,
        linkedin: siteConfig.socials.linkedin,
        email:    `hello@${new URL(siteConfig.url).hostname}`,
      },
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
