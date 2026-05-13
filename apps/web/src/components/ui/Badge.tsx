import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/cn";

type BadgeVariant = "default" | "primary" | "cyan" | "muted";

const variantClasses: Record<BadgeVariant, string> = {
  default: "border-border bg-[rgba(255,255,255,0.05)] text-muted",
  primary: "border-primary/40 bg-primary/10 text-primary",
  cyan: "border-cyan-400/35 bg-cyan-400/10 text-cyan-200",
  muted: "border-border bg-surface-inset text-[#6f7480]",
};

type BadgeProps = ComponentPropsWithoutRef<"span"> & {
  variant?: BadgeVariant;
};

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex min-h-7 items-center rounded px-2.5 py-1 font-mono text-xs leading-none tracking-[0.02em]",
        variantClasses[variant],
        className,
      )}
      {...props}
    />
  );
}

