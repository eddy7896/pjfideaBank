---
name: Ideabank by PiJam
description: A collaborative workspace to empower and democratize design-driven education across India
colors:
  primary: "#15425B"
  background: "#FFFFFF"
  foreground: "#111111"
  card: "#FFFFFF"
  muted: "#E3E3E3"
  border: "#DED8D3"
rounded:
  sm: "8px"
  md: "11px"
  lg: "14px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "#FFFFFF"
    rounded: "9999px"
    padding: "12px 24px"
---

# Design System: Ideabank by PiJam

## 1. Overview

**Creative North Star: "The Working Notebook, Rebranded Ideabank"**

The public-facing surface (homepage, Explore Ideas, idea detail, Share an Idea) carries the
Ideabank identity: white backgrounds, generous breathing room, deep teal actions, cyan photo
borders, warm grey panels, and small hand-drawn doodles concentrated on the homepage. The
authenticated product surface (dashboard, kanban, admin, onboarding) shares the same color and
type tokens for brand consistency but stays flat, dense, and restrained, matching the working
professional register a teacher or State Education Department officer expects daily. Decorative
motion and illustration stay on the public pages; the dashboard stays calm.

Key characteristics:
- **Flat and solid.** Cards are opaque surfaces with a 1px border. No `backdrop-blur` on structural UI.
- **One accent, everywhere consistent.** Ideabank Teal (`#15425B`) for primary actions, Accent Blue (`#4282A4`) for links and secondary emphasis, Cyan (`#8DE3F6`) reserved for photo/illustration borders and high-contrast dark-surface accents.
- **Color as information, kept separate.** The Design Thinking stage palette (Empathize/Define/Ideate/Prototype/Test) and status palette (approve/pending/reject) carry meaning on the dashboard side and are never reused as decoration.
- **Motion with a job.** Homepage scroll-reveals and hero collage floating are a designed moment; the dashboard's kanban drag and stage-gate advance remain the designed moments there. Everything else is fast and quiet.

## 2. Colors

### Brand
- **Ideabank Teal** — `#15425B`. Primary buttons, primary text-on-white emphasis, closing CTA panel fill. White text on this surface.
- **Accent Blue** — `#4282A4`. Links, focus rings, secondary icons/emphasis.
- **Cyan** — `#8DE3F6`. Photo/illustration borders, the cyan CTA button variant, dark-mode primary. Always paired with dark text (`#111111`) for contrast.
- **Panel Yellow** — `#F4C66B`. Occasional doodle accents (spark, underline) only — never a background for body text.

### Neutrals — Light
| Token | Value | Use |
|---|---|---|
| `background` | `#FFFFFF` | Page canvas |
| `foreground` | `#111111` | Body text |
| `card` | `#FFFFFF` | Solid card / dialog surface |
| `secondary` / warm panel | `#F4F2F1` | Section panels, teacher-support background |
| `muted` | `#E3E3E3` | Neutral button surface, disabled states |
| `muted-foreground` | `#3D3D3D` | Secondary text |
| `border` | `#DED8D3` | Warm divider / hairlines |
| `panel-info` | `#EDF7FA` | Selected-state and information panels |

### Neutrals — Dark
| Token | Value | Use |
|---|---|---|
| `background` | `#121517` | Page canvas |
| `foreground` | `#F2F0EE` | Body text |
| `card` | `#1A1E21` | Solid card / dialog surface |
| `muted` | `#2A2E31` | Secondary fills |
| `border` | `#35393C` | Hairlines |
| `primary` | `#8DE3F6` (cyan) | Brightened for dark-surface contrast, paired with dark text |

### Semantic (stage & status) — unchanged, separate channel
The five Design Thinking stage colors and three advance-request/audit status colors used on the
dashboard side are unchanged by the Ideabank rebrand (see the dashboard kanban and analytics
views) and are never reused as brand decoration. Ideabank's own four-stage vocabulary (Observed,
Ideating, Prototyping, Tested — used on idea cards and the idea detail page) uses its own icon +
label pairing rather than the dashboard's five-stage palette, since they describe different
processes.

### Named Rules
**The Rarity Rule.** Teal appears with intent — primary actions and emphasis, not decoration.

**The Warm Neutral Rule.** Public-facing surfaces use warm-toned neutrals (`#F4F2F1`, `#DED8D3`)
rather than cool grays, to keep the "notebook" warmth called for in the brand brief. Dashboard
surfaces keep their tinted-toward-227°-hue neutral rule.

**The Separate Channel Rule.** The Design Thinking stage/status palette never doubles as the
brand accent and the brand accent never appears in a stage badge.

## 3. Typography

**Heading font:** DM Sans (Google Fonts), `--font-heading`. Used for all headings and button labels site-wide.

**Body / UI font:** Inter (Google Fonts), `--font-sans`. Body copy, navigation, form labels.

**Devanagari font:** Noto Sans Devanagari, `--font-devanagari`. Used for the Hindi labels in the
homepage learning-journey section (सोचो / समझो / बनाओ / बदलो); always paired with the English
translation, never Hindi alone.

**Data / Identifier Font:** JetBrains Mono, `--font-mono`. Unchanged — reserved for dashboard
identifiers (Team IDs, PINs, UDISE codes, audit-log entity IDs).

### Hierarchy
- **Hero** (700, fluid `clamp(2.375rem, 6vw, 4rem)`, line-height 1.1): Homepage hero only.
- **Section heading** (700, fluid `clamp(1.875rem, 4vw, 3.25rem)`, line-height 1.12): Section intros.
- **Card heading** (600, 22–26px): Idea card and category tile titles.
- **Body** (400, 16–18px, line-height 1.55–1.7): Standard prose, capped at ~68ch.
- **Label** (600, 14–16px): Navigation, form labels, eyebrows (uppercase, tracking 0.12em).

### Named Rules
**The Flat Scale Rule.** Jump clearly between weight/size steps (minimum 1.25 ratio).

**The Two-Family Rule.** Ideabank intentionally runs two families (DM Sans display + Inter body)
rather than the dashboard's single-family rule, to read as a distinct public-facing register from
the working-notebook product surface. Never introduce a third.

## 4. Shape

- **Panels** (hero collage container, closing CTA, teacher-support background): 28–36px radius.
- **Cards** (idea cards, category tiles, learning-journey steps): 20–24px radius.
- **Inputs**: 12–16px radius.
- **Buttons and chips**: pill-shaped (`rounded-full`), via the Ideabank `IdeabankButton` and
  `CategoryChip` components — the shared `Button` primitive used by the dashboard keeps its own
  compact radius scale and is not pill-shaped.

## 5. Elevation

Unchanged from the dashboard system: depth comes from a 1px border plus a soft ambient shadow,
never blur. Idea cards lift up to 4px on hover with a slightly stronger border/shadow (see Motion).

## 6. Motion

Framer Motion, `MotionConfig reducedMotion="user"` set globally in `app/layout.tsx` — every
`whileInView`/`animate` transform and opacity animation is automatically stripped to its final
state when the visitor's OS requests reduced motion.

### Homepage-only designed moments
- **Scroll reveal**: fade + 24px upward move, ~550ms, ease `[0.16, 1, 0.3, 1]`, triggers once near viewport entry (`ScrollReveal` component).
- **Hero collage float**: 8px vertical drift, 7s ease-in-out loop, `lg:` breakpoint and `motion-safe` only (`motion-reduce:animate-none`).
- **Purpose statement**: word-level stagger reveal (45ms per word) — the full sentence is always present as real text for assistive tech; only the visual reveal is staggered.

### Everywhere (site-wide)
- Idea card hover: lift up to 4px, border shifts to accent blue, illustration scales ≤1.025.
- Buttons: 150–220ms color/shadow transition, `active:translate-y-px`.
- Nav links: underline reveal on hover/focus.

### Named Rules
**The Concentrated Decoration Rule.** Scroll-reveal stagger, hero float, and word-level reveal
are homepage-only. Explore Ideas, idea detail, and Share an Idea stay calm — fast fade/slide only.

## 7. Do's and Don'ts

### Do:
- **Do** use `IdeabankButton`, `CategoryChip`, `IdeaCard`, `StageBadge`, `SectionIntro`, and the
  other `components/ideabank/*` primitives for any new public-facing Ideabank UI, rather than
  hand-rolling new pill buttons or cards.
- **Do** keep Cyan (`#8DE3F6`) paired with dark text and reserved for borders/accents, not body backgrounds.
- **Do** mark decorative doodle SVGs `aria-hidden="true"`.
- **Do** show stage (Observed/Ideating/Prototyping/Tested) with both an icon and a text label, never color alone.

### Don't:
- **Don't** reuse the dashboard's five-stage Design Thinking palette for Ideabank's four-stage idea lifecycle, or vice versa — they are different vocabularies for different audiences.
- **Don't** use `backdrop-blur` on structural cards/panels.
- **Don't** add scroll-reveal stagger or hero-style motion to Explore Ideas, idea detail, or Share an Idea — those stay calm and scannable per the brief.
- **Don't** use em-dashes (`—`) or double-hyphens (`--`) in copy.
