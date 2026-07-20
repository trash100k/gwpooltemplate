# onboard-fix

Findings and fixes from the 6-persona onboarding passes (2026-07-20). Two sides: the Meridian template pages (the product) and the Gaelworx funnel pages (the seller). All work uncommitted until Zach signs off.

---

## Template side (Meridian pages) — DONE, verified pass

Personas walked: Emergency Erin, Referral Rita, New-owner Noah, DIY Dana, Price-shopper Pat, Switcher Sam.

### Findings (what the walkers hit)

1. **Rescue-labeled CTAs landed on a weekly-default form.** Every subpage nav "Rescue my pool" pill pointed at plain contact.html, which preselects weekly service and renders the green-rescue forecast copy under a "Book my first visit" button. Erin's label/forecast mismatch; Rita's inverse problem (weekly intent hit swamp-drama copy).
2. **No timeline answer at the decision point.** "3-5 days" lived only on pricing and the contact forecast; the index hero never said it.
3. **Phone path buried.** Panic-mindset visitors had no visible call escape until the footer.
4. **Submit button lied by omission.** "Book my first visit" for someone requesting a rescue or repair quote reads as a commitment they didn't make.
5. **Pricing page had zero proof in the comparison sightline**, and the no-contract answer sat mid-FAQ.
6. **Weekly card never said month-to-month** where Noah was actually scanning.

### Fixes shipped (all config-driven, [data-cfg] safe, zero em dashes in new copy)

1. **Intent-true routing** (contact.html + 5 subpages): all nav/hamburger "Rescue my pool" links now carry `?intent=rescue&water=green`; arriving with `intent=weekly` and no water param forces the crystal forecast ("You're already there. Let's keep it that way." / from $149/mo) instead of green drama. Direct visits still default green. Crystal note now: "Weekly care from $149/mo, any size pool. First clean free."
2. **Contact hero escape line**: "Serving [area]. In a hurry? Call [phone] and skip the form." Fully config-driven via existing data-cfg machinery.
3. **Chip-keyed submit labels** (weekly = "Book my first visit", rescue = "Get my rescue quote", repair = "Get my repair quote", question = "Send my question") plus rewritten confirmation copy with a one-business-day ceiling and phone fallback.
4. **Index hero timeline**: subhead now includes "Most rescues are swim-ready in 3 to 5 days." Only index.html change; crawl and Cannonball Gate untouched.
5. **Pricing trust pass**: two-quote static proof strip after the plan cards (Hendersons / Priya K., reused from the index carousel, no invented stats), and the "Do I need a contract?" FAQ moved to first position, open by default, answer expanded with first-clean-free.
6. **Weekly card reassurance line** on services.html: "Month-to-month. No contracts. First clean free."

### Verifier nits, fixed by orchestrator after the pass

- pricing.html FAQPage JSON-LD updated to match the new visible contract answer and reordered contract-first.
- services.html bottom CTA "Rescue my pool" now carries the same `?intent=rescue&water=green` params as the nav.
- our-work.html was missing `</head><body>` entirely (pre-existing); pair inserted after the head scripts, tag balance now clean.

### Deliberately rejected (so nobody re-proposes them)

- Any fabricated proof: rating badges, review counts, no-show payout histories, invented guarantees. Template ships to ~150 real businesses; only config-driven facts allowed.
- 2-4 hour callback promises (unownable ops SLA), sticky overlays on the index crawl (collides with fixed-stage internals), forecast reordering, per-chip forecast copy matrices, team photos, annual-default billing toggle.

---

## Funnel side (get-this-site + premium-ideas) — DONE, verified pass after one blocker fix

Personas walked: Burned Bill, Ready Rachel, Comparison Carl, Solo Sandra, Growth Greg, Picks Paula.

Prior cold-read critic findings fed into the designer:

- Biggest stall: the ONE-CLICK CUSTOMIZATION teaser assigns homework ("style my site") before price, proof, or availability; fast readers jump to pricing and skip the trust sections.
- Zero verifiable peer proof anywhere; the $499 deposit reads as a bet on a stranger. Cannot be fixed by fabrication; needs a real client from Zach later.
- Urgency levers stacked five deep (first-10, $800 discount, 30% year teaser, exit modal, competitor-takes-your-spot closer); skeptics discount all of them. No new levers allowed; softening one redundant lever is in scope.
- Florida-first carries through the auto-selected board, but a Tampa reader never sees the metro named in prose he actually reads (the Tampa/Orlando line is a pre-JS fallback JS overwrites).

### Findings (what the walkers hit)

1. **Solo Sandra was the worst journey**: a 2-minute phone sprint with zero re-entry hook when she comes back tonight, and the exit modal cannot fire on touch.
2. **The black box after paying**: Bill, Rachel, and Greg all stalled on what actually happens between the $499 landing and being live. Rachel had her card out at 9pm with no deposit-to-live map.
3. **The customization teaser stalled the persuasion spine** (confirmed by both the critic and the walkers): homework before price, proof, or availability.
4. **Duplicate urgency**: the final CTA closed with a line that repeated its own H2, feeding the skeptics' "pressure tactics" discount.
5. **Florida readers never saw their market named** in prose that survives the JS auto-select.
6. **Picks Paula's empty state gave no guidance** and the submit read ambiguously close to a payment.

### Fixes shipped (verify pass after one blocker fix, dash gates 0, figures byte-exact)

1. **A1 returning-visitor bar** (#gw-return-bar under the sticky nav): silent first visit, then one dismissable teal line on return. Picks saved on this device routes to #book, otherwise to #territory. Dismiss persists forever (gw-return-dismissed). *Verifier caught a real blocker: inline display:flex beat the hidden attribute (the documented line-49 gotcha); fixed by adding #gw-return-bar[hidden] to the display:none !important guard.*
2. **A2 deposit ledger** below the Claim Ticket: $499 lands / territory locks / same-day text, Day 1 call, Days 2-3 build, Day 3 live with the 90-day promise, "Refundable until kickoff." Static, outside the pill-toggled region, teal only, zero changes to ticket or PayPal wiring.
3. **A3 teaser relocation**: the ONE-CLICK CUSTOMIZATION section moved intact to between pricing (#claim) and booking (#book), with "Every claim starts here" softened to "Two minutes, if you want it." It is now the on-ramp, not the interruption.
4. **A4 urgency dedupe**: deleted the "Every week you wait is a week your competitor could take your spot instead." closer; the H2 above already says it. All other levers remain exactly once each.
5. **A5 Florida market moment**: the auto-selected FL payoff now reads "Florida: 1 of 3 founding slots left. First come, first locked. Tampa and Orlando pools run all year; the calls never stop." Metro names stripped from the throwaway fallback; page-wide count stays at exactly one Tampa, one Orlando, in a line readers actually see.
6. **A6 premium-ideas micro-edits**: empty state now guides ("Skip it and we start you on Color & Shape, the most popular.") and the submit microcopy clarifies it is not a payment.

### Persona rewalk (verifier)

- Burned Bill: reaches pricing sooner, and the ledger answers his core objection at the decision pixel; the urgency stack no longer contains a verbatim duplicate.
- Solo Sandra: the they-know-my-market line lands inside her 2-minute window, the teaser sits where acting is the next step, and the return bar catches her tonight.

### Deliberately rejected

- Anything needing real-client proof (named peer site beside the ticket): cannot fabricate; Zach supplies a real founding client later. This remains the single highest-leverage improvement once one exists.
- Any new urgency lever, popups, chat widgets, tours.

---

## Orchestrator browser QA (localhost:8742, live DOM)

- Return bar: first scripted load silently stamps gw-visited and stays hidden; reload shows the picks variant ("Welcome back. Your styled site is saved on this device.") linking #book; dismiss (click and Enter/Space, role=button + tabindex, exit-modal idiom) hides it and persists via gw-return-dismissed. The [hidden] guard fix verified: computed display none while hidden.
- Teaser confirmed between #claim and #book; deposit ledger renders below the ticket with all four steps; "Every week you wait" gone; payoff first paint reads the full Florida line with Tampa and Orlando visible exactly once each.
- PayPal: deposit renders (iframe in, fallback hidden, price $499); rapid toggle full-deposit-full settles to a single $3,199 numeral with aria-pressed correct (the mid-animation double numeral is the clone roll in flight, resolves in under a second).
- premium-ideas: title de-dashed, empty state and not-a-payment microcopy live, pills present, saved-picks restore shows the success panel with the offer rendered.
- Rendered em dashes on premium-ideas: 2, both data not code: the stored "QA Test — delete me" lead name, and the PayPal deposit item description set in the dashboard ("...build fee — refundable until kickoff"). The latter needs a one-time edit in the PayPal dashboard if the dash ban should extend into the widget.
- Not covered here: true 375px visual pass (background-tab screenshots capture black; structure uses nowrap-ellipsis and flex-wrap, so no overflow expected). Worth one visible-window look before merge.

## Still open for Zach

- The $499 deposit's biggest remaining friction is verifiable peer proof; slot a real founding client (name, city, linkable site, one concrete number) beside the Claim Ticket as soon as one exists.
- All of the above is uncommitted; main is git-connected to gwpool.vercel.app, so nothing deploys until the merge.
