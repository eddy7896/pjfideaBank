---
name: Pi Jam Idea Bank
description: A collaborative workspace to empower and democratize design-driven education across India
colors:
  primary: "#5BA4C7"
  background: "#FAFBFC"
  foreground: "#161B22"
  card: "#FFFFFF"
  muted: "#F0F3F6"
  border: "#DFE4EA"
rounded:
  sm: "6px"
  md: "8px"
  lg: "10px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "40px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "#FFFFFF"
    rounded: "{rounded.lg}"
    padding: "10px 20px"
---

# Design System: Pi Jam Idea Bank

## 1. Overview

**Creative North Star: "The Working Notebook"**

Pi Jam's own mark is a hand-lettered wordmark and a grinning robot mascot, warm and playful. The product it names is where a teacher logs real student data and a State Education Department officer approves real funding decisions. The working surface reads like a well-kept notebook a serious professional actually uses daily: flat, structured, unfussy, legible at a glance from across a classroom. Not a glass showroom. The mascot's warmth is real and shows up at the edges, onboarding illustration, empty states, an occasional gesture, never smeared across every card as a blur.

Reference lane: Linear's restraint and speed, Notion's calm document-like structure, Airtable's discipline about color meaning something (stage, status) rather than decorating.

Key characteristics:
- **Flat and solid.** Cards are opaque surfaces with a 1px border. No `backdrop-blur` on structural UI, full stop, both for the brand reason above and because blur is real GPU cost on the shared low-power classroom laptops this product targets.
- **One accent, everywhere consistent.** Pi Jam Teal-Blue, ≤10% of any screen, reserved for actions and active state. Never diluted by ad hoc Tailwind color utilities standing in for it.
- **Color as information, kept separate.** A small named semantic palette (Design Thinking stage, advance-request status, safety-audit pass/fail) carries meaning. It is not the brand accent and is not used decoratively.
- **Motion with a job.** A handful of designed moments (stage-gate advance, kanban drag, the approve/reject gate) get real motion attention. Everything else is fast and quiet.

## 2. Colors

Restrained strategy: tinted neutrals plus one accent. All neutrals are tinted toward the brand hue (~227°) at low chroma, per the rule below, so grays never read as clinical Tailwind defaults. Both light and dark are designed on purpose, dark is not light inverted.

### Primary
- **Pi Jam Teal-Blue** — `#5BA4C7` / `oklch(0.68 0.09 227)` light, brightened to `oklch(0.74 0.11 227)` on dark surfaces for the same perceived weight. Used exclusively for primary actions, focus rings, active step indices, and links. Never for decorative fills.

### Neutrals — Light
| Token | Value | Use |
|---|---|---|
| `background` | `oklch(0.985 0.004 227)` (`#FAFBFC`) | Page canvas |
| `foreground` | `oklch(0.22 0.015 227)` (`#161B22`) | Body text, never pure black |
| `card` | `oklch(1 0 0)` (`#FFFFFF`) | Solid card / dialog surface |
| `muted` | `oklch(0.955 0.006 227)` (`#F0F3F6`) | Secondary fills, disabled states |
| `border` | `oklch(0.89 0.007 227)` (`#DFE4EA`) | Hairlines |
| `muted-foreground` | `oklch(0.48 0.013 227)` (`#56606B`) | Secondary text |

### Neutrals — Dark
| Token | Value | Use |
|---|---|---|
| `background` | `oklch(0.19 0.012 227)` (`#14181F`) | Page canvas |
| `foreground` | `oklch(0.94 0.005 227)` (`#EAECEF`) | Body text, never pure white |
| `card` | `oklch(0.235 0.013 227)` (`#1C222B`) | Solid card / dialog surface, one step lighter than background |
| `muted` | `oklch(0.27 0.012 227)` (`#242B35`) | Secondary fills |
| `border` | `oklch(0.32 0.013 227)` (`#2D3540`) | Hairlines |
| `muted-foreground` | `oklch(0.68 0.012 227)` (`#9BA5B0`) | Secondary text |

### Semantic (stage & status) — separate channel from the brand accent
Used only where color carries real meaning: the five Design Thinking stages, the advance-request gate, safety-audit results. Each has a light and dark pairing, never applied outside these contexts.

| Meaning | Light | Dark |
|---|---|---|
| Empathize | `#C4841F` amber | `#D9A44E` |
| Define | `#7C5CD6` violet | `#9B84E0` |
| Ideate | `#C23B8A` magenta | `#D96BAE` |
| Prototype | `#D97530` orange | `#E69257` |
| Test | `#2F8F5C` green | `#4FAE7D` |
| Approved / pass | `#2F8F5C` green | `#4FAE7D` |
| Pending / awaiting review | `#A87B1F` ochre | `#D1A24E` |
| Rejected / fail | `#A3402B` brick | `#CC6B52` |

Deliberately no blue anywhere in this row: blue is the brand accent's hue family (~227°), so every stage color was chosen from the rest of the wheel to keep the Separate Channel Rule real rather than nominal.

### Named Rules
**The Rarity Rule.** Teal-Blue appears on ≤10% of any given screen. Its scarcity is what makes it register as "action" the instant it appears.

**The Tinted Neutral Rule.** Every neutral (background, card, muted, border) carries the same ~227° hue at chroma 0.005–0.013. No raw Tailwind `slate-*`, `gray-*`, `zinc-*`, or any other unrelated hue used as a stand-in neutral anywhere in the app.

**The Separate Channel Rule.** The semantic stage/status palette never doubles as the brand accent and the brand accent never appears in a stage badge. Mixing the two collapses "this is clickable" and "this is Prototype stage" into the same signal.

## 3. Typography

**UI Font (display, headline, title, body):** Public Sans (Google Fonts), with system sans-serif fallback. One family carries every register through weight and scale, not a second display face. Public Sans was built for civic and government digital services, a genuine fit for a tool used by State Education Departments, not a generic pick.

**Data / Identifier Font:** JetBrains Mono, with system monospace fallback. Reserved for things that are literally codes: student Team IDs, PINs, UDISE codes, audit-log entity IDs. If it's an identifier a person copies or types, it's mono; if it's prose, it's Public Sans.

### Hierarchy
- **Display** (700, `clamp(1.875rem, 4vw, 3rem)`, line-height 1.05): Landing/onboarding hero only. Rare, most screens never use it.
- **Headline** (600, 1.75rem, line-height 1.2): Page titles.
- **Title** (600, 1.125rem, line-height 1.3): Card and section headers.
- **Body** (400, 0.9375rem, line-height 1.55): Standard prose, max 65ch line length.
- **Label** (500, 0.75rem, uppercase, letter-spacing 0.06em): Captions, eyebrows, meta markers.
- **Mono** (JetBrains Mono, 400, 0.8125rem): Identifiers, codes, timestamps in data tables.

### Named Rules
**The Flat Scale Rule.** Jump clearly between weight/size steps (minimum 1.25 ratio). No half-point size creep between Title and Body.

**The One-Family Rule.** Hierarchy comes from weight and scale, not from switching typefaces mid-interface. A second display face is a tell, not a feature.

## 4. Elevation

Depth comes from a 1px border plus a soft ambient shadow, never from blur. Flat by default; lift is a reaction to a state change, not a resting state.

### Shadow Vocabulary
- **Resting** — no shadow, just `1px solid border`. Default for cards, panels, list rows.
- **Ambient Low** (`0 2px 8px oklch(0.22 0.015 227 / 0.06)`): Popovers, dropdowns, the sidebar.
- **Active Lift** (`0 8px 24px oklch(0.22 0.015 227 / 0.12)`): Hover on interactive cards, a dragged kanban card mid-flight.
- **Scrim** (`backdrop-blur` permitted here only): The dimmed background behind an open modal/dialog. The one legitimate use of blur in the whole system, it signals "everything behind this is temporarily inert," which is exactly what modals are for.

### Named Rules
**The Flat-By-Default Rule.** A card at rest has a border, not a shadow. Shadow appears only on hover, drag, or an explicitly floating layer (popover, dialog).

## 5. Motion

Framer Motion is already a dependency; use it for the moments that matter, not everywhere. Ease-out-quart/expo only, never spring/bounce/elastic. Respect `prefers-reduced-motion`.

### Designed moments (spend the budget here)
- **Kanban drag**: card lifts to Active Lift shadow + `scale(1.02)` on pick-up, settles with ease-out-quart on drop. Already partially present, extend it, it's the single most-touched interaction in the app.
- **Stage-gate advance**: when an idea moves stage (direct or approved), the stage badge transitions color and the timeline entry enters with a brief upward fade, this is the moment students and teachers are working toward, let it read as a small win.
- **Approve / reject gate**: the pending-review pill and the approve/reject buttons get a deliberate, calm transition, no celebration confetti, this is a review action for an adult, not a game completion.

### Everywhere else (stay quiet)
- Page and panel transitions: fast fade/slide, ≤150ms, ease-out-quart.
- Buttons: `active:scale-[0.98]`, no hover lift beyond the shadow token.
- Toasts, dropdowns, tooltips: standard shadcn/Radix defaults are already correct, don't add extra flourish.

### Named Rules
**The Two-Speed Rule.** Every animation is either a designed moment (above) or a fast utility transition (≤150ms). Nothing sits in between at a lazy 300–400ms "just because."

## 6. Components

### Buttons
- **Shape:** 10px radius (`--radius-lg`).
- **Primary:** Teal-Blue fill, white text, `active:scale-[0.98]`.
- **Secondary:** 1px border in `border` token, fills to a light Teal-Blue tint on hover, never a full color swap.
- **Destructive:** uses the semantic "Rejected/fail" red, not a separate ad hoc red.

### Cards / Containers
- **Corner:** 10px radius.
- **Background:** solid `card` token. No exceptions, no `/85` opacity, no `backdrop-blur`.
- **Border:** 1px `border` token, always visible at rest (this is the depth cue, not shadow).
- Nested cards are wrong; if a card needs a card inside it, one of them shouldn't be a card.

### Inputs / Fields
- Solid `muted` fill or `card` fill with 1px `border`, 10px radius.
- **Focus:** 2px ring in the Teal-Blue accent, visible, never removed for aesthetics.

### Stage & Status badges
- Pill shape, `muted` background tinted with the semantic color at low opacity, semantic-colored text and dot, never the brand accent.
- This is the one place the "Full palette" instinct is allowed, exactly five stage colors plus three status colors, named, and used nowhere else.

## 7. Do's and Don'ts

### Do:
- **Do** use solid card surfaces with a visible 1px border as the default depth cue.
- **Do** keep Teal-Blue reserved for actions, focus, and links, ≤10% of any screen.
- **Do** route every color decision through the tokens above, including in one-off pages like onboarding and activity forms.
- **Do** spend real Framer Motion craft on the kanban drag and the stage-advance gate specifically.
- **Do** design dark mode as its own decision (already specified above), not an auto-invert.

### Don't:
- **Don't** use `backdrop-blur` on any structural card, panel, or stepper, reserve it for the modal scrim only.
- **Don't** reach for a raw Tailwind color utility (`slate-700`, `amber-100`, `indigo-50`...) when a token exists for it.
- **Don't** use colored accent stripes on borders greater than 1px.
- **Don't** use gradient text treatments.
- **Don't** repeat identical card grids endlessly, vary columns and components to maintain rhythm.
- **Don't** default to modals, prioritize inline forms and layouts.
- **Don't** use em-dashes (`—`) or double-hyphens (`--`) in copy.
- **Don't** animate something just because Framer Motion is installed, if it's not a designed moment, keep it to a fast utility transition.
