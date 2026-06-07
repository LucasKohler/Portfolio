# UI Animation Analysis — Portfolio Frontend

**Task:** `feat-ui-animations`
**Date:** 2026-06-06
**Scope:** Frontend visual + animation polish only (no backend, routes, or content changes)

---

## 1. Current State (Before)

### Visual foundation (already strong)

- Dark premium SaaS identity aligned with `DESIGN.md`: deep blacks, `#adc6ff` primary, Geist typography, generous spacing, thin `#222` borders.
- Reusable component tree (`Card`, `Button`, `Badge`, `Section*`, `ProjectCard`, shared `Navbar`/`Footer`/`ContactCTA`).
- Glassmorphic navbar (`backdrop-blur-xl`, semi-transparent surface) in `apps/web/src/components/layout/Navbar.tsx:20`.
- Framer Motion v12 declared in `apps/web/package.json` but **unused** before this task.

### Animation baseline (pre-change)

Almost all motion was Tailwind `transition-colors` with `:hover` swaps:

| File | Line | Behavior |
|------|------|----------|
| `apps/web/src/components/ui/Card.tsx` | 14 | `transition-colors hover:border-primary/40 hover:bg-[#0d0d0d]` |
| `apps/web/src/components/projects/ProjectCard.tsx` | 92, 98 | Footer link color on `group-hover` |
| `apps/web/src/components/ui/Button.tsx` | 24 | `transition-colors` only |
| `apps/web/src/components/layout/Navbar.tsx` | 52, 68, 75 | Link/icon color transitions |
| `apps/web/src/components/projects/ProjectFilters.tsx` | 86, 106 | Input + filter chip color transitions |

**Gaps identified:**

- No `prefers-reduced-motion` handling.
- No entrance animations or grid stagger (`ProjectGrid`, `FeaturedProjects`).
- Filter/search in `ProjectFilters` swapped DOM instantly (no `AnimatePresence`).
- No press-scale feedback on buttons.
- No mouse-follow radial flare on interactive cards (explicit `DESIGN.md` requirement).
- No icon nudges on project card footer links.

---

## 2. Design References

### DESIGN.md (root)

> Interactive cards should feature a very subtle radial gradient flare that follows the mouse position (inspired by Stripe), highlighting the #222 border as it moves.
> — `DESIGN.md:171`

> Level 2 (Float): Glassmorphic surfaces using `backdrop-filter: blur(12px)` … reserved for navigation bars, modals, and hovering states.
> — `DESIGN.md:150`

### Stitch export patterns (HTML reference)

From `stitch-export` project index pages:

- `group-hover:opacity-100` colored tint overlays (`from-primary/5`).
- `active:scale-90` / `scale-95` press feedback on interactive elements.
- `group-hover:-translate-x-1` icon nudges on links.
- `duration-300 transition-all` on cards with hover border/shadow lift.

### docs/specs/ROUTES.md expectation

The experience should feel SPA-like with smooth transitions between catalog states — addressed via filter grid `AnimatePresence`.

---

## 3. Implemented Improvements

| # | Improvement | Files | Status |
|---|-------------|-------|--------|
| 1 | Motion foundation + tokens | `globals.css`, `src/lib/motion.ts` | Done |
| 2 | Premium interactive Card (lift + tint + mouse flare) | `ui/Card.tsx`, `projects/ProjectCard.tsx` | Done |
| 3 | Staggered grid entrances | `projects/ProjectGrid.tsx`, `sections/FeaturedProjects.tsx` | Done |
| 4 | Filter result transitions | `projects/ProjectGrid.tsx` (via `AnimatePresence` + `filterItem`) | Done |
| 5 | Press scale + icon nudges | `ui/Button.tsx`, `ProjectCard.tsx`, `Navbar.tsx`, `ProjectDetail.tsx`, `ProjectFilters.tsx` | Done |
| 6 | Light Hero preview reveals | `sections/HeroPreview.tsx`, `sections/Hero.tsx` | Done |
| 7 | Analysis document | `docs/UI-ANIMATION-ANALYSIS.md` | Done |

### Technique summary

- **Shared motion layer** (`src/lib/motion.ts`): `fadeUp`, `staggerContainer`, `filterItem` variants; `usePrefersReducedMotion()` guard; durations 180–350ms with `cubic-bezier(0.16, 1, 0.3, 1)`.
- **Interactive Card**: `motion.article` + `useMotionValue`/`useMotionTemplate` for pointer-follow radial flare; static tint overlay; y-lift + shadow on hover; touch devices skip pointer tracking.
- **Grids**: Client `ProjectGrid` with `staggerContainer` on mount and `AnimatePresence mode="popLayout"` on filter changes.
- **Micro-interactions**: CSS `active:scale-[0.96]` on buttons; `group-hover:translate-x-0.5` on project card arrows; navbar icon press scale.
- **Reduced motion**: Global CSS media query in `globals.css`; Framer `useReducedMotion()` in client components; `motion-reduce:` Tailwind utilities on transforms.

---

## 4. Before / After Behavior

| Surface | Before | After |
|---------|--------|-------|
| Project cards | Color border/bg swap on hover | Lift, shadow, tint overlay, mouse-follow flare (desktop), arrow nudge |
| `/projects` grid | Instant render / filter swap | Staggered entrance; opacity/y transitions on filter change |
| Home featured grid | Static compact cards | Same animated grid primitive as `/projects` |
| Buttons | Color hover only | Press scale + improved focus ring (global `:focus-visible`) |
| Hero preview (lg+) | Static decorative panel | One-time fade + bar reveal + border square entrance |
| Reduced motion | Not handled | Transforms disabled/snapped; color feedback preserved |

---

## 5. Accessibility Notes

- **`prefers-reduced-motion`**: Global CSS snaps transitions; Framer hooks skip transforms and pointer flare; `motion-reduce:active:scale-100` on press scales.
- **Focus**: `:focus-visible` outline added in `globals.css`; existing `focus-visible:ring` on buttons/filters preserved.
- **Pointer tracking**: Disabled on `pointerType === "touch"` to avoid broken hover emulation.
- **Screen readers**: Decorative motion layers use `aria-hidden="true"`; no motion conveys sole meaning.

---

## 6. Deliberately Deferred (Lower Priority)

| Item | Reason |
|------|--------|
| Mobile navigation drawer | Real UX gap but outside animation scope; navbar links remain `hidden md:flex` |
| `ValueSection` / `AnimatedSection` viewport reveals | P2 optional; kept minimal to avoid over-animation |
| Scroll-linked / physics animations | Explicitly out of scope per plan |
| Visual regression CI | Future infrastructure item |
| Lighthouse perf audit on low-end devices | Only 6 seed projects; manual feel-check sufficient for now |

---

## 7. Validation Performed

### Automated

```bash
cd apps/web && npm run lint   # exit 0
cd apps/web && npm run build  # exit 0 — Next.js 16.2.6, TypeScript OK
```

### Manual (recommended during review)

- `/` — Hero preview motion, featured compact cards, button press
- `/projects` — search + category filters with smooth grid updates
- `/projects/[slug]` — back button, breadcrumb hover
- Enable OS/browser reduced motion — confirm no transforms or long transitions
- Desktop / tablet / mobile breakpoints — no horizontal scroll from motion

### Not validated in this session

- Pixel-perfect match to reference PNG screenshots
- Real-world performance with 20+ project cards
- Interaction with placeholder `#` terminal/code navbar links

---

## 8. Next Safe Steps

1. Manual visual review in dev (`npm run dev`) across the three routes above.
2. Consider mobile nav as a separate scoped task (`feat-mobile-nav`).
3. Optional: add Playwright visual snapshots for card hover states once CI is introduced.
4. User review → explicit commit request if satisfied.
