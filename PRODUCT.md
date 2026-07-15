# Product

## Register

brand

## Users

Two audiences, in sequence:

1. **Pool-care company owners** (the direct customer) — small/family-run local operators
   deciding whether to buy a done-for-them website. They're evaluating credibility, ROI,
   and how quickly it converts visitors into booked jobs. They land on `get-this-site.html`
   and `premium-ideas.html` via the "Claim this site — by Gaelworx" funnel badge carried on
   every deployed site.
2. **Homeowners with a pool problem** (the deployed site's end visitor) — often arriving
   with an urgent, embarrassing problem (a swamped, green, unusable pool) rather than
   routine maintenance shopping. Job to be done: get a fast, trustworthy fix booked with
   minimal friction (no long contracts, clear pricing, local presence).

## Product Purpose

A single production-ready template (this repo) deployed 150 times as personalized,
conversion-focused websites for independent pool-care companies. Each deployment funnels
its own local homeowners toward booking service, while also carrying a built-in upsell
funnel back to Gaelworx (the template's own top-of-funnel: every live site is a demo that
sells the next site). Success = high visitor→lead conversion on deployed sites, and a
template flexible enough to personalize per-customer (branding, service area, pricing,
photos) without hand-editing snowflake code — per [[gaelworx-forge-project]] and the fleet
strategy in `docs/STRATEGY.md`.

## Brand Personality

**Rescue, premium, local.** The story is emergency rescue, not routine upkeep: a swamped,
green, unswimmable pool brought back to swim-ready in days, told with cinematic
swamp→crystal-water motion (WebGL) rather than stock-photo blue water. "Premium" reads in
restraint and craft (gothic display accents, coin/badge motifs, precise motion), not in
loud SaaS flourish. "Local" keeps it grounded and trustworthy for a family-run operator —
license numbers, service-area specificity, no-contract plainness — so the premium framing
never tips into corporate or impersonal.

## Anti-references

- **Generic pool-service sites**: stock-photo blue water, cheap franchise-brochure layouts,
  generic "Get a Free Quote!" banner-ad energy. This template's entire reason to exist is
  looking nothing like the pool-service category default.
- **Generic AI-SaaS aesthetic**: gradient text, tiny uppercase tracked eyebrows over every
  section, numbered 01/02/03 scaffolding, identical icon+heading card grids, the
  hero-metric template. These are cross-category tells regardless of the pool niche and
  are banned outright (see SKILL.md Absolute bans).
- Both apply at once: avoid the category cliché AND the AI-slop cliché, not just one.

## Design Principles

1. **Rescue narrative over feature list** — every section should read as progress toward
   "swim-ready," not a menu of generic service bullets.
2. **Premium through restraint and motion, not ornament** — craft comes from the
   swamp→crystal scroll experience, typography, and precise micro-interactions, not from
   piling on decoration.
3. **One template, many voices** — structure and system stay fixed across all 150
   deployments; only the config overlay (branding, copy, pricing, photos, service area)
   changes. Never hand-edit a "snowflake" site.
4. **The funnel is part of the design** — the Gaelworx "Claim this site" badge and upsell
   pages are load-bearing product surfaces, not an afterthought bolted onto a customer
   template.
5. **Local trust signals stay legible** — license numbers, no-contract terms, and
   service-area specificity must never be sacrificed for visual drama.

## Accessibility & Inclusion

WCAG AA baseline: contrast ratios (4.5:1 body / 3:1 large text) hold even against the dark
swamp-green (`#0a1208`) and teal-accent (`#63d3ca`/`#7fe3da`) palette; full keyboard
navigation; `prefers-reduced-motion` alternative for the WebGL water scene, scroll-driven
reveals, and marquee/crawl animations. This is a commercial lead-gen site deployed at fleet
scale, so AA is the floor, not a stretch goal, across all 150 customer deployments.
