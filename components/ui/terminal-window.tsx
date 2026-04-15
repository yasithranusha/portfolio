import { cn } from "@/lib/utils";

interface TerminalWindowProps {
  title?: string;
  status?: "online" | "offline" | "warn";
  className?: string;
  children: React.ReactNode;
}

export function TerminalWindow({
  title,
  status,
  className,
  children,
}: TerminalWindowProps) {
  return (
    <div
      className={cn(
        "border border-[#494847]/30 bg-[#1a1919]",
        className
      )}
    >
      {/* Header bar */}
      <div className="flex items-center gap-2 h-6 px-3 bg-[#201f1f] border-b border-[#494847]/30">
        {/* Stoplight dots */}
        <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#ff7351]" />
        <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#ffa500]" />
        <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#55fe7e]" />
        {title && (
          <span className="ml-2 text-[10px] font-mono text-[#adaaaa] tracking-widest uppercase truncate">
            {title}
          </span>
        )}
      </div>
      {/* Content */}
      <div>{children}</div>
    </div>
  );
}
