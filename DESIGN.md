---
name: Technical Portfolio Design System
colors:
  surface: '#131313'
  surface-dim: '#131313'
  surface-bright: '#3a3939'
  surface-container-lowest: '#0e0e0e'
  surface-container-low: '#1c1b1b'
  surface-container: '#201f1f'
  surface-container-high: '#2a2a2a'
  surface-container-highest: '#353534'
  on-surface: '#e5e2e1'
  on-surface-variant: '#c2c6d6'
  inverse-surface: '#e5e2e1'
  inverse-on-surface: '#313030'
  outline: '#8c909f'
  outline-variant: '#424754'
  surface-tint: '#adc6ff'
  primary: '#adc6ff'
  on-primary: '#002e6a'
  primary-container: '#4d8eff'
  on-primary-container: '#00285d'
  inverse-primary: '#005ac2'
  secondary: '#ddb7ff'
  on-secondary: '#490080'
  secondary-container: '#6f00be'
  on-secondary-container: '#d6a9ff'
  tertiary: '#4cd7f6'
  on-tertiary: '#003640'
  tertiary-container: '#009eb9'
  on-tertiary-container: '#002f38'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#d8e2ff'
  primary-fixed-dim: '#adc6ff'
  on-primary-fixed: '#001a42'
  on-primary-fixed-variant: '#004395'
  secondary-fixed: '#f0dbff'
  secondary-fixed-dim: '#ddb7ff'
  on-secondary-fixed: '#2c0051'
  on-secondary-fixed-variant: '#6900b3'
  tertiary-fixed: '#acedff'
  tertiary-fixed-dim: '#4cd7f6'
  on-tertiary-fixed: '#001f26'
  on-tertiary-fixed-variant: '#004e5c'
  background: '#131313'
  on-background: '#e5e2e1'
  surface-variant: '#353534'
typography:
  display-lg:
    fontFamily: Geist
    fontSize: 64px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.04em
  display-lg-mobile:
    fontFamily: Geist
    fontSize: 40px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Geist
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.3'
    letterSpacing: -0.02em
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
    letterSpacing: '0'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
    letterSpacing: '0'
  label-mono:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: '500'
    lineHeight: '1.4'
    letterSpacing: 0.02em
  caption:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1.4'
    letterSpacing: 0.05em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  base: 4px
  xs: 8px
  sm: 16px
  md: 24px
  lg: 48px
  xl: 80px
  container-max: 1200px
  gutter: 24px
---

## Brand & Style

The design system is anchored in a high-fidelity, "engineer-as-craftsman" aesthetic. It draws heavily from modern technical benchmarks—specifically the precision of Linear and the clarity of Vercel—to present a professional, low-noise environment that emphasizes code quality and architectural thinking.

The style is a hybrid of **Minimalism** and **Glassmorphism**. It prioritizes structural integrity through thin, crisp borders and ample whitespace, while using translucent layers and subtle gradients to suggest depth and software-native sophistication. By avoiding standard "cyberpunk" tropes, the system maintains a serious, corporate-grade technical feel suitable for high-stakes engineering roles.

## Colors

This design system utilizes a "Deep Dark" palette to minimize eye strain and highlight technical content. The background hierarchy relies on slight shifts between near-black (#050505) for the canvas and deep charcoal (#0A0A0A) for interactive surfaces.

Accents are used sparingly as functional indicators or "moments of delight" rather than dominant themes. 
- **Electric Blue (#3B82F6):** Primary actions and focus states.
- **Deep Purple (#A855F7):** Secondary emphasis and brand gradients.
- **Cyan (#06B6D4):** Success states, technical badges, or syntax highlights.
- **Borders (#222222):** Used consistently across the system to define structure without adding visual bulk.

## Typography

The typography strategy leverages a trio of technical fonts to communicate hierarchy. **Geist** is used for display and headlines to provide a sharp, modern sans-serif feel. **Inter** serves as the workhorse for body copy, ensuring maximum readability across long-form case studies. **JetBrains Mono** is reserved for labels, metadata, and code snippets, grounding the system in an engineering context.

Maintain a strict weight hierarchy: use Bold/Semibold for headers and Regular for body text. To maintain the "premium" feel, avoid using Medium weights for body text; instead, rely on white space and color (Text Primary vs. Text Secondary) to create contrast.

## Layout & Spacing

The layout follows a **Fixed Grid** model for desktop to ensure a controlled, editorial reading experience, while transitioning to a fluid model for mobile.

- **Desktop (1200px+):** 12-column grid with 24px gutters. Content is centered with generous outer margins to evoke a "gallery" feel.
- **Tablet:** 8-column grid with 24px gutters.
- **Mobile:** 4-column grid with 16px gutters and 16px side margins.

Use spacing to group related technical concepts. "Generous whitespace" is a core tenet—use `xl` (80px) spacing between major sections (e.g., Work, Experience, Projects) to give the content room to breathe.

## Elevation & Depth

Depth in this design system is achieved through **Glassmorphism** and **Tonal Layering** rather than traditional heavy shadows.

1.  **Level 0 (Canvas):** The #050505 background.
2.  **Level 1 (Surface):** The #0A0A0A surface with a 1px #222 border. Used for cards and secondary containers.
3.  **Level 2 (Float):** Glassmorphic surfaces using a `backdrop-filter: blur(12px)` and a semi-transparent background (e.g., `rgba(10, 10, 10, 0.7)`). These are reserved for navigation bars, modals, and hovering states.

Shadows should be "Ambient" and nearly invisible: a 0px 4px 20px shadow with 20% opacity using the #000 hex, intended only to separate floating elements from the surface.

## Shapes

The shape language is "Soft" yet disciplined. While fully sharp corners feel too aggressive and pill-shapes feel too consumer-focused, a subtle 0.25rem (4px) to 0.5rem (8px) radius provides a refined, modern feel that mirrors professional developer tools.

- **Small elements (Checkboxes, Tags):** 4px (rounded-sm)
- **Standard elements (Buttons, Inputs):** 8px (rounded-md)
- **Containers (Cards, Modals):** 12px (rounded-lg)

## Components

**Buttons**
- **Primary:** Solid Electric Blue with white text. No gradient, but a subtle 1px inner light border on the top edge to give a "tactile" feel.
- **Secondary:** Transparent background with a 1px #222 border. On hover, the border brightens to #444 or the Primary color.

**Cards**
- Background: #0A0A0A.
- Border: 1px solid #222.
- Interactive cards should feature a very subtle radial gradient flare that follows the mouse position (inspired by Stripe), highlighting the #222 border as it moves.

**Inputs & Fields**
- Background: #050505 (inset from the surface).
- Border: 1px solid #222.
- Focus State: Border color changes to Electric Blue with a subtle outer glow.

**Chips / Tags**
- Small, monospaced text (JetBrains Mono).
- Background: `rgba(255, 255, 255, 0.05)`.
- Border: 1px solid #222.

**Code Blocks**
- Syntax highlighting should use the accent palette (Cyan, Purple, Blue).
- Background should be slightly darker than the surface level to denote a "well" or "inset" feel.