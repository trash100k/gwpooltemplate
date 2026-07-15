# Meridian Pool Care — Gaelworx Website Template

Production implementation of the **Meridian Pool Care** design (Claude Design handoff),
built as a sellable, repeatable website template for pool-care companies. See
[`docs/STRATEGY.md`](docs/STRATEGY.md) for the 150-site fleet strategy this template powers.

## Pages

| Page | File | Notes |
|---|---|---|
| Home | `index.html` | Scroll-driven swamp→crystal water experience (WebGL), plans, proof, FAQ, booking |
| Services | `services.html` | Per-service deep dive |
| Pricing | `pricing.html` | Plan comparison, add-ons, billing FAQ |
| Our Work | `our-work.html` | Before/after gallery + reviews |
| Contact / Book | `contact.html` | Booking form, service area, hours |
| About | `about.html` | Story, team, trust signals |
| Pool School | `pool-school.html` | FAQ / resource page |
| Get This Site | `get-this-site.html` | Gaelworx funnel — claim/buy this template |
| Premium Ideas | `premium-ideas.html` | Gaelworx upsell catalog |

## Running locally

Static site — no build step:

```bash
python3 -m http.server 8080
# open http://localhost:8080
```

The home page water simulation (`js/water-scene.js`) loads three.js/react from esm.sh at
runtime, and photography loads from Pexels/Unsplash — both need internet access.

## Per-site configuration

Each deployed copy of this template edits **`js/config.js`** only:

- `siteId` — unique fleet identifier for the deployment
- `fleetRevision` — template version stamp (correlates metrics with releases)
- `leadEndpoint` — POST endpoint of **this site's own database instance**; leads from all
  booking/contact forms are sent there via `window.meridianSubmitLead()`. Left empty, forms
  run in demo mode (client-side success state, nothing persisted).
- `business` — name, phone, email, service area, license number

## Repository layout

```
index.html …          production pages (static HTML/CSS/JS, self-contained)
assets/               fonts + images (incl. extracted founder photo)
js/
  config.js           per-site instance config + lead submit helper
  water-scene.js      <water-scene> WebGL water component (reads window.__POOL)
  mesh-net.js         <mesh-net> canvas network animation
design/               original Claude Design handoff bundle, verbatim (prototypes,
                      design assets, screenshots — the source of truth for the design)
docs/STRATEGY.md      the 150-site fleet / central-database strategy
```

## Design source

The `design/` folder is the untouched export of the Claude Design project
*Modern Pool Website Template* (`Meridian Pool Care.dc.html` and sibling pages). The
production pages recreate those prototypes pixel-faithfully without the design-tool
runtime. When refreshing the design, edit in Claude Design, re-export, replace `design/`,
and re-convert the affected pages.
