# Gaelworx Fleet Strategy — Meridian Pool Care Template

**One template. 150 deployments. A hub-and-spoke data network that makes every site smarter over time.**

This document captures the go-to-market and operating strategy for the Meridian Pool Care
website template in this repository.

---

## 1. The play in one paragraph

We sell this website 150 times to independent pool-care companies. Each customer gets a
fully set-up, personalized deployment of this template **plus their own isolated database
instance** — their leads, bookings, and analytics live in a database that belongs to their
site alone. Every site's database syncs summary data up to **our central fleet database**.
We assess the fleet daily and push micro-tweaks, changes, and periodic bigger refreshes
back out — per-site or fleet-wide. The result is a mesh network of websites that compounds:
every lesson learned on one site improves the other 149. Smarter, faster, stronger, better.

## 2. Product

- **What the customer buys:** a premium, animated, conversion-focused pool-service website
  (this repo), set up for them end-to-end — domain, hosting, branding, copy, service areas,
  pricing, photos — plus ongoing optimization as a service.
- **The template:** 9 production pages — Home (scroll-driven swamp→crystal water
  experience), Services, Pricing, Our Work, Contact/Booking, About, Pool School, plus the
  Gaelworx funnel pages (Get This Site, Premium Ideas) that market the template itself.
- **Built-in funnel:** every deployed site carries the "Claim this site — by Gaelworx"
  badge linking to the Get This Site page. The fleet sells itself: each customer's site is
  also a live demo generating the next sale.
- **Premium upsells:** the Premium Ideas catalog is the menu for expansion revenue after
  the initial sale.
- **The monthly growth service, concretely:** this is what the $599/mo (get-this-site.html)
  actually buys, and it should stay in sync with that page's copy —
  - ~30 AI-drafted, locally-targeted blog posts per site per month
  - A live experiment running every week (headlines, offers, pricing display, rankings,
    how AI engines describe the business), results rolled network-wide on a win
  - Technical SEO/AEO/GEO upkeep: schema markup, meta tags, sitemap/robots health, and
    structure tuned for Google plus AI answer engines (ChatGPT, Perplexity, Gemini, Claude)
  - Google Business Profile posts, review-response drafts, and directory/citation
    consistency, managed weekly
  - Always-on feature scouting (winning patterns found elsewhere, reviewed and then added
    to the site) and a monthly plain-English report
  - Domain renewal, business email, SSL, and nightly backups, monitored and kept current
  - An AI chat concierge live on the site 24/7, answering visitor questions and capturing
    leads outside business hours
  - Heatmaps and session recordings on every page, feeding the weekly experiment queue
  - Everything above is AI-assisted production with human review before anything ships —
    not a claim that it runs unsupervised.

## 3. Architecture — hub and spoke, isolated by design

```
                        ┌──────────────────────────┐
                        │   CENTRAL FLEET DATABASE │
                        │  (Gaelworx – aggregates) │
                        └─────────────┬────────────┘
                 daily sync (up: summaries / down: config & tweaks)
        ┌─────────────┬───────────────┼───────────────┬─────────────┐
        │             │               │               │             │
  ┌───────────┐ ┌───────────┐  ┌───────────┐   ┌───────────┐ ┌───────────┐
  │ Site 001  │ │ Site 002  │  │ Site 003  │ … │ Site 149  │ │ Site 150  │
  │ + own DB  │ │ + own DB  │  │ + own DB  │   │ + own DB  │ │ + own DB  │
  └───────────┘ └───────────┘  └───────────┘   └───────────┘ └───────────┘
```

**Per-site (spoke):**
- Static site deployed from this template repo, personalized via `js/config.js`
  (`siteId`, business identity, `leadEndpoint`).
- **One database instance per customer.** Leads, bookings, form events, and page analytics
  are written only to that customer's own instance. No customer ever shares a database
  with another. This is the security and trust story: their data stays theirs, isolated
  at the infrastructure level.

**Central (hub):**
- The fleet database receives **summary/telemetry data** from each site instance on a
  daily sync: traffic, conversion rates, form completion, section engagement, plan-mix on
  quote requests, page performance.
- Aggregation is one-way for business data (PII stays in the spoke). What travels up is
  operational metrics; what travels down is configuration, content tweaks, and template
  updates.

**Why this shape:**
- *Security & compliance:* tenant isolation by instance, not by row. A breach or bug on
  one site cannot touch another customer's data. Central DB holds metrics, not customer PII.
- *Simple sales story:* "your own private database, professionally managed."
- *Fleet learning:* 150 sites generate statistically meaningful data no single pool company
  could ever collect alone.

## 4. The daily loop — assess, tweak, propagate

1. **Assess (daily):** central dashboard reviews every site's synced metrics — conversion
   funnels, bounce points, form drop-off, load performance, lead volume vs. season.
2. **Micro-tweaks:** small changes (headline tests, CTA copy, plan pricing display,
   section order) pushed to individual sites or cohorts. Config-level changes ride the
   daily sync; content-level changes ship as template point releases.
3. **Bigger changes & refreshes:** monthly/quarterly design refreshes, new sections, and
   seasonal campaigns (e.g. "green-to-clean" push in spring) cut as tagged releases of
   this repo and rolled out fleet-wide — staged: 5 canary sites → 30 → all 150.
4. **Compounding:** every experiment's result feeds the next round. A CTA that lifts
   conversion 12% in Austin ships to all 150 sites the same week. The mesh gets smarter
   with every deploy.

## 5. Fleet operations

- **Single source of truth:** this repository. Every site is a deployment of a tagged
  release + a per-site config overlay (branding, service areas, pricing, photos, copy
  overrides). No hand-edited snowflake sites — ever.
- **Versioning:** `fleetRevision` in `js/config.js` stamps every deployment and every
  synced payload, so the central DB can correlate performance with template version.
- **Onboarding a new customer (target: same-day):**
  1. Clone template at latest release; apply their config overlay (name, city list,
     pricing, photos, license number).
  2. Provision their database instance; set `leadEndpoint` + `siteId`.
  3. Deploy, connect domain, verify sync handshake to central DB.
  4. Register the site in the fleet dashboard.
- **Kill switch / graceful exit:** a departing customer keeps their site export and a dump
  of *their* database. Their spoke is deregistered; nothing else in the fleet is affected.

## 6. Why 150 sites become "smarter, faster, stronger, better"

| Fleet effect | Mechanism |
|---|---|
| Smarter | Aggregated A/B results across 150 sites → statistically real answers in days, not months |
| Faster | One optimization implemented once, deployed 150 times; canary rollouts catch regressions early |
| Stronger | Isolated per-site databases mean no shared blast radius; central telemetry spots outages/anomalies fleet-wide same-day |
| Better | Seasonal refreshes and premium upgrades ship from one codebase; every site is always on the current best-known version |

## 7. Rollout phases

- **Phase 1 — Foundation (now):** template production-ready (this repo), demo instance
  live, per-site config + lead pipeline defined (`js/config.js` → site DB instance).
- **Phase 2 — First 10:** hand-held onboarding, build the provisioning runbook, stand up
  central fleet DB + daily sync, define the metric schema that spokes report.
- **Phase 3 — Scale to 150:** templatized provisioning (one command per new customer),
  fleet dashboard with daily assessment queue, canary-cohort release process.
- **Phase 4 — Compounding:** experiment calendar, seasonal refresh program, premium
  upsell motion driven by per-site metrics ("your visitors hover on financing — add the
  financing module").

## 8. Guardrails

- Customer PII never leaves the customer's own database instance; the hub aggregates
  anonymous operational metrics only.
- Every fleet-wide push goes through canary cohorts before full rollout.
- Per-site overrides always survive template updates (config overlay is data, not code).
- Each customer's contract spells out data ownership: their leads are theirs, full export
  any time.
