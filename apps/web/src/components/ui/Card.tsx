import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/cn";

type CardProps = ComponentPropsWithoutRef<"article"> & {
  interactive?: boolean;
};

export function Card({ className, interactive = false, ...props }: CardProps) {
  return (
    <article
      className={cn(
        "rounded-lg border border-border bg-surface p-6 shadow-[0_4px_20px_rgba(0,0,0,0.2)]",
        interactive &&
          "transition-colors hover:border-primary/40 hover:bg-[#0d0d0d]",
        className,
      )}
      {...props}
    />
  );
}

