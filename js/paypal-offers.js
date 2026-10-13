/*
 * Gaelworx payment and recurring enrollment are disabled.
 * Current offer: $499/month services with the premium website included as a
 * bonus, with no separate build charge. Service terms must be confirmed
 * before enrollment or payments can open.
 * Keep compatibility hooks inert for older cached pages. No payment SDK,
 * hosted checkout configuration, or payment request is loaded or rendered.
 */
(function () {
  'use strict';
  window.GAELWORX_PAYPAL = { enabled: false, offers: {} };
  window.gaelworxRenderOffers = function () {};
  window.gaelworxShowOffer = function () {};
})();
