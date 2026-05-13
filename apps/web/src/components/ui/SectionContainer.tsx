import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/cn";

type SectionContainerProps = ComponentPropsWithoutRef<"section"> & {
  as?: "section" | "div" | "main";
};

export function SectionContainer({
  as: Component = "section",
  className,
  ...props
}: SectionContainerProps) {
  return (
    <Component
      className={cn("mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8", className)}
      {...props}
    />
  );
}

