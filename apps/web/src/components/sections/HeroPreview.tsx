"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Braces, Layers3, Server } from "lucide-react";
import { MOTION_DURATION, MOTION_EASE } from "@/lib/motion";

export function HeroPreview() {
  const reducedMotion = useReducedMotion() ?? false;

  return (
    <motion.div
      className="relative mx-auto w-full max-w-[30rem] rounded-lg border border-border bg-surface p-5 shadow-[0_20px_80px_rgba(0,0,0,0.35)]"
      initial={reducedMotion ? false : { opacity: 0, y: 16 }}
      transition={{
        duration: MOTION_DURATION.slow,
        ease: MOTION_EASE,
      }}
      viewport={{ once: true }}
      whileInView={reducedMotion ? undefined : { opacity: 1, y: 0 }}
    >
      <div className="mb-5 flex items-center justify-between border-b border-border pb-4 font-mono text-xs text-muted">
        <span className="inline-flex items-center gap-2">
          <Server aria-hidden="true" size={14} />
          API / Frontend / Data
        </span>
        <span className="text-primary">Maintainable Systems</span>
      </div>

      <div className="rounded border border-border bg-background p-5">
        <motion.div
          className="h-2 w-3/4 rounded bg-[#24272c]"
          initial={reducedMotion ? false : { scaleX: 0 }}
          style={{ originX: 0 }}
          transition={{ delay: 0.15, duration: MOTION_DURATION.normal, ease: MOTION_EASE }}
          whileInView={reducedMotion ? undefined : { scaleX: 1 }}
        />
        <motion.div
          className="mt-4 h-2 w-1/2 rounded bg-[#24272c]"
          initial={reducedMotion ? false : { scaleX: 0 }}
          style={{ originX: 0 }}
          transition={{ delay: 0.22, duration: MOTION_DURATION.normal, ease: MOTION_EASE }}
          whileInView={reducedMotion ? undefined : { scaleX: 1 }}
        />
        <motion.div
          className="mt-4 h-2 w-5/6 rounded bg-primary/45"
          initial={reducedMotion ? false : { scaleX: 0 }}
          style={{ originX: 0 }}
          transition={{ delay: 0.3, duration: MOTION_DURATION.normal, ease: MOTION_EASE }}
          whileInView={reducedMotion ? undefined : { scaleX: 1 }}
        />
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4">
        <div className="min-h-32 rounded border border-border bg-background p-4">
          <Layers3 aria-hidden="true" className="text-primary" size={20} />
          <p className="mt-14 font-mono text-xs font-semibold text-foreground">
            Architecture
          </p>
        </div>
        <div className="min-h-32 rounded border border-primary/25 bg-background p-4">
          <Braces aria-hidden="true" className="text-primary" size={20} />
          <p className="mt-14 font-mono text-xs font-semibold text-foreground">
            AI Workflow
          </p>
        </div>
      </div>

      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute -right-6 -top-6 hidden h-24 w-24 border border-primary/20 md:block"
        initial={reducedMotion ? false : { opacity: 0, rotate: -4 }}
        transition={{ delay: 0.35, duration: MOTION_DURATION.slow, ease: MOTION_EASE }}
        whileInView={reducedMotion ? undefined : { opacity: 1, rotate: 0 }}
      />
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-5 -left-5 hidden h-20 w-20 border border-border md:block"
        initial={reducedMotion ? false : { opacity: 0, rotate: 4 }}
        transition={{ delay: 0.42, duration: MOTION_DURATION.slow, ease: MOTION_EASE }}
        whileInView={reducedMotion ? undefined : { opacity: 1, rotate: 0 }}
      />
    </motion.div>
  );
}
