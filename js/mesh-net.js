/* mesh-net — animated mesh-network primitive on a canvas.
   Drifting peripheral nodes, gradient mesh edges, data "packets" that stream
   inward to a central hub, and a periodic network-wide broadcast pulse.
   Self-registers <mesh-net>; fills its host; teal palette on transparent bg. */
(function () {
  'use strict';
  if (customElements.get('mesh-net')) return;

  var LINE = '127,227,218';

  function mount(host) {
    var canvas = document.createElement('canvas');
    canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;display:block;';
    host.appendChild(canvas);
    var ctx = canvas.getContext('2d');
    if (!ctx) {
      // Canvas 2d unsupported — bail out cleanly, no animation loop, no throw.
      canvas.remove();
      host._cleanup = function () {};
      return;
    }
    var DPR = Math.min(2, window.devicePixelRatio || 1);
    var W = 1, H = 1, nodes = [], edges = [], pulses = [], hub = { x: 0, y: 0 };
    var raf = 0, t0 = performance.now(), lastIn = 0, lastBcast = -2000, hubFlare = 0;
    var reduceMotion = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    var hiddenAt = 0;

    function build() {
      nodes = []; edges = [];
      var cx = W / 2, cy = H / 2;
      hub = { x: cx, y: cy };
      var N = Math.max(10, Math.min(15, Math.round(W / 62)));
      for (var i = 0; i < N; i++) {
        var ring = i % 2 === 0 ? 0.86 : 0.52;
        var a = (i / N) * Math.PI * 2 + (i % 2) * 0.34;
        var jitter = 0.84 + (Math.sin(i * 12.9) * 0.5 + 0.5) * 0.3;
        nodes.push({
          bx: cx + Math.cos(a) * W * 0.44 * ring * jitter,
          by: cy + Math.sin(a) * H * 0.44 * ring * jitter,
          r: 2.4 + (Math.sin(i * 7.3) * 0.5 + 0.5) * 2.6,
          ph: i * 0.7, sp: 0.55 + (i % 5) * 0.13, amp: 5 + (i % 4) * 3.5
        });
      }
      for (var i2 = 0; i2 < nodes.length; i2++) {
        edges.push({ a: i2, b: -1 });
        var ds = [];
        for (var j = 0; j < nodes.length; j++) {
          if (j !== i2) { var dx = nodes[i2].bx - nodes[j].bx, dy = nodes[i2].by - nodes[j].by; ds.push({ j: j, d: dx * dx + dy * dy }); }
        }
        ds.sort(function (p, q) { return p.d - q.d; });
        for (var k = 0; k < 2 && k < ds.length; k++) { if (ds[k].j > i2) edges.push({ a: i2, b: ds[k].j }); }
      }
    }

    function pos(n, t) { return { x: n.bx + Math.cos(t * 0.0006 * n.sp + n.ph) * n.amp, y: n.by + Math.sin(t * 0.0007 * n.sp + n.ph) * n.amp }; }
    function nodePos(idx, t) { return idx < 0 ? hub : pos(nodes[idx], t); }

    function render(now) {
      var t = now - t0;
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      ctx.clearRect(0, 0, W, H);

      for (var e = 0; e < edges.length; e++) {
        var A = nodePos(edges[e].a, t), B = nodePos(edges[e].b, t);
        var g = ctx.createLinearGradient(A.x, A.y, B.x, B.y);
        g.addColorStop(0, 'rgba(' + LINE + ',0.04)');
        g.addColorStop(0.5, 'rgba(' + LINE + ',0.20)');
        g.addColorStop(1, 'rgba(' + LINE + ',0.04)');
        ctx.strokeStyle = g; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(A.x, A.y); ctx.lineTo(B.x, B.y); ctx.stroke();
      }

      if (t - lastIn > 620 && nodes.length) { lastIn = t; pulses.push({ from: Math.floor(Math.random() * nodes.length), to: -1, p: 0, sp: 0.45 + Math.random() * 0.4, dir: 'in', delay: 0 }); }
      if (t - lastBcast > 4400 && nodes.length) {
        lastBcast = t; hubFlare = 1.4;
        for (var b = 0; b < nodes.length; b++) pulses.push({ from: -1, to: b, p: 0, sp: 0.55 + Math.random() * 0.4, dir: 'out', delay: Math.random() * 0.28 });
      }

      for (var p = pulses.length - 1; p >= 0; p--) {
        var pu = pulses[p];
        if (pu.delay > 0) { pu.delay -= 0.016; continue; }
        pu.p += 0.016 * pu.sp;
        if (pu.p >= 1) { if (pu.dir === 'in') hubFlare = Math.min(1.5, hubFlare + 0.55); pulses.splice(p, 1); continue; }
        var Ap = nodePos(pu.from, t), Bp = nodePos(pu.to, t);
        var x = Ap.x + (Bp.x - Ap.x) * pu.p, y = Ap.y + (Bp.y - Ap.y) * pu.p;
        var gg = ctx.createRadialGradient(x, y, 0, x, y, 11);
        gg.addColorStop(0, 'rgba(191,244,238,0.9)');
        gg.addColorStop(1, 'rgba(127,227,218,0)');
        ctx.fillStyle = gg; ctx.beginPath(); ctx.arc(x, y, 11, 0, 7); ctx.fill();
        ctx.fillStyle = '#eafffb'; ctx.beginPath(); ctx.arc(x, y, 2.4, 0, 7); ctx.fill();
      }

      for (var i = 0; i < nodes.length; i++) {
        var P = pos(nodes[i], t), n = nodes[i], pulse = 0.55 + 0.45 * Math.sin(t * 0.002 + n.ph);
        var halo = ctx.createRadialGradient(P.x, P.y, 0, P.x, P.y, n.r * 6.5);
        halo.addColorStop(0, 'rgba(' + LINE + ',' + (0.26 * pulse) + ')');
        halo.addColorStop(1, 'rgba(' + LINE + ',0)');
        ctx.fillStyle = halo; ctx.beginPath(); ctx.arc(P.x, P.y, n.r * 6.5, 0, 7); ctx.fill();
        ctx.fillStyle = '#9ff0e7'; ctx.beginPath(); ctx.arc(P.x, P.y, n.r, 0, 7); ctx.fill();
      }

      hubFlare = Math.max(0, hubFlare - 0.02);
      var hr = 24 + hubFlare * 12;
      var hg = ctx.createRadialGradient(hub.x, hub.y, 0, hub.x, hub.y, hr * 2.8);
      hg.addColorStop(0, 'rgba(142,240,230,' + (0.45 + hubFlare * 0.32) + ')');
      hg.addColorStop(0.45, 'rgba(55,199,191,0.16)');
      hg.addColorStop(1, 'rgba(55,199,191,0)');
      ctx.fillStyle = hg; ctx.beginPath(); ctx.arc(hub.x, hub.y, hr * 2.8, 0, 7); ctx.fill();
    }

    function frame(now) {
      raf = requestAnimationFrame(frame);
      if (host.offsetParent === null) return; // hidden — skip work
      render(now);
    }

    function size() {
      var r = host.getBoundingClientRect();
      W = r.width || 320; H = r.height || 320;
      canvas.width = Math.round(W * DPR); canvas.height = Math.round(H * DPR);
      build();
    }
    size();
    var ro = new ResizeObserver(function () {
      size();
      if (reduceMotion) render(performance.now()); // repaint the static frame after a resize
    });
    ro.observe(host);
    if (reduceMotion) {
      render(performance.now()); // one static frame, no continuous loop
      host._cleanup = function () { ro.disconnect(); canvas.remove(); };
    } else {
      var onVisibility = function () {
        if (document.hidden) {
          if (raf) { cancelAnimationFrame(raf); raf = 0; }
          hiddenAt = performance.now();
        } else if (!raf) {
          t0 += performance.now() - hiddenAt; // resume without a time jump
          raf = requestAnimationFrame(frame);
        }
      };
      document.addEventListener('visibilitychange', onVisibility);
      if (document.hidden) hiddenAt = performance.now(); else raf = requestAnimationFrame(frame);
      host._cleanup = function () {
        document.removeEventListener('visibilitychange', onVisibility);
        cancelAnimationFrame(raf); ro.disconnect(); canvas.remove();
      };
    }
  }

  customElements.define('mesh-net', class extends HTMLElement {
    connectedCallback() {
      this.style.cssText = 'position:absolute;inset:0;display:block;';
      var self = this;
      requestAnimationFrame(function () { mount(self); });
    }
    disconnectedCallback() { if (this._cleanup) this._cleanup(); }
  });
})();
