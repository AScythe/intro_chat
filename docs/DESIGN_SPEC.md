# Design Spec — IntroChat

> **Last updated:** 2026-05-31 20:15 EDT

## Aesthetic Direction

**"Warm Sanctuary"** — A cozy, softly-lit corner at a loud party. The UI feels like a well-loved reading nook: warm lighting, soft curves, tactile surfaces, and generous breathing room. It's not minimalist coldness or maximalist chaos — it's intentional warmth that makes introverts feel safe enough to lean in.

The visual identity mirrors the product promise: *low-pressure, gentle connection*. Every design choice — from the cream-paper background to the warm serif headings to the soft card shadows — reinforces that this is a safe space.

---

## Color System

### Light Mode

| Token | Hex | Role |
|-------|-----|------|
| `--background` | `#FDFBF7` | Cream paper — warm off-white page bg |
| `--foreground` | `#2D2A24` | Warm dark brown body text |
| `--card` | `#FFFFFF` | White card surface |
| `--card-foreground` | `#2D2A24` | Card text |
| `--primary` | `#A8B5A2` | Sage green — primary actions |
| `--primary-foreground` | `#FFFFFF` | Text on primary |
| `--secondary` | `#E8E0D8` | Warm taupe — secondary surfaces |
| `--secondary-foreground` | `#2D2A24` | Text on secondary |
| `--accent` | `#C4956B` | Warm caramel — accent/highlights |
| `--accent-foreground` | `#FFFFFF` | Text on accent |
| `--muted` | `#F0EBE3` | Muted warm beige |
| `--muted-foreground` | `#8A8378` | Muted text |
| `--destructive` | `#D4A0A0` | Soft rose — errors/destructive |
| `--destructive-foreground` | `#FFFFFF` | Text on destructive |
| `--border` | `#E5DDD4` | Soft warm border |
| `--input` | `#E5DDD4` | Input border |
| `--ring` | `#A8B5A2` | Focus ring (sage) |
| `--radius` | `1rem` | Corner radius |

### Dark Mode

| Token | Hex | Role |
|-------|-----|------|
| `--background` | `#1C1A17` | Warm near-black page bg |
| `--foreground` | `#E8E0D8` | Warm off-white body text |
| `--card` | `#2A2722` | Dark card surface |
| `--card-foreground` | `#E8E0D8` | Card text |
| `--primary` | `#8A9B84` | Muted sage (dark mode) |
| `--primary-foreground` | `#1C1A17` | Text on primary |
| `--secondary` | `#3D3831` | Dark warm taupe |
| `--secondary-foreground` | `#E8E0D8` | Text on secondary |
| `--accent` | `#B8845C` | Warm caramel (dark mode) |
| `--accent-foreground` | `#1C1A17` | Text on accent |
| `--muted` | `#2A2722` | Muted dark |
| `--muted-foreground` | `#9C9488` | Muted text (dark mode) |
| `--destructive` | `#B88484` | Soft rose (dark mode) |
| `--destructive-foreground` | `#1C1A17` | Text on destructive |
| `--border` | `#3D3831` | Dark border |
| `--input` | `#3D3831` | Input border |
| `--ring` | `#8A9B84` | Focus ring (muted sage) |

---

## Typography Scale

| Level | Font | Weight | Size | Line Height | Usage |
|-------|------|--------|------|-------------|-------|
| Display | DM Serif Display | 400 | 2rem (32px) | 1.2 | Hero headings, page titles |
| H1 | DM Serif Display | 400 | 1.5rem (24px) | 1.3 | Section headings |
| H2 | Sora | 600 | 1.25rem (20px) | 1.4 | Card titles, modal headers |
| Body | Sora | 400 | 1rem (16px) | 1.6 | Paragraphs, descriptions |
| Body-Small | Sora | 400 | 0.875rem (14px) | 1.5 | Labels, secondary text |
| Caption | Sora | 500 | 0.75rem (12px) | 1.4 | Timestamps, helper text |

**Pairing rationale:** DM Serif Display brings warmth, character, and a literary feel — perfect for an app about thoughtful connection. Sora (already in use) stays for body text where its clean geometric form ensures readability across all weights and sizes. The serif + sans pairing creates a recognizable hierarchy at a glance.

**Import:** DM Serif Display via Google Fonts weight 400 only (body stays with Sora which is already imported).

---

## Motion Principles

| Moment | Pattern | Timing | Easing |
|--------|---------|--------|--------|
| Page enter | Fade-up (translateY(8px) → 0) | 0.4s | ease-out |
| Page exit | Fade-out (opacity 1 → 0) | 0.2s | ease-in |
| Card hover | TranslateY(-2px) + shadow deepen | 0.2s | ease-out |
| Button hover | Brightness 1.05 | 0.15s | ease-out |
| Stagger children | 50ms delay per child | — | — |
| Toast enter | Slide-in from right | 0.3s | ease-out |
| Toast exit | Fade + slide-right | 0.2s | ease-in |
| Progress step | Scale pulse on active step | 0.3s | ease-out |

**Library:** framer-motion via `motion` package (already planned for install). CSS transitions for hover/focus states.

---

## Layout Philosophy

- **Centered column** with max-width 660px (keep existing `max-w-app`)
- **Generous whitespace:** section spacing 2.5rem, card padding 1.5-2rem
- **Soft cards** with `border-radius: 1rem`, subtle `box-shadow: 0 4px 20px rgba(0,0,0,0.06)`
- **Minimal chrome:** no heavy headers or sidebars — the content is the interface
- **Vertical rhythm:** consistent bottom margins via spacing scale
- **Mobile-first:** single column at all widths; cards fill available space on small screens

---

## Design Token Mapping

| Spec Element | HSL Value | CSS Variable | tailwind.config.js |
|-------------|-----------|-------------|-------------------|
| Background light | 40 30% 97% | `--background` | `colors.background` |
| Foreground light | 40 5% 16% | `--foreground` | `colors.foreground` |
| Card light | 0 0% 100% | `--card` | `colors.card` |
| Primary (sage) light | 105 12% 67% | `--primary` | `colors.primary.DEFAULT` |
| Accent (caramel) light | 30 40% 60% | `--accent` | `colors.accent.DEFAULT` |
| Secondary (taupe) light | 30 20% 88% | `--secondary` | `colors.secondary.DEFAULT` |
| Muted light | 35 20% 92% | `--muted` | `colors.muted.DEFAULT` |
| Destructive (rose) light | 0 33% 73% | `--destructive` | `colors.destructive.DEFAULT` |
| Border light | 30 20% 86% | `--border` | `colors.border` |
| Background dark | 40 10% 10% | (varies per `:root.dark`) | — |
| Foreground dark | 30 20% 88% | (varies per `:root.dark`) | — |
| Card dark | 40 10% 16% | (varies per `:root.dark`) | — |
| Font family heading | — | — | `fontFamily.heading` |
| Font family body | — | — | `fontFamily.sans` |
| Border radius | — | `--radius` | `borderRadius.lg` |
| Card shadow | — | — | `boxShadow.soft` |
| Container max-width | — | — | `maxWidth.content` |
| Transition duration | — | `--transition-duration` | — |

**Note:** All HSL values are derived from the hex colors in the Color System section above. The `:root.dark` selectors will define dark mode CSS variables at the same HSL structure with darkened values.

---

## Dark Mode

- Toggle via `prefers-color-scheme` media query + manual `.dark` class on `<html>`
- Toggle button in app footer or settings
- All CSS variables have light/dark values defined — no surprise contrast issues
- Focus ring and interactive states maintain WCAG AA contrast in both modes
