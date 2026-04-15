"use client";

import Link from "next/link";
import { type Project } from "@/lib/notion";
import { TerminalWindow } from "@/components/ui/terminal-window";
import { StatusDot } from "@/components/ui/status-dot";
import { Tag } from "@/components/ui/tag";
import { TextScramble } from "@/components/motion/text-scramble";

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <TerminalWindow
      title={`${project.slug}.sh`}
      status={project.status}
    >
      <div className="p-4 space-y-3">
        {/* Status + title row */}
        <div className="flex items-start justify-between gap-2">
          <TextScramble
            text={project.title}
            className="font-mono text-sm font-semibold text-white hover:text-[#55fe7e] transition-colors cursor-default"
          />
          <StatusDot status={project.status} animate={project.status === "online"} />
        </div>

        {/* Description */}
        <p className="text-[11px] font-mono text-[#adaaaa] leading-5 line-clamp-3">
          {project.description}
        </p>

        {/* Tags */}
        {project.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {project.tags.map((tag) => (
              <Tag key={tag} variant="tertiary">
                {tag}
              </Tag>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-4 pt-1">
          {project.github && (
            <Link
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] font-mono text-[#85ecff] hover:text-white transition-colors"
            >
              &gt; View Source
            </Link>
          )}
          {project.live && (
            <Link
              href={project.live}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] font-mono text-[#85ecff] hover:text-white transition-colors"
            >
              &gt; Live
            </Link>
          )}
        </div>
      </div>
    </TerminalWindow>
  );
}
