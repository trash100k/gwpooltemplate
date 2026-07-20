# Funnel overdrive — remaining work

Status as of 2026-07-17. The overdrive workflow (territory board, booking
magnet, two delights on get-this-site.html; theme-sweep, page-wears-theme,
build sheet on premium-ideas.html) shipped and is verified in-browser —
not tracked here. What's below is what's left, in two tiers.

The customizer-alignment agent (real pages/chapters) hit the account
session limit twice and died before writing anything to premium-ideas.html —
it is 0% done, not partially done. A stray 107KB debris file (`idthp`, a
duplicate read-artifact of premium-ideas.html from that crash) was found
and deleted from the repo root; nothing else was corrupted.

---

## Tier 1 — quick fixes (~20-30 min, mechanical, exact refs below)

### 1. gw-picks handoff is silently broken (P1)
premium-ideas.html writes (lines 692-696):
```js
sessionStorage.setItem(GW_PICKS_KEY, JSON.stringify({
  theme: _paletteName || 'Lagoon',
  sections: MOD_ORDER.filter(k => _mods[k] !== false).map(k => MOD_LABELS[k]),
  style: _style ? (STYLE_LABELS[_style] || _style) : null
}));
```
get-this-site.html's `picksSummary()` reads a totally different shape
(lines 678-693): `p.style` as a lookup key, `p.palette` as a string,
`p.mods` as a `{key: bool}` object. None of those keys exist on what's
actually written, so `parts` stays empty and the booking-page summary is
always `''` — the whole "your whole site reskins" handoff is currently a
no-op. **Fix:** rewrite `picksSummary()` to read `p.theme` (string),
`p.sections` (already an array of display labels — just join them),
`p.style` (already a label — no lookup needed). The `styleLabels`/
`modLabels` maps become unnecessary once the reader matches the writer.

### 2. Anchor-nav reduced-motion/hidden-tab fallback is a no-op (P1)
get-this-site.html line 21: `html { scroll-behavior: smooth; }` (global).
Line 1005: `function behaviorNow() { return (reduced() || document.hidden) ? 'auto' : 'smooth'; }`
Per the CSSOM View spec, `scrollIntoView({behavior: 'auto'})` defers to the
element's *computed* `scroll-behavior` CSS property — which is `smooth`
here — so the "instant fallback" is still smooth, and smooth-scroll rAF
ticks are throttled/suspended on a hidden tab, so it can silently never
finish. **Fix:** when the instant path is needed, temporarily set
`document.documentElement.style.scrollBehavior = 'auto'` (inline wins over
the stylesheet rule) immediately before the `scrollIntoView` call in
`scrollToHash`, then clear the inline override on the next frame so normal
user-triggered smooth scrolling is unaffected.

### 3. Exit-intent modal body paragraph never updates for the closed-state case (P1)
`exitHeadingText()` (get-this-site.html lines 673-677) already computes the
right heading for both states ("X still has N slots open" / "X is closed —
ask about the waitlist"). The static body paragraph under it (line 609,
"...the founding rate locks for life only while spots last...") is never
touched by the state-select handler, so a visitor who picks a **closed**
state still reads copy implying spots are open. **Fix:** add a matching
`exitBodyText(name, open)` and wire it wherever the heading gets set.

### 4. "Most popular" pill has hardcoded ink (P1)
premium-ideas.html line 109: `color:#0a2c30` on a pill whose background is
`linear-gradient(var(--cta-from),var(--cta-to))`. Since `applyPalette` now
retints `--cta-from`/`--cta-to` *and* sets a per-palette `--cta-ink`, this
pill's ink no longer matches its background on 5 of 6 themes. **Fix:**
`color:#0a2c30` → `color:var(--cta-ink)`.

### 5. Dead validation branch (P2)
premium-ideas.html lines 997-1000 show an inline error ("Add your name,
plus an email or phone...") that's now unreachable — `updateSubmitState()`
already disables the submit button until `ready` is true, and `#pickForm`
is a `<div >` so Enter can't trigger it either. **Fix:** delete the dead
branch. Keep the `formError` element and its line-1051-1053 usage — that
one's real (network-failure display after a valid submit fails to send).

### 6. Dead `<select>` CSS (P2)
get-this-site.html ~line 28: a `select { -webkit-appearance:none; ... }`
rule with no matching element left in the page (the old 12-state dropdown
was replaced by the 50-chip territory board). Delete the rule.

### 7. Stale swatch colors on the get-this-site funnel teaser (P2)
get-this-site.html ~lines 502/506 show a small "customizer teaser" mock
with Sapphire/Grape swatch endpoints (`#3f7fd6`, `#7d5fd6`) that no longer
match premium-ideas.html's actual current palette hex values (Sapphire/
Grape now resolve to different `--cta-from`/`--cta-to` pairs — check
premium-ideas.html's `PALETTES` object for the live source of truth).
**Fix:** sync the teaser's swatch gradients to match exactly, or better,
have the teaser read the same palette table instead of hardcoding a copy.

### 8. No focus management on in-page anchor nav clicks (P2, a11y)
get-this-site.html's anchor-click interceptor (~lines 1014-1024) calls
`preventDefault()` and scrolls, but never moves focus to the target — a
keyboard user who activates a nav link scrolls visually but keeps focus on
the link and has to Tab through everything between old and new position.
**Fix:** after a successful `scrollToHash`, set `tabindex="-1"` on the
target section (if it doesn't already have one) and call `.focus()`.

---

## Tier 2 — the actual heavy lift: customizer alignment (0% done)

**Goal:** premium-ideas.html's "2b" module currently demos only the
Services page's optional sections. Replace it with the real registry so
the customizer (and the lead it captures) reflects what actually ships.

**Real pages** (7): Home (locked-on) · Services · Pricing · Our Work ·
About · Pool School · Contact.

**Real homepage chapters** (10, from index.html's `data-screen-label`
attributes, in shipping order): Hero (locked-on) · Problems · The water ·
The turn · Services · Proof · Promise · Plans · FAQ · Contact.

Full build spec (data model, demo-frame rebuild as a mini-homepage journey
strip + mini-nav, locked-chip treatment, copy rewrite away from "Shown
live on the Services page," build-sheet integration, sessionStorage
`pages` key) is the brief already drafted for the agent that didn't get to
run it — regenerate/reuse that spec when picking this back up. Reuse the
existing MODS/MOD_LABELS/MOD_ORDER + pulse/announce/scroll-into-view
machinery; this is an extension of that system, not a second one.

Estimated effort: comparable to one of the two original overdrive builder
passes — roughly 60-90 minutes of focused work.
