<!-- SEED: re-run /impeccable document once there's code to capture the actual tokens and components. -->

# Design System: Sniffari

## 1. Overview

**Creative North Star: "The Golden Hour Playdate"**

Sniffari's visual system is built around the warmth and openness of a sunset park meetup. The design is playful without being childish — rounded everything, bouncy motion, and a Committed orange-pink color that carries significant surface area rather than hiding behind neutrals.

The system is informed by community-first apps like Strava (achievement dopamine, orange-forward identity) but actively rejects the dry, corporate feel of generic SaaS dashboards. Every screen should feel like a warm invitation, not a utility panel.

**Key Characteristics:**
- Warm orange-pink carries 30–60% of surfaces — Committed color strategy
- Rounded, soft geometry throughout (no sharp corners, no harsh edges)
- Bouncy motion with exponential easing — 150–250ms for state changes, playful choreography for celebrations
- Photo-first cards with generous whitespace and minimal chrome
- Species-adaptive copy and visual tone per pet type

## 2. Colors: The Golden Hour Palette

**The Committed Color Rule.** The primary orange-pink carries 30–60% of visible surface area, not just accent points. This is not a neutral canvas with a pop of color; the color IS the canvas.

- **Warm Coral (Primary):** [to be resolved during implementation] — dominant surface color for buttons, headers, active states, key surfaces
- **Deep Ember (Primary-Dark):** [to be resolved during implementation] — hover/active states, text on light coral surfaces
- **Soft Blush (Surface):** [to be resolved during implementation] — secondary surfaces, card backgrounds on coral sections
- **Cream (Neutral-Bg):** [to be resolved during implementation] — general page backgrounds, content areas
- **Warm Ink (Text):** [to be resolved during implementation] — body text, high-importance labels
- **Muted Clay (Muted):** [to be resolved during implementation] — secondary text, borders, dividers

**The No-Gray Rule.** Gray text on Sniffari's warm backgrounds looks washed out. Muted elements use a desaturated version of the background's own hue, not neutral #888 gray.

## 3. Typography

**Direction:** Rounded playful sans — warm, friendly, approachable. A single family for all roles.

**Headings:** [font pairing to be chosen at implementation] — rounded sans, bold weight, for display and headlines
**Body:** [font pairing to be chosen at implementation] — same rounded sans family, regular weight
**Labels/Buttons:** [font pairing to be chosen at implementation] — medium weight, slightly tighter tracking

**Character:** Friendly without being cartoonish. The roundness adds warmth, not childishness. Single-family system keeps the app UI tight and professional.

## 4. Elevation

**The Flat-by-Default, Layered-on-Need Rule.** Surfaces sit flat at rest. Depth is conveyed through color layering (darker/warmer tones for foreground) rather than shadows. Shadows appear only for interactive elevation — modals, sheets, and the swipe card being dragged.

- **Swipe Card Drag** — shadow expands and deepens as card lifts during drag
- **Match Celebration Modal** — modal backdrop with a warm overlay blur
- **Bottom Sheet / Drawer** — slight top shadow to separate from content

## 5. Components

[No components yet — to be documented after implementation. Re-run `/impeccable document` once components exist.]

## 6. Do's and Don'ts

### Do:
- **Do** use warm coral as a dominant surface color, not just an accent — the Committed strategy
- **Do** round all corners generously (aim for `rounded-2xl` as default card radius)
- **Do** keep photo content large and chrome minimal on cards
- **Do** adapt visual tone and copy per pet species
- **Do** use warm tonal variants for muted elements instead of neutral gray

### Don't:
- **Don't** look like a generic SaaS dashboard — no sterile card grids, no muted corporate blues, no heavy data tables
- **Don't** use gray text on warm backgrounds — always tint muted toward the background hue
- **Don't** use sharp corners or thin border accents
- **Don't** use human dating app tropes (flames, hearts as primary icon, romantic copy)
- **Don't** over-decorate buttons or invent non-standard affordances — product UI earns familiarity
- **Don't** animate layout properties for choreography — use transforms and opacity only
- **Don't** gate content behind reveal animations — motion enhances, never hides
