---
name: Meridian Pool Care
description: Scroll-driven swamp-to-crystal pool rescue site — the Gaelworx sellable template for 150 pool-care company deployments.
colors:
  swamp-black: "#0a1208"
  deep-water: "#04141b"
  foam-white: "#f2fdfb"
  foam-bright: "#eafcfb"
  teal-link: "#63d3ca"
  teal-mid: "#5fd0c8"
  teal-bright: "#7fe3da"
  cta-gradient-from: "#8ef0e6"
  cta-gradient-to: "#2bb3a9"
  cta-ink: "#052026"
  algae-olive: "#aebd6d"
  crawl-gold: "#f4d13d"
  gaelworx-ember: "#ffb14d"
typography:
  display:
    fontFamily: "Bricolage Grotesque, sans-serif"
    fontSize: "clamp(3.25rem, 10.5vw, 9.375rem)"
    fontWeight: 700
    lineHeight: 0.92
    letterSpacing: "-0.03em"
  headline:
    fontFamily: "Bricolage Grotesque, sans-serif"
    fontSize: "clamp(2.375rem, 6vw, 5rem)"
    fontWeight: 700
    lineHeight: 0.98
    letterSpacing: "-0.025em"
  accent-serif:
    fontFamily: "Instrument Serif, serif"
    fontSize: "1.08em"
    fontWeight: 400
    letterSpacing: "normal"
  body:
    fontFamily: "Manrope, system-ui, sans-serif"
    fontSize: "clamp(0.9375rem, 1.3vw, 1.125rem)"
    fontWeight: 400
    lineHeight: 1.62
  label:
    fontFamily: "Manrope, system-ui, sans-serif"
    fontSize: "12px"
    fontWeight: 600
    letterSpacing: "0.28em"
  wordmark:
    fontFamily: "Grenze Gotisch, serif"
    fontSize: "13px"
    fontWeight: 700
    letterSpacing: "0.04em"
rounded:
  pill: "999px"
  lg: "24px"
  md: "16px"
  sm: "12px"
spacing:
  section-y: "clamp(80px, 12vh, 160px)"
  stack-gap: "clamp(16px, 3vw, 40px)"
  inline-pad: "clamp(22px, 5vw, 72px)"
components:
  button-cta:
    backgroundColor: "linear-gradient(135deg, {colors.cta-gradient-from}, {colors.cta-gradient-to})"
    textColor: "{colors.cta-ink}"
    rounded: "{rounded.pill}"
    padding: "17px 30px"
  button-cta-hover:
    backgroundColor: "linear-gradient(135deg, {colors.cta-gradient-from}, {colors.cta-gradient-to})"
    textColor: "{colors.cta-ink}"
  button-ghost:
    backgroundColor: "rgba(14,24,8,0.42)"
    textColor: "{colors.foam-bright}"
    rounded: "{rounded.pill}"
    padding: "17px 28px"
  chip:
    backgroundColor: "rgba(10,44,56,0.55)"
    textColor: "{colors.foam-bright}"
    rounded: "{rounded.pill}"
    padding: "11px 16px"
  card-plan:
    backgroundColor: "rgba(8,34,44,0.5)"
    textColor: "{colors.foam-white}"
    rounded: "{rounded.lg}"
    padding: "34px 30px"
  card-plan-featured:
    backgroundColor: "rgba(12,48,60,0.62)"
    textColor: "{colors.foam-white}"
    rounded: "{rounded.lg}"
    padding: "34px 30px"
  input:
    backgroundColor: "rgba(4,20,27,0.55)"
    textColor: "{colors.foam-bright}"
    rounded: "{rounded.sm}"
    padding: "15px 16px"
---

# Design System: Meridian Pool Care

## 1. Overview

**Creative North Star: "Swamp to Crystal"**

The whole site is one continuous rescue, staged as a scroll-driven journey rather than a
stack of marketing sections. It opens in a murky, half-lit swamp — algae-olive accents,
dim water, a WebGL surface the visitor scrolls *through* — and clears, screen by screen,
into bright teal crystal water as the Meridian story does its work. The system rejects
the pool-service category default (stock-photo blue water, franchise-brochure blandness)
and the generic AI-SaaS default (gradient text, tiny tracked eyebrows on every section,
identical icon-card grids, the hero-metric template) in the same motion: the drama comes
from the water motif itself, not from decoration layered on top of a template.

The numbered kickers that appear before major sections ("01 — Sound familiar?", "02 — The
turn", "03 — Every visit"…) are a **deliberate exception** to the general "no numbered
section eyebrows" rule: they number the actual chapters of one continuous rescue
narrative, in the order the visitor lives it, not decorative scaffolding stamped on
unrelated sections. Keep this numbering only where it tracks the real story arc; don't
propagate it as default eyebrow furniture onto sections that aren't part of that arc.

**Key Characteristics:**
- Dark, water-bound canvas (`#0a1208` / `#04141b`) that the WebGL scene and gradients sit inside, never a light or neutral background.
- Two-tier type voice: bold grotesque for statements, italic serif for the emotional turn inside the same sentence.
- Glass-on-water surfaces (translucent, blurred, teal-bordered) standing in for the "looking through water" motif — never decorative glassmorphism for its own sake.
- One reserved bright-teal gradient, spent only on primary CTAs, the featured plan ribbon, and the funnel badge's arrow — everywhere else accent reads as thin, desaturated teal on dark glass.
- A single ornamental gothic face (`Grenze Gotisch`) reserved exclusively for the Gaelworx wordmark in the funnel badge — never used for site content.

## 2. Colors

Two chemistries, not one palette: a cool teal-and-foam system that carries the "clean"
state, and a small warm system (olive-algae, crawl-gold, ember-orange) reserved for the
"still dirty" and "Gaelworx funnel" moments. They never blend into each other; the site's
whole arc is the cool system winning space from the warm one as you scroll.

### Primary
- **Teal Bright** (`#7fe3da`): hover state on links/nav, chip active ring, focus borders — the "clean water" accent at its most saturated outside the CTA gradient.
- **CTA Gradient** (`#8ef0e6` → `#2bb3a9`): reserved exclusively for primary action — hero/plan/contact submit buttons, the funnel badge's arrow chip. Paired with **CTA Ink** (`#052026`) as button text, never white-on-gradient. The endpoint is deliberately one step deeper than the accent teal — jewel-toned, not minty.

### Secondary
- **Teal Mid** (`#5fd0c8`): section kickers/eyebrows, credential-bar dividers — a quieter, more frequent teal for structural labels.
- **Teal Link** (`#63d3ca`): default link color across body copy (`a:hover` → Teal Bright).

### Tertiary (warm system — "still dirty" and funnel moments only)
- **Algae Olive** (`#aebd6d`): the hero's opening eyebrow pill and swamp-adjacent texture — the one warm note allowed in the otherwise-cool hero, marking "this is still swamp."
- **Crawl Gold** (`#f4d13d`): the Star-Wars-style "what grows while you wait" crawl section only — a warning-chapter color, never reused elsewhere.
- **Gaelworx Ember** (`#ffb14d`): the animated "ablaze" glow on the Gaelworx wordmark inside the claim-this-site funnel badge. Signals "this is the upsell," nowhere else.

### Neutral
- **Swamp Black** (`#0a1208`): page background, the floor every section sits on.
- **Deep Water** (`#04141b`): gradient vignette base layered over the WebGL scene.
- **Foam White** (`#f2fdfb`): headline ink, stat numbers — the brightest neutral, reserved for display type.
- **Foam Bright** (`#eafcfb`): UI text on dark glass (buttons, nav, form fields), text-selection color.
- Body copy runs as translucent foam (`rgba(236,246,228,.7–.82)` family) over the dark canvas rather than a flat gray, keeping every text color tied to the water hue instead of a generic neutral ramp.

### Named Rules
**The One Gradient Rule.** The bright teal CTA gradient appears in exactly three places: primary buttons, the featured plan's ribbon, and the funnel badge's arrow. It never becomes a background wash, a card border, or a decorative flourish — its rarity is what makes "press this" legible against acres of dark glass.

**The Forecast Strip Exception.** The Rescue Forecast's water strip is the one sanctioned non-CTA gradient family: a horizontal dirty-to-clean gradient (e.g. `#3d4a16 → #2a5a4e → #2bb3a9` for a swamp forecast) rendered through the `#waterRipple` displacement filter. It is narrative data-visualization — the site's entire swamp→crystal arc compressed into one strip — not decoration, and it is the only place warm may blend into cool inside a single element. It exists solely inside the forecast panel; reusing the treatment anywhere else demotes it to decoration and breaks both this rule and Warm-Means-Something.

**The Warm-Means-Something Rule.** Olive, gold, and ember never appear together with the cool teal system in the same section. Warm = still dirty (olive), still a warning (gold), or still a funnel (ember). If a new section needs warmth, ask which of those three stories it's telling before reaching for a hex value.

## 3. Typography

**Display Font:** Bricolage Grotesque (with system sans-serif fallback)
**Body Font:** Manrope (with system-ui fallback)
**Accent Font:** Instrument Serif, italic only

**Character:** Bricolage Grotesque carries every declarative statement — bold, tight, slightly condensed at display size. Instrument Serif italic never leads a sentence; it always lands on the second half, the emotional turn ("Green means stop. *Clear means go.*"). The pairing reads as confident-then-warm in a single breath, not two competing voices.

### Hierarchy
- **Display** (700, `clamp(3.25rem, 10.5vw, 9.375rem)`, line-height 0.92): hero statement only, one per page.
- **Headline** (700, `clamp(2.375rem, 6vw, 5rem)`, line-height 0.98): section titles ("Pick your peace of mind.").
- **Accent serif** (400 italic, `1.08em` relative to its parent): the punchline half of a two-part headline or hero line. Never a full heading on its own.
- **Body** (400, `clamp(0.9375rem, 1.3vw, 1.125rem)`, line-height 1.62): paragraph copy, max ~65ch measure via `max-width` constraints on the containing block.
- **Label** (600, 12–13px, letter-spacing 0.28em, uppercase): chapter kickers ("01 — Sound familiar?"), credential-bar text, plan eyebrow. Sparse by design — see Overview's numbered-kicker exception.
- **Wordmark** (700, 13px, letter-spacing 0.04em, `Grenze Gotisch`): the single reserved use is the "Gaelworx" name in the funnel badge. Never used for headlines, body, or any customer-facing content.

### Named Rules
**The Serif-Aside Rule.** Instrument Serif italic is a punctuation mark, not a typeface choice for whole headlines. If it's carrying more than half a sentence, it's being misused.

## 4. Elevation

Flat-on-dark by default; depth comes from **glass, not shadow**. Cards, the nav, the
funnel badge, and inputs all sit on translucent, blurred, thin-bordered surfaces — the
visual language of looking at something through the site's own water rather than
Material-style drop shadows on a light canvas. Where shadows do appear, they're colored
glows tied to the teal CTA hue (`rgba(30,180,170,…)`), not neutral black — a shadow here
always means "this is interactive/liftable," not generic elevation.

### Shadow Vocabulary
- **CTA glow** (`box-shadow: 0 10px 28px rgba(30,180,170,.42)`, intensifying to `0 16px 38px rgba(30,180,170,.55)` on hover): primary buttons only. Deliberately tight — smaller radius, higher alpha. A wide soft haze reads cheap; a controlled glow reads expensive.
- **Specular edge** (`inset 0 1px 0 rgba(255,255,255,.05)`): the top-edge light catch on every structural glass surface (plan cards, form card, testimonial figure, badge). Alpha never exceeds .05.
- **Badge lift** (`box-shadow: 0 16px 44px rgba(2,10,14,.55), inset 0 1px 0 rgba(255,255,255,.05)`): the funnel badge's resting elevation, deepening on hover.
- **Featured-plan glow** (`box-shadow: 0 24px 70px rgba(20,120,112,.22)`): marks the "Most Popular" plan card as elevated relative to its siblings.

### Named Rules
**The Glass-on-Water Rule.** `backdrop-filter: blur()` + a translucent teal-tinted background is the system's only depth cue for structural surfaces (nav, cards, inputs, badge). It's load-bearing to the water theme, not decorative glassmorphism — every other project should earn glass on its own merits, but here it *is* the elevation system.

## 5. Components

### Buttons
- **Shape:** full pill (`border-radius: 999px`) — every button on the site, no exceptions.
- **Primary (CTA):** `linear-gradient(135deg, #8ef0e6, #37c7bf)` background, `#052026` text, weight 600–700, `box-shadow` CTA glow. Hover lifts `translateY(-3px)` and deepens the glow.
- **Ghost/Secondary:** `rgba(14,24,8,.42)`–`rgba(12,52,66,.5)` translucent fill, 1px teal-tinted border (`rgba(150,230,225,.32)`), `#eafcfb` text. Hover only shifts background, never adds a shadow.

### Chips
- **Style:** pill, `rgba(10,44,56,.55)` background, 1px `rgba(150,230,225,.2)` border, `#eafcfb` text.
- **Active state:** a 2px solid `#7fe3da` ring drawn as an absolutely-positioned sibling element (`.pc-chip-ring`), toggled via `display`, not a border-width change — keeps the chip's own border stable while the ring reads as a distinct "selected" signal.

### Cards
- **Corner style:** 24px radius for plan/pricing cards, 16px for job/gallery cards.
- **Background:** translucent glass (`rgba(8,34,44,.5)` standard, `rgba(12,48,60,.62)` for the featured plan) with `backdrop-filter: blur(10–12px)`.
- **Border:** 1px `rgba(150,230,225,.18)` standard; the featured plan steps up to 1.5px `rgba(127,227,218,.55)` plus the featured-plan glow shadow.
- **Signature behavior:** the "Our Work" job gallery uses `flex` weighting (not `grid`) so cards grow/shrink on hover/tap into a horizontal accordion — a deliberate departure from a static grid for this one section.

### Inputs / Fields
- **Style:** 12px radius, `rgba(4,20,27,.55)` background, 1px `rgba(150,230,225,.22)` border, `#eafcfb` text, transparent placeholder tuned to the same 4.5:1 floor as body text.
- **Focus:** border shifts to teal accent (`#7fe3da` / `var(--accent, #5fd0c8)`), no shadow — consistent with the "glass, not shadow" elevation rule.

### Navigation
- Fixed top bar, transparent at rest, frosting in (`backdrop-filter` + background) as the visitor scrolls. Links in `#eafcfb`-family, hover to `#7fe3da`. Mobile collapses to a hamburger → full-bleed overlay menu with pill nav items (12px radius) and a bottom CTA pill.

### Claim-This-Site Badge (signature component)
Fixed bottom-right on every deployed page — the Gaelworx funnel embedded directly in the
product. A glass pill (badge-lift shadow) containing a spinning coin-favicon with a glint
sweep, the "Claim this site" label in Foam White, the "Gaelworx" wordmark in ember-glowing
`Grenze Gotisch`, and a small teal-gradient arrow chip. This is the one place all three
systems — cool teal, warm ember, and the gothic wordmark — appear together, because it's
the one place the "site sells the next site" story is being told directly.

## 6. Do's and Don'ts

### Do:
- **Do** keep the cool teal system (`#63d3ca` → `#7fe3da` → CTA gradient) as the only accent that reads as "clean water winning."
- **Do** reserve `Grenze Gotisch` for the Gaelworx wordmark only — it is a funnel signal, not a display typeface for site content.
- **Do** use glass surfaces (blur + translucent teal tint) as the elevation system; colored glow shadows only on genuinely interactive/lifted elements (CTAs, badge, featured plan).
- **Do** keep numbered chapter kickers ("01", "02"…) only on sections that are real, ordered beats of the swamp→crystal narrative.
- **Do** hold body-text contrast at ≥4.5:1 against the swamp-black/deep-water canvas even at the lower end of the translucent-foam range (`rgba(...,.7)` and up already clear this against `#0a1208`; don't drop opacity further to "quiet" a section).

### Don't:
- **Don't** introduce stock-photo blue-water treatments, franchise-brochure card grids, or generic "Get a Free Quote!" banner styling anywhere in the template — the whole point of this template is not looking like the pool-service category default.
- **Don't** use `background-clip: text` gradient text, side-stripe (`border-left`) accents, or a hero-metric template (big number + label + gradient) — cross-project AI-slop tells that would sit oddly against this system's own considered restraint.
- **Don't** stamp numbered eyebrows ("01 · About / 02 · Pricing") on sections that aren't part of the actual rescue narrative — that's the generic AI scaffolding this system's real chapter-numbering is deliberately not.
- **Don't** mix the warm system (olive/gold/ember) with the cool system inside one section, and don't invent a fourth warm hue without deciding which of the three warm stories (still-dirty, warning, funnel) it's telling.
- **Don't** apply glassmorphism decoratively outside structural surfaces (nav, cards, inputs, badge) — it's the theme's elevation system here, not a free-floating effect to sprinkle on new elements.
