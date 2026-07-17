/* Per-site instance configuration.
   Every deployed copy of this template gets its own edit of this file.
   `leadEndpoint` should point at the POST endpoint of THIS site's own
   database instance (see docs/STRATEGY.md — one isolated DB per site,
   syncing summaries up to the central fleet database).
   When leadEndpoint is empty the booking forms run in demo mode and
   simulate a successful submission client-side. */
window.MERIDIAN_CONFIG = {
  siteId: 'TEMPLATE-000',
  fleetRevision: '2026.07',
  leadEndpoint: '',
  business: {
    name: 'Meridian Pool Care',
    phone: '(512) 555-0143',
    email: 'care@meridianpools.com',
    area: 'Austin & Hill Country',
    license: 'TX-PC-2201'
  },
  /* Empty color overrides = use the CSS token defaults in each page's :root. */
  colors: { accent: '', ctaFrom: '', ctaTo: '' }
};

/* Track whether demo-mode warning has been emitted this page load. */
var meridianLeadWarningEmitted = false;

/* Shared lead-form submit helper. Returns a promise that resolves when the
   lead is stored (or immediately in demo mode). Pages call this from their
   form handlers. */
window.meridianSubmitLead = function (fields) {
  var cfg = window.MERIDIAN_CONFIG || {};
  var payload = Object.assign({
    siteId: cfg.siteId,
    fleetRevision: cfg.fleetRevision,
    submittedAt: new Date().toISOString(),
    page: location.pathname
  }, fields);
  if (!cfg.leadEndpoint) {
    // Warn once per page load if running on a non-local deployment.
    var isLocalhost = location.hostname === 'localhost' ||
                      location.hostname === '127.0.0.1' ||
                      location.hostname === '0.0.0.0' ||
                      location.hostname === '::1' ||
                      location.hostname === '';
    if (!isLocalhost && !meridianLeadWarningEmitted) {
      console.warn('[Meridian/Gaelworx] leadEndpoint is not configured — booking forms are running in DEMO MODE and leads are NOT being stored. Set leadEndpoint in js/config.js.');
      meridianLeadWarningEmitted = true;
    }
    return Promise.resolve({ demo: true, payload: payload });
  }
  return fetch(cfg.leadEndpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  }).then(function (r) {
    if (!r.ok) throw new Error('lead endpoint returned ' + r.status);
    return r.json().catch(function () { return {}; });
  });
};

(function () {
  function applyConfig() {
    var c = window.MERIDIAN_CONFIG || {}, b = c.business || {}, col = c.colors || {}, root = document.documentElement;
    if (col.accent) root.style.setProperty('--accent', col.accent);
    if (col.ctaFrom) root.style.setProperty('--cta-from', col.ctaFrom);
    if (col.ctaTo) root.style.setProperty('--cta-to', col.ctaTo);
    var vals = { name: b.name, phone: b.phone, email: b.email, area: b.area, license: b.license };
    var tel = b.phone ? ('tel:' + String(b.phone).replace(/[^0-9+]/g, '')) : null;
    [].forEach.call(document.querySelectorAll('[data-cfg],[data-cfg-href]'), function (el) {
      var k = el.getAttribute('data-cfg'), h = el.getAttribute('data-cfg-href');
      if (h === 'tel' && tel) el.setAttribute('href', tel);
      if (h === 'mailto' && b.email) el.setAttribute('href', 'mailto:' + b.email);
      if (k && vals[k] != null && vals[k] !== '') el.textContent = vals[k];
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', applyConfig);
  else applyConfig();
  window.meridianApplyConfig = applyConfig;
})();

/* Gaelworx "Claim this site" badge — the fleet funnel, carried on every template
   page (DESIGN.md signature component). index.html ships its own richer inline
   badge (content rides the animated #waterRipple filter there), so injection is
   skipped when #pc-badge-wrap already exists. Skipped on the funnel pages
   themselves (get-this-site, premium-ideas) — the badge is their entrance.
   ponytail: markup mirrors index.html's badge minus the waterRipple filter,
   which is static (scale 3) on subpages and would distort the badge text. */
(function () {
  function injectBadge() {
    if (document.getElementById('pc-badge-wrap')) return;
    var page = location.pathname.split('/').pop() || 'index.html';
    if (page === 'get-this-site.html' || page === 'premium-ideas.html') return;
    var style = document.createElement('style');
    style.textContent =
      "@font-face { font-family: 'Grenze Gotisch'; font-style: normal; font-weight: 400 900; font-display: swap; src: url('assets/fonts/grenze-gotisch.woff2') format('woff2'); }" +
      '@keyframes gw-badge-in { from { opacity: 0; transform: translateY(26px) scale(.96); } to { opacity: 1; transform: none; } }' +
      '@keyframes gw-coin-glint { 0%, 84% { transform: translateX(-160%) rotate(20deg); opacity: 0; } 89% { opacity: .55; } 100% { transform: translateX(320%) rotate(20deg); opacity: 0; } }' +
      '@keyframes gw-coin-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }' +
      '@keyframes gw-ablaze { 0% { color: #ff9a3c; text-shadow: 0 0 5px rgba(255,150,60,.7), 0 0 12px rgba(255,90,20,.4); } 100% { color: #ffd27a; text-shadow: 0 0 9px rgba(255,185,90,.95), 0 0 22px rgba(255,110,30,.6); } }' +
      '.pc-badge:hover { transform: translateY(-3px); box-shadow: 0 26px 62px rgba(2,10,14,.66); border-color: rgba(127,227,218,.5); }' +
      '.pc-badge:focus-visible { outline: 2px solid var(--accent, #7fe3da); outline-offset: 3px; }' +
      '@media (prefers-reduced-motion: reduce) { #pc-badge-wrap { animation: none; } #pc-badge-wrap img, #pc-badge-wrap [aria-hidden] { animation: none !important; } }';
    var wrap = document.createElement('div');
    wrap.id = 'pc-badge-wrap';
    wrap.style.cssText = 'position:fixed; right:clamp(16px,3vw,28px); bottom:clamp(16px,3vw,28px); z-index:30; max-width:calc(100vw - 32px); animation:gw-badge-in .9s cubic-bezier(.2,.7,.2,1) 1.1s both;';
    wrap.innerHTML =
      '<a class="pc-badge" href="get-this-site.html" style="position:relative; display:flex; align-items:center; padding:9px 16px 9px 9px; border-radius:999px; background:rgba(6,20,27,.72); backdrop-filter:blur(14px) saturate(120%); -webkit-backdrop-filter:blur(14px) saturate(120%); border:1px solid rgba(150,230,225,.22); box-shadow:0 16px 44px rgba(2,10,14,.55), inset 0 1px 0 rgba(255,255,255,.05); text-decoration:none; transition:transform .35s cubic-bezier(.2,.7,.2,1), box-shadow .35s ease, border-color .35s ease; will-change:transform;">' +
        '<span style="display:flex; align-items:center; gap:13px;">' +
          '<span style="position:relative; flex:none; width:46px; height:46px; border-radius:50%; overflow:hidden; border:1.5px solid rgba(214,150,86,.6); box-shadow:0 0 16px rgba(191,123,62,.42), inset 0 0 10px rgba(0,0,0,.45);">' +
            '<img src="assets/favicon.png" width="180" height="180" alt="Gaelworx" style="display:block; width:100%; height:100%; object-fit:cover; transform-origin:50% 50%; animation:gw-coin-spin 14s linear infinite;">' +
            '<span aria-hidden="true" style="position:absolute; top:-70%; left:0; width:36%; height:240%; background:linear-gradient(90deg, transparent, rgba(255,240,214,.55), transparent); animation:gw-coin-glint 7s ease-in-out infinite; pointer-events:none;"></span>' +
          '</span>' +
          '<span style="display:flex; flex-direction:column; line-height:1.16; padding-right:2px;">' +
            '<span style="font-family:\'Bricolage Grotesque\',sans-serif; font-weight:700; font-size:15.5px; letter-spacing:-.006em; color:var(--foam-white, #f2fdfb);">Claim this site</span>' +
            '<span style="display:flex; align-items:baseline; gap:5px; font-family:\'Manrope\',sans-serif; font-weight:600; font-size:11px; color:rgba(214,240,236,.55);">by <span style="font-family:\'Grenze Gotisch\',serif; font-weight:700; text-transform:uppercase; letter-spacing:.04em; font-size:13px; color:#d99a5b;">G<span style="color:var(--ember, #ffb14d); text-shadow:0 0 7px rgba(255,150,60,.85), 0 0 16px rgba(255,90,20,.55); animation:gw-ablaze 1.6s ease-in-out infinite alternate;">ae</span>lworx</span></span>' +
          '</span>' +
          '<span style="flex:none; width:32px; height:32px; margin-left:2px; border-radius:50%; background:linear-gradient(135deg,var(--cta-from, #8ef0e6),var(--cta-to, #37c7bf)); color:var(--cta-ink, #052026); display:flex; align-items:center; justify-content:center; font-size:15px; font-weight:700; box-shadow:0 4px 14px rgba(30,180,170,.45);">→</span>' +
        '</span>' +
      '</a>';
    document.head.appendChild(style);
    document.body.appendChild(wrap);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', injectBadge);
  else injectBadge();
})();
