/* us-globe — stationary WebGL globe (Cobe) held fixed on the continental US.
   Network markers are placed only at US metros; Tampa (the active founding
   site) glows brighter with arcs fanning out to the rest of the network.
   No rotation — the globe stays put, only the markers breathe.
   Self-registers <us-globe>; fills its host; teal palette on transparent bg. */
(function () {
  'use strict';
  if (customElements.get('us-globe')) return;

  var COBE_URLS = [
    'https://esm.sh/cobe@2.0.1',
    'https://cdn.jsdelivr.net/npm/cobe@2.0.1/+esm',
    'https://unpkg.com/cobe@2.0.1?module'
  ];
  var lib = null;
  function tryImport(i) {
    if (i >= COBE_URLS.length) return Promise.reject(new Error('all cobe CDNs failed'));
    return import(/* @vite-ignore */ COBE_URLS[i]).catch(function (e) {
      console.warn('[us-globe] cdn failed: ' + COBE_URLS[i], e && (e.message || e));
      return tryImport(i + 1);
    });
  }
  function load() {
    if (lib) return Promise.resolve(lib);
    return tryImport(0).then(function (mod) {
      lib = mod.default || mod;
      return lib;
    });
  }

  function webglSupported() {
    try {
      var c = document.createElement('canvas');
      return !!(c.getContext('webgl2') || c.getContext('webgl') || c.getContext('experimental-webgl'));
    } catch (e) { return false; }
  }

  // Active founding site: Tampa, FL — matches "Building Florida first" copy.
  var ACTIVE = [27.95, -82.46];
  // Rest of the network: continental US metros only, spread coast to coast.
  var NODES = [
    [33.45, -112.07], // Phoenix, AZ
    [30.27, -97.74],  // Austin, TX
    [34.05, -118.24], // Los Angeles, CA
    [47.61, -122.33], // Seattle, WA
    [39.74, -104.99], // Denver, CO
    [41.88, -87.63],  // Chicago, IL
    [33.75, -84.39],  // Atlanta, GA
    [40.71, -74.01],  // New York, NY
    [42.36, -71.06],  // Boston, MA
    [32.78, -96.80],  // Dallas, TX
    [36.16, -86.78],  // Nashville, TN
    [35.23, -80.84],  // Charlotte, NC
    [44.98, -93.27],  // Minneapolis, MN
    [36.17, -115.14], // Las Vegas, NV
    [40.76, -111.89], // Salt Lake City, UT
    [29.95, -90.07],  // New Orleans, LA
    [45.52, -122.68], // Portland, OR
    [39.10, -94.58],  // Kansas City, MO
    [32.72, -117.16]  // San Diego, CA
  ];

  // Fixed camera — no rotation. Cobe has no "focus on region" API, so these
  // were dialed in empirically (render + screenshot + adjust) until the
  // continental US markers sit centered and the network reads clearly.
  var PHI = 0.22;
  var THETA = 0.68;
  var SCALE = 1.8;

  function mount(host) {
    var canvas = document.createElement('canvas');
    canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;display:block;';
    host.appendChild(canvas);

    if (!webglSupported()) { canvas.remove(); host._cleanup = function () {}; return; }

    var reduceMotion = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    var disposed = false, globe = null, DPR = Math.min(2, window.devicePixelRatio || 1);
    var W = 1, H = 1, t0 = performance.now();

    function buildMarkers(t) {
      var list = [{
        location: ACTIVE,
        size: 0.1 + (reduceMotion ? 0 : 0.02 * (0.5 + 0.5 * Math.sin(t * 0.002))),
        color: [0.75, 0.98, 0.94]
      }];
      for (var i = 0; i < NODES.length; i++) {
        list.push({
          location: NODES[i],
          size: reduceMotion ? 0.05 : 0.042 + 0.016 * (0.5 + 0.5 * Math.sin(t * 0.0016 + i * 1.7))
        });
      }
      return list;
    }

    function buildArcs() {
      var arcs = [];
      for (var i = 0; i < NODES.length; i++) {
        arcs.push({ from: ACTIVE, to: NODES[i], color: [0.42, 0.85, 0.79] });
      }
      return arcs;
    }

    function size() {
      var r = host.getBoundingClientRect();
      W = r.width || 320; H = r.height || 320;
    }
    size();

    load().then(function (createGlobe) {
      if (disposed) return;
      var opts = {
        devicePixelRatio: DPR,
        width: W * DPR,
        height: H * DPR,
        phi: PHI,
        theta: THETA,
        dark: 1,
        diffuse: 1.5,
        mapSamples: 15000,
        mapBrightness: 3.4,
        baseColor: [0.07, 0.19, 0.18],
        markerColor: [0.5, 0.92, 0.87],
        glowColor: [0.16, 0.44, 0.42],
        scale: SCALE,
        offset: [0, 0],
        opacity: 1,
        markers: buildMarkers(0),
        arcs: buildArcs(),
        onRender: function (state) {
          state.phi = PHI;
          state.theta = THETA;
          state.width = W * DPR;
          state.height = H * DPR;
          state.markers = buildMarkers(performance.now() - t0);
        }
      };
      globe = createGlobe(canvas, opts);
    }).catch(function (e) {
      console.warn('[us-globe] failed to load', e && (e.message || e));
    });

    var ro = new ResizeObserver(function () {
      size();
      if (globe) globe.update({ width: W * DPR, height: H * DPR });
    });
    ro.observe(host);

    host._cleanup = function () {
      disposed = true;
      ro.disconnect();
      if (globe) globe.destroy();
      canvas.remove();
    };
  }

  customElements.define('us-globe', class extends HTMLElement {
    connectedCallback() {
      this.style.cssText = 'position:absolute;inset:0;display:block;';
      var self = this;
      requestAnimationFrame(function () { mount(self); });
    }
    disconnectedCallback() { if (this._cleanup) this._cleanup(); }
  });
})();
