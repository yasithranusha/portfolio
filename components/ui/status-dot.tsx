import { cn } from "@/lib/utils";

interface StatusDotProps {
  status: "online" | "offline" | "warn";
  label?: string;
  animate?: boolean;
  className?: string;
}

const statusClasses = {
  online: "bg-[#55fe7e]",
  offline: "bg-[#ff7351]",
  warn: "bg-[#85ecff]",
};

const glowClasses = {
  online: "shadow-[0_0_6px_rgba(85,254,126,0.8)]",
  offline: "shadow-[0_0_6px_rgba(255,115,81,0.8)]",
  warn: "shadow-[0_0_6px_rgba(133,236,255,0.8)]",
};

export function StatusDot({ status, label, animate = false, className }: StatusDotProps) {
  return (
    <span className={cn("inline-flex items-center gap-1.5", className)}>
      <span
        className={cn(
          "inline-block w-2 h-2 flex-shrink-0",
          statusClasses[status],
          animate && status === "online" && glowClasses[status],
          animate && status === "online" && "animate-pulse"
        )}
      />
      {label && (
        <span className="text-[10px] font-mono text-[#adaaaa] uppercase tracking-widest">
          {label}
        </span>
      )}
    </span>
  );
}
