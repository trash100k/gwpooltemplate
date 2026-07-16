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
