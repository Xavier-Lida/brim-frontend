---
version: alpha
name: Cursor-design-analysis
description: Brim Financial dashboard — soft cold polar canvas (`#f6f9fc`) with light frost blues. Ink softened to `#3d4f61`. Primary Frost Blue lightened to `#7ba3c9` with pastel accents (`#e8f2fa`, `#d6e8f5`). Typography uses **Geist** at weight 400 (dashboard); marketing spec below retains CursorGothic reference. Cards use minimal hairlines, no shadows. Timeline/chart frost palette unchanged.

colors:
  primary: "#7ba3c9"
  primary-active: "#6a92b8"
  primary-soft: "#9ec5e8"
  ink: "#3d4f61"
  body: "#6b7c8f"
  body-strong: "#3d4f61"
  muted: "#eef4fa"
  muted-soft: "#6b7c8f"
  hairline: "#e2eaf3"
  hairline-soft: "#eef4fa"
  hairline-strong: "#d6e8f5"
  canvas: "#f6f9fc"
  canvas-soft: "#eef4fa"
  blue-soft: "#e8f2fa"
  blue-soft-strong: "#d6e8f5"
  blue-muted: "#b8d4ef"
  surface-card: "#ffffff"
  surface-strong: "#e8f2fa"
  on-primary: "#ffffff"
  timeline-thinking: "#88c0d0"
  timeline-grep: "#a3be8c"
  timeline-read: "#81a1c1"
  timeline-edit: "#b48ead"
  timeline-done: "#7ba3c9"
  semantic-error: "#bf616a"
  semantic-success: "#a3be8c"

typography:
  display-mega:
    fontFamily: "'CursorGothic', system-ui, 'Helvetica Neue', Helvetica, Arial, sans-serif"
    fontSize: 72px
    fontWeight: 400
    lineHeight: 1.1
    letterSpacing: -2.16px
  display-lg:
    fontFamily: "'CursorGothic', sans-serif"
    fontSize: 36px
    fontWeight: 400
    lineHeight: 1.2
    letterSpacing: -0.72px
  display-md:
    fontFamily: "'CursorGothic', sans-serif"
    fontSize: 26px
    fontWeight: 400
    lineHeight: 1.25
    letterSpacing: -0.325px
  display-sm:
    fontFamily: "'CursorGothic', sans-serif"
    fontSize: 22px
    fontWeight: 400
    lineHeight: 1.3
    letterSpacing: -0.11px
  title-md:
    fontFamily: "'CursorGothic', sans-serif"
    fontSize: 18px
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: 0
  title-sm:
    fontFamily: "'CursorGothic', sans-serif"
    fontSize: 16px
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: 0
  body-md:
    fontFamily: "'CursorGothic', sans-serif"
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: 0
  body-tracked:
    fontFamily: "'CursorGothic', sans-serif"
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: 0.08px
  body-sm:
    fontFamily: "'CursorGothic', sans-serif"
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: 0
  caption:
    fontFamily: "'CursorGothic', sans-serif"
    fontSize: 13px
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: 0
  caption-uppercase:
    fontFamily: "'CursorGothic', sans-serif"
    fontSize: 11px
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: 0.88px
    textTransform: uppercase
  code:
    fontFamily: "'JetBrains Mono', 'Fira Code', monospace"
    fontSize: 13px
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: 0
  button:
    fontFamily: "'CursorGothic', sans-serif"
    fontSize: 14px
    fontWeight: 500
    lineHeight: 1.0
    letterSpacing: 0
  nav-link:
    fontFamily: "'CursorGothic', sans-serif"
    fontSize: 14px
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: 0

rounded:
  none: 0px
  xs: 4px
  sm: 6px
  md: 8px
  lg: 12px
  xl: 16px
  pill: 9999px
  full: 9999px

spacing:
  xxs: 4px
  xs: 8px
  sm: 12px
  base: 16px
  md: 20px
  lg: 24px
  xl: 32px
  xxl: 48px
  section: 80px

components:
  top-nav:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.nav-link}"
    height: 64px
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.button}"
    rounded: "{rounded.md}"
    padding: 10px 18px
    height: 40px
  button-primary-active:
    backgroundColor: "{colors.primary-active}"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.md}"
  button-secondary:
    backgroundColor: "{colors.surface-card}"
    textColor: "{colors.ink}"
    typography: "{typography.button}"
    rounded: "{rounded.md}"
    padding: 9px 17px
    height: 40px
  button-tertiary-text:
    backgroundColor: transparent
    textColor: "{colors.ink}"
    typography: "{typography.button}"
  button-download:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.canvas}"
    typography: "{typography.button}"
    rounded: "{rounded.md}"
    padding: 12px 20px
    height: 44px
  hero-band:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.display-mega}"
    padding: 80px
  ide-mockup-card:
    backgroundColor: "{colors.surface-card}"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
    padding: 0
  ide-pane:
    backgroundColor: "{colors.canvas-soft}"
    textColor: "{colors.body}"
    typography: "{typography.code}"
    rounded: "{rounded.md}"
    padding: 16px
  feature-card:
    backgroundColor: "{colors.surface-card}"
    textColor: "{colors.ink}"
    typography: "{typography.title-md}"
    rounded: "{rounded.lg}"
    padding: 24px
  comparison-card:
    backgroundColor: "{colors.surface-card}"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    rounded: "{rounded.lg}"
    padding: 24px
  timeline-pill-thinking:
    backgroundColor: "{colors.timeline-thinking}"
    textColor: "{colors.ink}"
    typography: "{typography.caption-uppercase}"
    rounded: "{rounded.pill}"
    padding: 4px 10px
  timeline-pill-grep:
    backgroundColor: "{colors.timeline-grep}"
    textColor: "{colors.ink}"
    typography: "{typography.caption-uppercase}"
    rounded: "{rounded.pill}"
    padding: 4px 10px
  timeline-pill-read:
    backgroundColor: "{colors.timeline-read}"
    textColor: "{colors.ink}"
    typography: "{typography.caption-uppercase}"
    rounded: "{rounded.pill}"
    padding: 4px 10px
  timeline-pill-edit:
    backgroundColor: "{colors.timeline-edit}"
    textColor: "{colors.ink}"
    typography: "{typography.caption-uppercase}"
    rounded: "{rounded.pill}"
    padding: 4px 10px
  timeline-pill-done:
    backgroundColor: "{colors.timeline-done}"
    textColor: "{colors.on-primary}"
    typography: "{typography.caption-uppercase}"
    rounded: "{rounded.pill}"
    padding: 4px 10px
  code-block:
    backgroundColor: "{colors.surface-card}"
    textColor: "{colors.ink}"
    typography: "{typography.code}"
    rounded: "{rounded.lg}"
    padding: 20px
  pricing-tier-card:
    backgroundColor: "{colors.surface-card}"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    rounded: "{rounded.lg}"
    padding: 32px
  pricing-tier-featured:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.canvas}"
    typography: "{typography.body-md}"
    rounded: "{rounded.lg}"
    padding: 32px
  text-input:
    backgroundColor: "{colors.surface-card}"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    rounded: "{rounded.md}"
    padding: 12px 16px
    height: 44px
  badge-pill:
    backgroundColor: "{colors.surface-strong}"
    textColor: "{colors.ink}"
    typography: "{typography.caption-uppercase}"
    rounded: "{rounded.pill}"
    padding: 4px 10px
  cta-band:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.display-lg}"
    padding: 96px
  testimonial-card:
    backgroundColor: "{colors.surface-card}"
    textColor: "{colors.body}"
    typography: "{typography.body-md}"
    rounded: "{rounded.lg}"
    padding: 24px
  footer:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.body}"
    typography: "{typography.body-sm}"
    padding: 64px 48px
  footer-link:
    backgroundColor: transparent
    textColor: "{colors.body}"
    typography: "{typography.body-sm}"
---

## Overview

Cursor's marketing site reads as a quietly-confident developer brand that believes in editorial calm over IDE-darkness. The base canvas is **cold polar white-blue** (`{colors.canvas}` — #eceff4, Nord Snow Storm / DaisyUI `nord` base-100) holding cool Polar Night ink (`{colors.ink}` — #2e3440) for body and display alike. The single brand voltage is **Frost Blue** (`{colors.primary}` — #5e81ac, Nord Frost / DaisyUI `nord` primary) reserved for primary CTAs and the wordmark — used scarcely.

Type runs **CursorGothic** as the single sans family. Display sits at weight 400 with negative letter-spacing — a magazine-editorial voice rather than tech-bombastic. JetBrains Mono carries every code surface (and code surfaces are roughly half the page).

The brand's strongest visual signature is the **AI-timeline pill palette**: five frost-toned pills (cyan `{colors.timeline-thinking}`, sage `{colors.timeline-grep}`, blue `{colors.timeline-read}`, lavender `{colors.timeline-edit}`, frost `{colors.timeline-done}`) marking AI-action stages inside in-product timeline visualizations. Used only in product UI — never as system action colors.

**Key Characteristics:**
- Cold polar canvas (Nord Snow Storm #eceff4), not warm cream. Ink is cool Polar Night (#2e3440), not warm near-black.
- Single CTA color: `{colors.primary}` (Frost Blue #5e81ac). Used scarcely.
- Display weight stays at 400 — never bold. Magazine voice.
- AI timeline frost tones: 5 dedicated Nord-inspired tokens for in-product agent action stages.
- Compact 8px CTA radius — developer dialect.
- Hairline-only depth; no drop shadows.
- 80px section rhythm.

## Colors

### Brand & Accent
- **Frost Blue** (`{colors.primary}` — #5e81ac): Nord Frost / DaisyUI `nord` primary. Primary CTA pills, wordmark, hero accent. Used scarcely.
- **Frost Blue Active** (`{colors.primary-active}` — #4c7099): Press state.

### Surface
- **Canvas** (`{colors.canvas}` — #eceff4): Nord Snow Storm page floor (DaisyUI `nord` base-100).
- **Canvas Soft** (`{colors.canvas-soft}` — #e5e9f0): IDE-pane background inside mockups (DaisyUI `nord` base-200).
- **Surface Card** (`{colors.surface-card}` — #ffffff): Pure white card surface — slight contrast against the polar canvas.
- **Surface Strong** (`{colors.surface-strong}` — #d8dee9): Badges, tag pills (DaisyUI `nord` base-300).

### Hairlines
- **Hairline** (`{colors.hairline}` — #d8dee9): 1px divider (Nord4).
- **Hairline Soft** (`{colors.hairline-soft}` — #e5e9f0): Lighter divider (Nord5).
- **Hairline Strong** (`{colors.hairline-strong}` — #c0c7d4): Stronger panel outline.

### Text
- **Ink** (`{colors.ink}` — #2e3440): Display, body emphasis. Polar Night / DaisyUI `nord` base-content.
- **Body** (`{colors.body}` — #434c5e): Default running-text (Nord2).
- **Body Strong** (`{colors.body-strong}` — #2e3440): Same as ink.
- **Muted** (`{colors.muted}` — #4c566a): Sub-titles (Nord3 / DaisyUI `nord` neutral).
- **Muted Soft** (`{colors.muted-soft}` — #616e88): Disabled text.
- **On Primary** (`{colors.on-primary}` — #eceff4): Snow Storm text on Frost Blue.

### Timeline (AI-action signature)
- **Thinking** (`{colors.timeline-thinking}` — #88c0d0): Frost cyan (Nord8). Used inside in-product agent timeline only.
- **Grep** (`{colors.timeline-grep}` — #a3be8c): Sage (Nord14).
- **Read** (`{colors.timeline-read}` — #81a1c1): Frost blue (Nord9 / DaisyUI `nord` secondary).
- **Edit** (`{colors.timeline-edit}` — #b48ead): Lavender (Nord15 / DaisyUI `nord` info).
- **Done** (`{colors.timeline-done}` — #5e81ac): Frost blue (Nord10 / DaisyUI `nord` primary).

### Semantic
- **Success** (`{colors.semantic-success}` — #a3be8c): Confirmation indicators (Nord14 / DaisyUI `nord` success).
- **Error** (`{colors.semantic-error}` — #bf616a): Validation errors (Nord11 / DaisyUI `nord` error).

## Typography

### Font Family
**CursorGothic** is the licensed display + body family. Fallback: `system-ui, "Helvetica Neue", Helvetica, Arial, sans-serif`. Code surfaces switch to **JetBrains Mono**.

### Hierarchy

| Token | Size | Weight | Line Height | Letter Spacing | Use |
|---|---|---|---|---|---|
| `{typography.display-mega}` | 72px | 400 | 1.1 | -2.16px | Homepage hero h1 |
| `{typography.display-lg}` | 36px | 400 | 1.2 | -0.72px | Section heads |
| `{typography.display-md}` | 26px | 400 | 1.25 | -0.325px | Sub-section heads |
| `{typography.display-sm}` | 22px | 400 | 1.3 | -0.11px | Card group titles |
| `{typography.title-md}` | 18px | 600 | 1.4 | 0 | Component titles |
| `{typography.title-sm}` | 16px | 600 | 1.4 | 0 | List labels |
| `{typography.body-md}` | 16px | 400 | 1.5 | 0 | Default body |
| `{typography.body-tracked}` | 16px | 400 | 1.5 | 0.08px | Tracked editorial body |
| `{typography.body-sm}` | 14px | 400 | 1.5 | 0 | Footer body |
| `{typography.caption}` | 13px | 400 | 1.4 | 0 | Photo captions |
| `{typography.caption-uppercase}` | 11px | 600 | 1.4 | 0.88px | Section labels, timeline pill labels |
| `{typography.code}` | 13px | 400 | 1.5 | 0 | Code blocks — JetBrains Mono |
| `{typography.button}` | 14px | 500 | 1.0 | 0 | CTA pill labels |
| `{typography.nav-link}` | 14px | 500 | 1.4 | 0 | Top-nav menu |

### Principles
- **Display weight stays at 400.** Magazine voice, never bold.
- **Negative letter-spacing on display only.** -0.11px to -2.16px tracking.
- **JetBrains Mono on every code surface.**

### Note on Font Substitutes
CursorGothic is licensed. Open-source substitute: **Inter** at weight 400 with letter-spacing -1.5%. Or **GT Sectra** for a more editorial feel.

## Layout

### Spacing System
- **Base unit:** 4px.
- **Tokens:** `{spacing.xxs}` 4px · `{spacing.xs}` 8px · `{spacing.sm}` 12px · `{spacing.base}` 16px · `{spacing.md}` 20px · `{spacing.lg}` 24px · `{spacing.xl}` 32px · `{spacing.xxl}` 48px · `{spacing.section}` 80px.
- **Section padding:** 80px.

### Grid & Container
- Max content width: ~1200px.
- Editorial body: 12-column grid.
- Feature card grids: 2-up at desktop for splits, 3-up for benefits.
- Footer: 5-column at desktop.

### Whitespace Philosophy
Generous editorial pacing — closer to a print magazine than a tech site. The polar canvas has plenty of breathing room; cards within bands sit close (16-24px gap).

## Elevation & Depth

The system uses **hairline-only depth**. No drop shadows, no elevation tiers. Cards float above the canvas via 1px hairlines and the slight white-on-polar contrast.

| Level | Treatment | Use |
|---|---|---|
| Flat (canvas) | `{colors.canvas}` (#eceff4) | Body bands, footer |
| Card | `{colors.surface-card}` (#ffffff) | Content cards |
| Hairline border | 1px `{colors.hairline}` | Card outlines, dividers |
| IDE pane | `{colors.canvas-soft}` (#e5e9f0) | Inside IDE mockup cards |

### Decorative Depth
- **IDE-mockup cards** are the only "elevated" element. White card on polar canvas with internal pane structure mimicking the actual Cursor editor.
- **Timeline frost pills** add chromatic depth without surface elevation.

## Shapes

### Border Radius Scale

| Token | Value | Use |
|---|---|---|
| `{rounded.none}` | 0px | Reserved |
| `{rounded.xs}` | 4px | Inline tags |
| `{rounded.sm}` | 6px | Compact rows |
| `{rounded.md}` | 8px | CTA buttons, form inputs |
| `{rounded.lg}` | 12px | Cards, IDE panes |
| `{rounded.xl}` | 16px | Larger feature cards (rare) |
| `{rounded.pill}` | 9999px | Timeline pills, badges |
| `{rounded.full}` | 9999px | Avatars (rare) |

## Components

### Top Navigation

**`top-nav`** — Background `{colors.canvas}`, text `{colors.ink}`, height 64px. Layout: Cursor wordmark left, primary horizontal menu (Pricing / Features / Enterprise / Blog / Forum / Careers), Sign In + Download primary CTA right.

### Buttons

**`button-primary`** — The signature Frost Blue CTA. Background `{colors.primary}`, text `{colors.on-primary}`, type `{typography.button}` (14px / 500), padding 10px × 18px, height 40px, rounded `{rounded.md}` (8px).

**`button-primary-active`** — Press state. Background `{colors.primary-active}`.

**`button-secondary`** — White card pill on polar canvas. Background `{colors.surface-card}`, text `{colors.ink}`, 1px `{colors.hairline-strong}` border.

**`button-tertiary-text`** — Inline ink text link.

**`button-download`** — Larger ink-canvas CTA. Background `{colors.ink}`, text `{colors.canvas}`, padding 12px × 20px, height 44px. Used for "Download for macOS" type CTAs.

### Hero & IDE Mockups

**`hero-band`** — Background `{colors.canvas}`, full-width display headline in `{typography.display-mega}` (72px / 400 / -2.16px), subhead in `{typography.body-md}`, two CTAs (`button-download` + `button-tertiary-text`), and a centered IDE-mockup card below the hero copy.

**`ide-mockup-card`** — A white card containing a multi-pane IDE mockup (sidebar + main editor + chat panel + terminal). Background `{colors.surface-card}`, rounded `{rounded.lg}` (12px), 1px `{colors.hairline}` border, no padding (panes fill the card edge-to-edge).

**`ide-pane`** — Individual IDE pane inside the mockup. Background `{colors.canvas-soft}`, text `{colors.body}` in `{typography.code}` (JetBrains Mono 13px), rounded `{rounded.md}` (8px), padding 16px.

### Cards

**`feature-card`** — Background `{colors.surface-card}`, text `{colors.ink}`, type `{typography.title-md}`, rounded `{rounded.lg}`, padding 24px. 1px `{colors.hairline}` border.

**`comparison-card`** — Side-by-side "Cursor vs other tools" card. Same surface and rounding; internally split into 2 columns.

**`testimonial-card`** — Quote card. Background `{colors.surface-card}`, text `{colors.body}`, rounded `{rounded.lg}`, padding 24px.

### AI Timeline (signature)

**`timeline-pill-thinking`** — Frost cyan pill. Background `{colors.timeline-thinking}`, text `{colors.ink}`, type `{typography.caption-uppercase}` (11px / 600 / 0.88px tracking, uppercase), rounded `{rounded.pill}`, padding 4px × 10px. Marks "Thinking" stage in product timeline.

**`timeline-pill-grep`** — Sage pill. Same shape, background `{colors.timeline-grep}`. Marks "Grepping" stage.

**`timeline-pill-read`** — Frost-blue pill. Background `{colors.timeline-read}`. Marks "Reading" stage.

**`timeline-pill-edit`** — Lavender pill. Background `{colors.timeline-edit}`. Marks "Editing" stage.

**`timeline-pill-done`** — Frost pill. Background `{colors.timeline-done}`, text `{colors.on-primary}`. Marks "Done" stage.

### Code

**`code-block`** — Inline code block. Background `{colors.surface-card}`, text `{colors.ink}` in `{typography.code}`, rounded `{rounded.lg}`, padding 20px, 1px `{colors.hairline}` border.

### Pricing

**`pricing-tier-card`** — Background `{colors.surface-card}`, rounded `{rounded.lg}`, padding 32px, 1px `{colors.hairline}` border.

**`pricing-tier-featured`** — Featured tier inverts to ink. Background `{colors.ink}`, text `{colors.canvas}`. Same shape, dark inversion signals "highlighted" without colored ribbon.

### Forms & Tags

**`text-input`** — Background `{colors.surface-card}`, text `{colors.ink}`, rounded `{rounded.md}` (8px), padding 12px × 16px, height 44px.

**`badge-pill`** — Small uppercase pill. Background `{colors.surface-strong}`, text `{colors.ink}`, type `{typography.caption-uppercase}`, rounded `{rounded.pill}`, padding 4px × 10px.

### CTA / Footer

**`cta-band`** — Pre-footer "Try Cursor now" band. Background `{colors.canvas}`, centered display headline in `{typography.display-lg}`, single Frost Blue CTA. 96px vertical padding.

**`footer`** — Closing footer. Background `{colors.canvas}`, text `{colors.body}`. 5-column link list. 64×48px padding.

**`footer-link`** — Background transparent, text `{colors.body}`, type `{typography.body-sm}`.

## Do's and Don'ts

### Do
- Reserve `{colors.primary}` (Frost Blue) for primary CTAs and brand wordmark.
- Keep display weight at 400. The editorial voice depends on this.
- Use the polar `{colors.canvas}` page floor (Nord Snow Storm) — cards may be pure white for contrast.
- Render every code surface (inline, blocks, IDE panes) in JetBrains Mono.
- Use timeline frost tones only inside in-product agent visualizations — never as system action colors.

### Don't
- Don't introduce a secondary brand action color. Frost Blue is the only one.
- Don't drop display to bold weights (700+). Magazine voice depends on 400.
- Don't add drop shadows. Hairlines + ink-on-polar contrast carry the depth.
- Don't use timeline frost tones on non-timeline UI. They're scoped to the agent timeline only.
- Don't extract a CTA color from a third-party widget (cookie consent, OneTrust). The brand's CTA is what appears on actual product CTAs.
- Don't reintroduce warm cream or orange tones — the palette stays cold Nord / DaisyUI `nord`.

## Responsive Behavior

### Breakpoints

| Name | Width | Key Changes |
|---|---|---|
| Mobile | < 640px | Hero h1 72→32px; IDE mockup collapses to single pane preview; feature grid 1-up; nav hamburger. |
| Tablet | 640–1024px | Hero h1 56px; IDE mockup compresses; feature grid 2-up. |
| Desktop | 1024–1280px | Full hero h1 72px; full multi-pane IDE mockup; feature grid 3-up. |
| Wide | > 1280px | Content caps at 1200px. |

### Touch Targets
- Primary CTA at 40px height — at WCAG AA, padded for AAA.
- Download CTA at 44px — at AAA.

### Collapsing Strategy
- Top nav switches to hamburger below 768px.
- IDE mockup multi-pane collapses to a single primary pane preview on mobile.
- Feature grid: 3-up → 2-up → 1-up.

## Iteration Guide

1. Focus on a single component at a time.
2. CTAs default to `{rounded.md}` (8px). Cards use `{rounded.lg}` (12px).
3. Variants live as separate entries inside `components:`.
4. Use `{token.refs}` everywhere — never inline hex.
5. Hover state never documented.
6. CursorGothic 400 for display, 400/500/600 for body. JetBrains Mono on every code surface.
7. Frost Blue stays scarce.
8. Timeline frost tones stay scoped to in-product agent visualizations.

## Known Gaps

- CursorGothic is a licensed typeface; Inter is the substitute.
- Animation timings (timeline pill entrance, IDE pane reveal) out of scope.
- In-app surfaces (code editor, chat panel, agent timeline) only partially captured via marketing IDE mockups.
- Form validation states beyond focus not visible on captured surfaces.
