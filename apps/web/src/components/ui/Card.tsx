"use client";

import { motion, useMotionTemplate, useMotionValue, useReducedMotion } from "framer-motion";
import type { ComponentPropsWithoutRef, PointerEvent } from "react";
import { useCallback } from "react";
import { cn } from "@/lib/cn";

type CardProps = Omit<
  ComponentPropsWithoutRef<"article">,
  "onAnimationStart" | "onAnimationEnd" | "onDrag" | "onDragEnd" | "onDragStart"
> & {
  interactive?: boolean;
};

const staticCardClasses =
  "rounded-lg border border-border bg-surface p-6 shadow-[0_4px_20px_rgba(0,0,0,0.2)]";

export function Card({
  className,
  interactive = false,
  children,
  onPointerMove,
  onPointerLeave,
  ...props
}: CardProps) {
  const reducedMotion = useReducedMotion() ?? false;
  const mouseX = useMotionValue(-1000);
  const mouseY = useMotionValue(-1000);
  const flareBackground = useMotionTemplate`radial-gradient(420px circle at ${mouseX}px ${mouseY}px, rgba(173, 198, 255, 0.1), transparent 75%)`;

  const handlePointerMove = useCallback(
    (event: PointerEvent<HTMLElement>) => {
      onPointerMove?.(event);

      if (reducedMotion || event.pointerType === "touch") {
        return;
      }

      const rect = event.currentTarget.getBoundingClientRect();
      mouseX.set(event.clientX - rect.left);
      mouseY.set(event.clientY - rect.top);
    },
    [mouseX, mouseY, onPointerMove, reducedMotion],
  );

  const handlePointerLeave = useCallback(
    (event: PointerEvent<HTMLElement>) => {
      onPointerLeave?.(event);
      mouseX.set(-1000);
      mouseY.set(-1000);
    },
    [mouseX, mouseY, onPointerLeave],
  );

  if (!interactive) {
    return (
      <article className={cn(staticCardClasses, className)} {...props}>
        {children}
      </article>
    );
  }

  return (
    <motion.article
      className={cn(
        "group relative overflow-hidden",
        staticCardClasses,
        reducedMotion
          ? "transition-colors hover:border-primary/40 hover:bg-[#0d0d0d]"
          : "transition-[border-color,background-color,box-shadow,transform] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-0.5 hover:border-primary/40 hover:bg-[#0d0d0d] hover:shadow-[0_8px_32px_rgba(0,0,0,0.35)]",
        className,
      )}
      onPointerLeave={handlePointerLeave}
      onPointerMove={handlePointerMove}
      {...props}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      />

      {!reducedMotion && (
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{ background: flareBackground }}
        />
      )}

      <div className="relative z-10 flex h-full flex-col">{children}</div>
    </motion.article>
  );
}
