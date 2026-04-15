import { cn } from "@/lib/utils";

interface SectionLabelProps {
  children: React.ReactNode;
  prefix?: string;
  className?: string;
}

export function SectionLabel({ children, prefix = "//", className }: SectionLabelProps) {
  return (
    <p
      className={cn(
        "text-[10px] font-mono text-[#adaaaa] uppercase tracking-[0.2em]",
        className
      )}
    >
      <span className="text-[#55fe7e]">{prefix}</span>{" "}
      {children}
    </p>
  );
}
