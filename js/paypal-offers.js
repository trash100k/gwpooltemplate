/*
 * Gaelworx sales-funnel PayPal offers.
 *
 * Used ONLY by the Gaelworx sales pages (get-this-site.html, premium-ideas.html)
 * — the pages that are removed before a customer site is deployed. It lazily
 * loads the PayPal JS SDK and renders dashboard-hosted buttons (the amounts
 * live on PayPal's servers; this file only knows the button IDs).
 *
 * Any offer still set to 'REPLACE_ME' is a silent no-op and the mailto
 * fallback links on the pages stay visible for it.
 *
 * gaelworxRenderOffers(map, opts) lazily renders offers into containers;
 * gaelworxShowOffer(sel, key) clears a container's mount and re-renders one
 * offer into it (the on-page toggle path; stale async renders are discarded).
 */
(function () {
  // ============================================================================
  // PAYPAL IDS (from the PayPal dashboard).
  //   clientId       -> Dashboard > Apps & Credentials > Live > Client ID
  //   hostedButtonId -> Pay Buttons > (each saved button) > its hosted button ID
  // Offers: deposit = $499 deposit | full = $3,199 build paid in full
  // deposit + full are live. `year` ($7,831 first year up front) is the only
  // dormant slot — intentionally left 'REPLACE_ME' with no button created;
  // the pages mention it as plain text only.
  // ============================================================================
  window.GAELWORX_PAYPAL = {
    clientId: 'BAAzbDasUmTGydEeKlLoVNfyoRikcl6axio4cBGBC8UPjeWJnZGyDtkKNvDrGE-sJBps1ZbWWkd0i-BqOU',
    offers: {
      deposit: { hostedButtonId: 'PUMMPADQS4JS2' },
      full: { hostedButtonId: 'XKBMYEKVVZTD2' },
      year: { hostedButtonId: 'REPLACE_ME' } // intentionally dormant — text mention only, no button
    }
  };

  var sdkState = 'idle'; // idle | loading | ready | failed
  var queued = []; // renders requested before the SDK finished loading

  function loadSdk() {
    if (sdkState !== 'idle') return;
    sdkState = 'loading';
    var s = document.createElement('script');
    s.src = 'https://www.paypal.com/sdk/js?client-id=' +
      encodeURIComponent(window.GAELWORX_PAYPAL.clientId) +
      '&components=hosted-buttons&enable-funding=venmo&currency=USD';
    s.onload = function () {
      sdkState = 'ready';
      var jobs = queued.splice(0);
      for (var i = 0; i < jobs.length; i++) jobs[i]();
    };
    s.onerror = function () {
      // ad-blocker / offline: leave the fallback links visible, say nothing
      sdkState = 'failed';
      queued.length = 0;
    };
    document.head.appendChild(s);
  }

  // The ONE token-aware render path — every render of an offer into a
  // container (initial lazy/immediate render AND the toggle path) goes
  // through here. Each call bumps the container's token and renders into a
  // fresh wrapper <div> inside the cleared .gw-pp-mount. PayPal's
  // HostedButtons().render() is async replace-semantics (it writes the
  // target's innerHTML AFTER a network fetch), so the .then/.catch — which
  // always fire after that write — check the token: a superseded call tears
  // its own wrapper out of the DOM and leaves the fallback <a> alone, so a
  // slow older render can never overwrite the newer selection.
  function renderOffer(key, container) {
    var offer = window.GAELWORX_PAYPAL.offers[key];
    if (!offer || offer.hostedButtonId === 'REPLACE_ME') return;
    var mount = container.querySelector('.gw-pp-mount');
    if (!mount || !window.paypal || !window.paypal.HostedButtons) return;
    var token = (container.gwShowToken || 0) + 1;
    container.gwShowToken = token;
    mount.innerHTML = '';
    var wrapper = document.createElement('div');
    mount.appendChild(wrapper);
    var fallback = container.querySelector('a');
    // inline display styles on the anchors defeat [hidden] — hide via style.
    // Stash the anchor's original inline display (inline-flex / inline-block)
    // once, before we ever hide it, so a failed render restores that exact
    // value instead of clobbering it with ''.
    if (fallback && fallback.gwOrigDisplay === undefined) {
      fallback.gwOrigDisplay = fallback.style.display;
    }
    try {
      window.paypal.HostedButtons({ hostedButtonId: offer.hostedButtonId })
        .render(wrapper)
        .then(function () {
          if (container.gwShowToken !== token) {
            // stale: remove OUR wrapper only; never touch fallback visibility
            if (wrapper.parentNode) wrapper.parentNode.removeChild(wrapper);
            return;
          }
          if (fallback) fallback.style.display = 'none';
        })
        .catch(function () {
          if (container.gwShowToken !== token) {
            if (wrapper.parentNode) wrapper.parentNode.removeChild(wrapper);
            return;
          }
          // render failed: bring the fallback back with its original display
          if (fallback) fallback.style.display = fallback.gwOrigDisplay;
        });
    } catch (e) {
      // one bad ID must not block the other offers
      if (container.gwShowToken === token && fallback) {
        fallback.style.display = fallback.gwOrigDisplay;
      }
    }
  }

  // Schedules a render: runs it if the SDK is ready, else queues it and
  // kicks off the (single) SDK load. The token bump happens inside
  // renderOffer when the render actually starts; queued jobs that lost to a
  // newer call are neutralized by the token check in .then/.catch.
  function requestRender(key, container) {
    if (window.GAELWORX_PAYPAL.clientId === 'REPLACE_ME') return;
    var offer = window.GAELWORX_PAYPAL.offers[key];
    if (!offer || offer.hostedButtonId === 'REPLACE_ME') return;
    if (sdkState === 'ready') { renderOffer(key, container); return; }
    if (sdkState === 'failed') return;
    queued.push(function () { renderOffer(key, container); });
    loadSdk();
  }

  // map: { deposit: '#sel', full: '#sel', year: '#sel' } — any subset.
  // opts: { immediate: true } renders now (for containers just un-hidden —
  // PayPal buttons rendered into display:none containers size to 0).
  // Default is lazy: one IntersectionObserver renders each offer as it nears
  // the viewport, so the SDK never loads on pages nobody scrolls.
  window.gaelworxRenderOffers = function (map, opts) {
    var immediate = !!(opts && opts.immediate) || !('IntersectionObserver' in window);
    var observer = null;
    if (!immediate) {
      observer = new IntersectionObserver(function (entries) {
        for (var i = 0; i < entries.length; i++) {
          if (!entries[i].isIntersecting) continue;
          var el = entries[i].target;
          observer.unobserve(el);
          requestRender(el.getAttribute('data-gw-offer'), el);
        }
      }, { rootMargin: '250px' });
    }
    for (var key in map) {
      if (!map.hasOwnProperty(key)) continue;
      var container = document.querySelector(map[key]);
      if (!container) continue;
      if (immediate) {
        requestRender(key, container);
      } else {
        container.setAttribute('data-gw-offer', key);
        observer.observe(container);
      }
    }
  };

  // Renders `key` into the .gw-pp-mount inside `sel`'s container, clearing
  // whatever button was there (the toggle path). Routes through the same
  // token-aware renderOffer as the initial renders, so a slow SDK/render for
  // an older selection is torn down instead of overwriting the newer one.
  // Success hides the fallback <a>; a failed re-render restores it.
  window.gaelworxShowOffer = function (sel, key) {
    if (window.GAELWORX_PAYPAL.clientId === 'REPLACE_ME') return;
    var offer = window.GAELWORX_PAYPAL.offers[key];
    if (!offer || offer.hostedButtonId === 'REPLACE_ME') return;
    var container = document.querySelector(sel);
    if (!container) return;
    var mount = container.querySelector('.gw-pp-mount');
    if (!mount || sdkState === 'failed') return;
    mount.innerHTML = ''; // clear the old button immediately for instant feedback
    requestRender(key, container);
  };
})();
