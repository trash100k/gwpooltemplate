# GW Pool service enrollment gate

Status: **checkout closed — owner decisions required**  
Last audited: 2026-10-19

This is an internal launch gate, not a customer agreement or legal advice. It records what must be true before the public funnel may say “enroll,” accept payment, or create a recurring subscription.

## Verified current state

- Public price: **$499/month for services**.
- The premium website is described as a bonus with no separate build charge.
- `js/paypal-offers.js` is intentionally inert. It contains no SDK, hosted checkout URL, plan ID, or payment request.
- The public funnel is inquiry-only and correctly says that enrollment and payments are closed.
- The repository provides a static template, a per-site configuration file, a demo-mode homeowner lead helper, and a separate Gaelworx inquiry helper.
- No repository evidence establishes recurring-service fulfillment, a customer agreement, a signature/acceptance system, a production onboarding form, or subscription lifecycle handling.
- The official Gaelworx site corroborates **Zachary Isaacson**, **+1 (369) 212-1203**, and **hello@gaelworx.com**. Public funnel contact links should use those values.
- Meridian Pool Care is a fictional template business. Its reviews, credentials, prices, results, license number, and contact details are placeholders and must be disclosed as such on the public demo.

## Smallest decisions Zach must make

Checkout remains closed until every row has one explicit answer. These are business and policy choices; the repository cannot infer them safely.

| Decision | Exact answer required |
|---|---|
| Baseline monthly deliverables | A finite list with quantity and cadence for each item. “By scope” is suitable for inquiry but not for a one-click recurring purchase. |
| Website ownership | Who owns the customized site files, copy, images, domain, hosting account, and analytics data during service and after cancellation. |
| Cancellation | Notice period, effective date, what access remains, what is exported/transferred, and whether any paid amount is refundable. |
| Minimum commitment | Month-to-month or an exact initial term. Do not imply “cancel anytime” unless this is chosen. |
| Billing timing | Charge date, whether the first charge occurs before or after scope acceptance, renewal cadence, proration policy, failed-payment handling, and applicable taxes. |
| Guarantee | Either no guarantee or exact, measurable remedy and claim window. Do not promise rankings, leads, revenue, or automated improvement. |
| Fulfillment owner and capacity | Named person responsible for each deliverable, maximum active-client capacity, review queue, and customer response channel. |
| Payment system | Provider, live product/plan identifier, checkout URL or SDK mode, webhook destination, success/cancel destinations, and who owns subscription administration. |
| Agreement acceptance | Final service agreement/scope version, acceptance mechanism, timestamped record, and the order of acceptance versus payment. Obtain appropriate legal review. |

## Required purchase sequence

1. Prospect receives the final written scope and service terms.
2. Prospect affirmatively accepts the exact version presented.
3. Checkout creates a **$499/month** subscription using the approved live plan.
4. Success handling stores the customer identity, accepted scope version, subscription ID, transaction status, and timestamps in an authorized system.
5. The customer receives a receipt plus the production onboarding link.
6. Failed, canceled, or abandoned checkout never displays enrollment success.
7. Subscription changes and cancellation follow the approved policy and provider state; the website does not maintain a conflicting shadow status.

## Minimum onboarding record

- Legal/customer name, business name, primary contact, billing email, and service state/market.
- Approved business phone, email, service area, hours, services, prices, licenses, guarantees, and credentials.
- Authorized logo, photography, reviews, and proof, including permission to publish.
- Domain and hosting ownership plus the agreed transfer/access method. Never collect passwords in an ordinary web form.
- Approved pages, copy source, inquiry destination, analytics/consent choices, and launch approver.
- Selected deliverables, cadence, exclusions, dependencies, kickoff date, and review schedule from the accepted scope.

## Implementation gate

Only after the decisions above are recorded:

- replace the inert payment shim with provider configuration that contains no secret keys in client-side code;
- add the accepted agreement/scope version to checkout metadata or the server-side enrollment record;
- add explicit success, cancellation, failed-payment, and subscription-cancellation states;
- connect onboarding to an authorized datastore and verify delivery/receipt;
- test in provider sandbox, then run one controlled live transaction and refund/cancellation test;
- update public copy from “inquiry” to “enrollment” only after all checks pass.

Until then, the truthful conversion path is: **inquiry → discuss scope → receive final terms → no payment yet**.
