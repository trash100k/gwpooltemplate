/*
 * Gaelworx sales-funnel lead catcher.
 *
 * Used ONLY by the Gaelworx sales pages (get-this-site.html, premium-ideas.html)
 * — the pages that are removed before a customer site is deployed. It posts the
 * lead to a Google Apps Script web app running in the Gaelworx account, which
 * emails the lead to forge@gaelworx.com (and, later, pushes it into Attio).
 *
 * This is separate from js/config.js `meridianSubmitLead`, which routes the
 * DEMO/template forms to each deployed business's own endpoint.
 */
(function () {
  // Apps Script web app: "Gaelworx lead catcher v1" (execute as owner, access: anyone)
  window.GAELWORX_LEAD_ENDPOINT =
    'https://script.google.com/macros/s/AKfycbwMtcyi4oMqTN3-TARZ-opOXnUBkVpvJCr_iRpGHIHJgvvvfXMLPNhduCDz_bxUSjwzmQ/exec';

  window.gaelworxSubmitLead = function (data) {
    var payload = Object.assign({ source: (document.title || location.pathname) }, data || {});
    // no-cors + text/plain avoids a CORS preflight; the response is opaque, so
    // the UI treats a dispatched request as success (the email is the receipt).
    return fetch(window.GAELWORX_LEAD_ENDPOINT, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload)
    });
  };
})();
