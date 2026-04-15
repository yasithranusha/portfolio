import { cn } from "@/lib/utils";

type TagVariant = "primary" | "secondary" | "tertiary" | "default";

interface TagProps {
  children: React.ReactNode;
  variant?: TagVariant;
  className?: string;
}

const variantClasses: Record<TagVariant, string> = {
  primary: "text-[#55fe7e]",
  secondary: "text-[#5db4fe]",
  tertiary: "text-[#85ecff]",
  default: "text-[#adaaaa]",
};

export function Tag({ children, variant = "default", className }: TagProps) {
  return (
    <span
      className={cn(
        "inline-block px-2 py-0.5 text-[10px] font-mono tracking-widest uppercase bg-[#262626] border border-[#494847]/40",
        variantClasses[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
