# Product

## Register

product

## Users
School Admins (educators/teachers), Student Teams (performing design-thinking tasks in classrooms, often on shared low-power devices), field team staff (Teacher Trainers, Geography Leads), and State Education Department (SED) observers reviewing on office desktops. Roles span a real trust gradient: a student filling in a stage form and a government reviewer approving advanced-stage projects use the same interface for very different reasons.

## Product Purpose
A collaborative workspace to empower and democratize design-driven education and Computational Thinking across schools in India, allowing ideas to progress through structured Design Thinking validation stages while ensuring strict geographical scoping, session reports tracking, and lab-safety compliance audits.

## Brand Personality
Warm competence. The Pi Jam mark itself is playful, a hand-lettered wordmark and a grinning robot mascot, and that warmth is real and earned. But the working surface (dashboards, kanban, review queues) is where a teacher trusts the tool with real student data and a State Education Department officer trusts it enough to approve funding decisions. Reference lane: Linear's speed and restraint, Notion's calm structure, Airtable's disciplined use of color as information (status, stage) rather than decoration. The mascot's warmth shows up at the edges (onboarding, empty states, illustration) — not smeared across every card as glassmorphism and gradients.

## Anti-references
- Side-stripe borders greater than 1px as a colored accent on cards, lists, or alerts.
- Gradient text styles combining background-clip with transparent text colors.
- Glassmorphism as a structural default (`backdrop-blur` on ordinary cards/panels). Reserved for true transient overlays only, and even then rare. Two independent reasons, not just taste: it visually contradicts "warm competence," and `backdrop-blur` is real GPU cost on the shared low-power classroom laptops this product explicitly targets.
- Inter-as-default and any "safe pairing" font combo (Inter+Space Grotesk, Inter+Outfit) chosen because it's the obvious choice rather than because it fits this subject.
- Raw literal Tailwind color utilities (`text-slate-700`, `bg-amber-100`, `border-indigo-200`) applied ad hoc instead of the design tokens. Every color decision routes through the token set in DESIGN.md, no exceptions.
- Standard SaaS-cream metric templates (Big number, small label, gradient accent).
- Repetitive identical card grids.
- Modals as a default first-thought interaction pattern.
- Double-hyphens or em-dashes for separators.

## Design Principles
1. **Contextual Simplicity**: Onboarding and authentication flows must accommodate low-resource, shared classroom devices (e.g., student PIN-based bypass logins). Never assume a fast connection or a capable GPU.
2. **Restraint as Trust**: Color and motion are used sparingly and on purpose. A State Education Department reviewer or a school principal needs to read this as a serious tool, not a flashy one. One accent, used consistently, earns more credibility than five.
3. **Structured Validation**: Progression through the Design Thinking pipeline (Empathize → Define → Ideate → Prototype → Test) must feel physical and legible, step indicators and the school's approve/reject gate on student advance requests are load-bearing UI, not decoration.
4. **Absolute Geographical Isolation**: Data isolation and rollups (Geography → Sub-Geography → School → Team) must be completely secure and visually legible, the interface should make it obvious what scope of data a given user is looking at.
5. **Color as Information**: Where color carries meaning (Design Thinking stage, advance-request status, safety-audit pass/fail) it is a small, deliberately named semantic palette, separate from the one brand accent, and used consistently everywhere that meaning appears.

## Accessibility & Inclusion
WCAG AA contrast minimum, both themes. Real light and dark themes, properly designed (not a naive invert), since usage spans classroom-daylight, evening-at-home, and office-desktop contexts. Support screen readers. Motion respects `prefers-reduced-motion`, no elastic/bounce easing anywhere. Layout must stay usable on older/shared Android tablets and low-resolution classroom projectors, not just modern desktop viewports.
