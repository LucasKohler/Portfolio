"use client";

import { useReducedMotion, type Transition, type Variants } from "framer-motion";

export const MOTION_DURATION = {
  fast: 0.18,
  normal: 0.28,
  slow: 0.35,
} as const;

export const MOTION_EASE = [0.16, 1, 0.3, 1] as const;

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: MOTION_DURATION.normal,
      ease: MOTION_EASE,
    },
  },
};

export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.04,
    },
  },
};

export const filterItem: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: MOTION_DURATION.fast,
      ease: MOTION_EASE,
    },
  },
  exit: {
    opacity: 0,
    y: -4,
    transition: {
      duration: MOTION_DURATION.fast,
      ease: MOTION_EASE,
    },
  },
};

export function usePrefersReducedMotion(): boolean {
  return useReducedMotion() ?? false;
}

export function getStaggerTransition(reduced: boolean): Transition | undefined {
  if (reduced) {
    return { duration: 0 };
  }

  return {
    duration: MOTION_DURATION.normal,
    ease: MOTION_EASE,
  };
}
