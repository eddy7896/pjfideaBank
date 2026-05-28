---
name: Pi Jam Idea Bank
description: A collaborative workspace to empower and democratize design-driven education across India
colors:
  primary: "#5BA4C7"
  background: "#F8FAFC"
  foreground: "#0F172A"
  card: "#FFFFFF"
  muted: "#F1F5F9"
  border: "#E2E8F0"
rounded:
  sm: "6px"
  md: "8px"
  lg: "10px"
spacing:
  sm: "8px"
  md: "16px"
  lg: "24px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "#FFFFFF"
    rounded: "{rounded.lg}"
    padding: "12px 24px"
---

# Design System: Pi Jam Idea Bank

## 1. Overview

**Creative North Star: "The Digital Glass Lab"**

The visual language of the Pi Jam Idea Bank is designed to evoke a modern, tactile, and professional classroom laboratory environment. It shifts away from basic white panels toward dynamic, translucent glassmorphism overlays floating gracefully over high-fidelity animated gradient backdrops. This depth stimulates students' spatial curiosity, aligning with design-thinking, computational thinking, and hands-on making.

Key Characteristics:
- **Translucent Depth**: Translucent layout shells and cards overlaying floating fluid gradients.
- **Micro-Animated Feedbacks**: Fast, non-elastic scale-downs on active states to make the interface feel highly responsive.
- **Clean Structure**: Flat layouts with extremely fine slate borders for precise structural alignment.

## 2. Colors

The color palette centers on a single premium teal-blue brand accent, balanced with clean, high-contrast slate neutrals. 

### Primary
- **Pi Jam Teal-Blue** (#5BA4C7 / oklch(0.65 0.12 250)): Used exclusively for primary buttons, focus rings, active step indices, and state accents.

### Neutral
- **Slate Canvas** (#F8FAFC): The main page background providing a light, crisp environment.
- **Slate Ink** (#0F172A): High-contrast body text ensuring optimum readability.
- **Ice Glass** (#FFFFFF): Solid card backgrounds and dialog fills.
- **Slate Ice** (#F1F5F9): Muted tabs and secondary states.
- **Fine Border** (#E2E8F0): Hairline borders separating functional elements.

### Named Rules
**The Rarity Rule.** The primary accent Teal-Blue is used on ≤10% of any given dashboard screen. Its visual rarity is what creates instant structural focus.

**The Tinted Neutral Rule.** Fills and borders are tinted slightly toward the brand accent (utilizing slate-50/100/200 palettes) to avoid clinical, desaturated grays.

## 3. Typography

**Display Font:** Inter (with system sans-serif fallback)
**Body Font:** Inter (with system sans-serif fallback)
**Label/Mono Font:** JetBrains Mono (with system monospace fallback)

Typography leverages high contrast in size and weight rather than font family changes, creating a modern, editorial aesthetic.

### Hierarchy
- **Display** (Font Weight: 700, Size: clamp(2rem, 5vw, 3.5rem), Line Height: 1): Main hero headings.
- **Headline** (Font Weight: 600, Size: 1.875rem, Line Height: 1.2): Section entry points.
- **Title** (Font Weight: 500, Size: 1.25rem, Line Height: 1.3): Cards and block headers.
- **Body** (Font Weight: 400, Size: 0.975rem, Line Height: 1.5): Standard prose and descriptions (max line length 65ch).
- **Label** (Font Weight: 500, Size: 0.75rem, Case: uppercase, Letter Spacing: 0.05em): Captions and meta markers.

### Named Rules
**The Flat Scale Rule.** Avoid tiny incremental shifts in headings. Jump clearly between weights and sizes (minimum 1.25 ratio) to maintain hierarchy.

## 4. Elevation

The depth of the interface is conveyed through translucent layering and delicate HSL glassmorphism rather than heavy dark shadows.

### Shadow Vocabulary
- **Ambient Low** (`box-shadow: 0 4px 24px rgba(0,0,0,0.06)`): Default cards and dashboard panels.
- **Active Lift** (`box-shadow: 0 10px 30px rgba(0,0,0,0.12)`): Hovered buttons and dragged Kanban cards.

### Named Rules
**The Flat-By-Default Rule.** Elements sit flat on their glass canvas. Elevation increases only as a reactive state changes (such as hover scale shifts).

## 5. Components

Every component maintains rounded corners, fine borders, and interactive transitions.

### Buttons
- **Shape:** Soft roundness (10px / --radius-lg).
- **Primary:** Pi Jam Teal-Blue fill with white text, transitioning with `active:scale-[0.98]` micro-scaling.
- **Secondary:** Outlined with a fine slate border (#E2E8F0), shifting to a light primary tint on hover.

### Cards / Containers
- **Corner Style:** Rounded (10px / --radius-lg).
- **Background:** Solid Ice Glass (#FFFFFF) or glassmorphic acrylic overlays (`backdrop-blur-md bg-card/85 border-border/40 shadow-2xl`).
- **Border:** Ultra-fine 1px slate.

### Inputs / Fields
- **Style:** Light slate fills with fine borders, utilizing 10px rounded corners.
- **Focus:** Highlighted with a fine primary teal-blue outline ring.

## 6. Do's and Don'ts

### Do:
- **Do** use translucent glass cards (`backdrop-blur-md bg-card/85`) to overlay the floating fluid gradients.
- **Do** keep the brand Teal-Blue reserved for functional elements (buttons, active status, inputs).
- **Do** use standard 10px corner roundness consistently across all panels.

### Don't:
- **Don't** use colored accent stripes on borders greater than 1px (e.g. standard SaaS card left borders).
- **Don't** use gradient text treatments.
- **Don't** repeat identical card grids endlessly; vary columns and components to maintain rhythm.
- **Don't** default to modals; prioritize inline forms and layouts.
- **Don't** use em-dashes (`—`) or double-hyphens (`--`) in copy.
