# Gaelworx Fleet Strategy — Meridian Pool Care Template

**Planning document: a website template and proposed operating model for a limited rollout.**

> Current public offer: $499/month for services, with the premium website included as a bonus and no separate build charge. Exact deliverables, quantities, cadence, tools, access and responsibilities require an agreed written scope. The architecture, fleet operations, automation and administrative arrangements below are proposals, not verified current delivery or included commitments. Ownership, cancellation, minimum commitment, guarantees and billing timing remain undecided; payments and enrollment remain disabled.

This document captures the go-to-market and operating strategy for the Meridian Pool Care
website template in this repository.

---

## 1. The play in one paragraph

The proposed rollout is limited to 150 independent pool-care companies. The current
offer is $499/month for services, with a personalized premium website included as a bonus
and no separate build charge. Exact setup and ongoing work require an agreed written
scope. Isolated client databases, central summary sync, measurement and shared updates
are future architecture ideas; this template does not establish that they are provisioned
or delivered today.

## 2. Product

- **What the customer buys:** $499/month services with this premium website included as a bonus, with no separate build charge. Personalization, setup, integrations and ongoing work are defined by the agreed written scope.
- **The template:** 9 production pages — Home (scroll-driven swamp→crystal water
  experience), Services, Pricing, Our Work, Contact/Booking, About, Pool School, plus the
  Gaelworx funnel pages (Get This Site, Premium Ideas) that market the template itself.
- **Built-in funnel:** every deployed site carries the "Claim this site — by Gaelworx"
  badge linking to the Get This Site page. The fleet sells itself: each customer's site is
  also a live demo generating the next sale.
- **Premium upsells:** the Premium Ideas catalog is the menu for expansion revenue after
  the initial sale.
- **Current offer:** $499/month for services, with the premium website included as a bonus and no separate build charge.
- **Enrollment hold:** inquiries only. Ownership, cancellation, any minimum commitment, guarantees and payment timing must be decided before payments or recurring enrollment open.
- **Service categories for scope discussion:** website personalization and updates, content support, search visibility review, local profile support, setup coordination, inquiry handling and measurement options.
- **Scope confirmation:** specify deliverables, quantities, frequency, tools, required access, responsibilities, reviews and exclusions in writing before enrollment. The public offer does not promise 30 posts per month, weekly experiments, a 24/7 concierge, managed backups/security, rankings or automated network rollouts.
- **Implementation evidence (2026-10-14):** the repository provides a static template, business configuration and an inquiry helper. The separate agency project supports editing, basic SEO artifacts and deployment; domain/email tasks are administrative handoffs. Recurring customer-service delivery has not been verified. The planning sections below do not establish fulfillment of the $499/month service.

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

- **Phase 1 — Proposed foundation:** this repo provides the static template and live
  demo. Per-site configuration exists, but a real lead destination and any client database
  must be scoped, provisioned and verified; the homeowner demo forms currently simulate success.
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
