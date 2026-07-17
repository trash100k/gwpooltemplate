/* ------------------------------------------------------------------ *
 *  RESCUE SLIDER — same-photo before/after (raw WebGL, no libraries)
 *
 *  CONFIG / REBRANDING: this component reads its photo from the single
 *  <img> inside #ow-slider in our-work.html. To rebrand a deployment,
 *  swap that <img>'s src (and width/height attrs) — one URL per buyer.
 *  The swampy "before" is graded procedurally from that same photo in
 *  a fragment shader (hue-rotated toward algae, desaturated blues,
 *  murk vignette, drifting specks, refraction wobble), so the
 *  before/after story stays truthful for ANY pool photo. No second,
 *  doctored image ships with the site.
 *
 *  Rendering model: render on demand (init / drag / resize), not a
 *  continuous loop; the context keeps its last frame via
 *  preserveDrawingBuffer. An idle caustic shimmer rAF loop runs ONLY
 *  while the slider is in the viewport and reduced-motion allows.
 *
 *  Fallbacks: no WebGL -> two stacked copies of the SAME image, the
 *  top one clipped + CSS-filtered swampy, same drag/keyboard logic.
 *  No JS at all -> the plain photo still shows.
 * ------------------------------------------------------------------ */
(function () {
  'use strict';

  var root = document.getElementById('ow-slider');
  if (!root) return;
  var img = root.querySelector('img');
  var handle = document.getElementById('ow-slider-handle');
  if (!img || !handle) return;

  var reduceMotion = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);

  var vert = [
    'attribute vec2 aPos;',
    'varying vec2 vUv;',
    'void main(){ vUv = aPos * 0.5 + 0.5; gl_Position = vec4(aPos, 0.0, 1.0); }'
  ].join('\n');

  var frag = [
    'precision mediump float;',
    'varying vec2 vUv;',
    'uniform sampler2D uTex;',
    'uniform vec2  uRes;',   // canvas size, device px
    'uniform vec2  uCover;', // visible fraction of the image per axis (object-fit:cover)
    'uniform float uSplit;', // 0..1 divider position
    'uniform float uBand;',  // seam ripple half-width, device px
    'uniform float uTime;',  // seconds
    'float hash21(vec2 p){ p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }',
    'float vnoise(vec2 p){ vec2 i = floor(p); vec2 f = fract(p); f = f*f*(3.0-2.0*f);',
    '  return mix(mix(hash21(i), hash21(i+vec2(1,0)), f.x), mix(hash21(i+vec2(0,1)), hash21(i+vec2(1,1)), f.x), f.y); }',
    'void main(){',
    '  vec2 base = (vUv - 0.5) * uCover + 0.5;',
    '  float d = (vUv.x - uSplit) * uRes.x;',            // signed px distance to the seam
    '  float seam = exp(-(d*d) / max(uBand*uBand, 1.0));',
    '  float side = smoothstep(-1.5, 1.5, d);',           // 0 = swamp (left), 1 = clean (right)
    // clean side: the untouched photo
    '  vec3 clean = texture2D(uTex, base).rgb;',
    // swamp side: subtle refraction wobble on the SAME photo
    '  vec2 wob = vec2(vnoise(base*9.0 + uTime*0.14), vnoise(base*9.0 - uTime*0.11)) - 0.5;',
    '  vec2 suv = base + wob * 0.008 * (1.0 - side);',
    // seam ripple: displacement band 10–14px wide
    '  suv.x += seam * (uBand / uRes.x) * 1.4 * sin(vUv.y*70.0 + uTime*2.2);',
    '  vec3 c = texture2D(uTex, suv).rgb;',
    '  float lum = dot(c, vec3(0.299, 0.587, 0.114));',
    // waterness: how blue/cyan the pixel is — the grade leans hardest on the water
    '  float waterness = smoothstep(0.02, 0.2, max(c.b, c.g) - c.r);',
    '  vec3 desat = mix(c, vec3(lum), 0.3 + 0.4*waterness);',       // desaturate, blues most
    '  vec3 algae = vec3(0.40, 0.50, 0.16) * (lum*1.4 + 0.1);',     // hue target: green-brown
    '  vec3 swamp = mix(desat * vec3(0.97, 0.93, 0.80), mix(desat, algae, 0.74), waterness);',
    '  swamp *= 0.74;',                                             // darken
    '  float vig = smoothstep(1.15, 0.3, length(vUv - 0.5) * 1.5);',// murk vignette
    '  swamp *= mix(0.7, 1.0, vig);',
    // drifting particulate specks
    '  float sp = smoothstep(0.82, 0.97, vnoise(base * vec2(140.0, 90.0) + vec2(uTime*0.5, -uTime*0.33)));',
    '  swamp += vec3(0.15, 0.16, 0.06) * sp * (0.3 + 0.7*waterness);',
    '  vec3 col = mix(swamp, clean, side);',
    '  col += vec3(0.93, 0.99, 0.97) * seam * 0.3;',                // foam-white seam glow
    '  gl_FragColor = vec4(col, 1.0);',
    '}'
  ].join('\n');

  // ---- shared state ----
  var split = 50;      // percent
  var api = null;      // { update(), start(), stop(), destroy() } — WebGL or CSS fallback
  var nudged = false;

  function clampPct(p) { return Math.max(0, Math.min(100, p)); }

  function setSplit(p) {
    split = clampPct(p);
    handle.style.left = split.toFixed(2) + '%';
    handle.setAttribute('aria-valuenow', String(Math.round(split)));
    if (api) api.update();
  }

  // ---- drag: pointer events cover mouse + touch (touch-action:none on #ow-slider) ----
  var dragging = false;
  function posToPct(clientX) {
    var r = root.getBoundingClientRect();
    return r.width ? ((clientX - r.left) / r.width) * 100 : split;
  }
  root.addEventListener('pointerdown', function (e) {
    dragging = true;
    try { root.setPointerCapture(e.pointerId); } catch (_) {}
    setSplit(posToPct(e.clientX));
  });
  root.addEventListener('pointermove', function (e) { if (dragging) setSplit(posToPct(e.clientX)); });
  root.addEventListener('pointerup', function () { dragging = false; });
  root.addEventListener('pointercancel', function () { dragging = false; });

  // ---- keyboard: the handle is the slider control ----
  handle.addEventListener('keydown', function (e) {
    var p = null;
    if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') p = split - 4;
    else if (e.key === 'ArrowRight' || e.key === 'ArrowUp') p = split + 4;
    else if (e.key === 'Home') p = 0;
    else if (e.key === 'End') p = 100;
    if (p !== null) { e.preventDefault(); setSplit(p); }
  });

  // ---- CSS fallback: clipped clone of the SAME image, swamp-graded by filters ----
  function initFallback() {
    var wrap = document.createElement('div');
    wrap.style.cssText = 'position:absolute;inset:0;pointer-events:none;overflow:hidden;';
    var clone = img.cloneNode(false);
    clone.removeAttribute('id');
    clone.alt = '';
    clone.setAttribute('aria-hidden', 'true');
    clone.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;object-fit:cover;' +
      'filter:sepia(.4) hue-rotate(55deg) saturate(1.35) brightness(.72) contrast(1.05);';
    wrap.appendChild(clone);
    root.insertBefore(wrap, img.nextSibling);
    return {
      update: function () { wrap.style.clipPath = 'inset(0 ' + (100 - split).toFixed(2) + '% 0 0)'; },
      start: function () {}, stop: function () {},
      destroy: function () { wrap.remove(); }
    };
  }

  // ---- WebGL path ----
  function compile(gl, type, src) {
    var sh = gl.createShader(type);
    gl.shaderSource(sh, src);
    gl.compileShader(sh);
    if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
      console.warn('[rescue-slider] shader compile failed', gl.getShaderInfoLog(sh));
      return null;
    }
    return sh;
  }

  function initWebGL() {
    var canvas = document.createElement('canvas');
    canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;display:block;pointer-events:none;';
    var opts = { preserveDrawingBuffer: true, antialias: false, alpha: false, powerPreference: 'low-power' };
    var gl;
    try { gl = canvas.getContext('webgl', opts) || canvas.getContext('experimental-webgl', opts); } catch (_) { gl = null; }
    if (!gl) return null;

    var vs = compile(gl, gl.VERTEX_SHADER, vert);
    var fs = compile(gl, gl.FRAGMENT_SHADER, frag);
    if (!vs || !fs) return null;
    var prog = gl.createProgram();
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      console.warn('[rescue-slider] program link failed', gl.getProgramInfoLog(prog));
      return null;
    }
    gl.useProgram(prog);

    var buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    var aPos = gl.getAttribLocation(prog, 'aPos');
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    var tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    // NPOT-safe params (photo dimensions are arbitrary)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    try {
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, img);
    } catch (e) {
      console.warn('[rescue-slider] texture upload failed', e && (e.message || e));
      return null;
    }

    var U = {
      uRes: gl.getUniformLocation(prog, 'uRes'),
      uCover: gl.getUniformLocation(prog, 'uCover'),
      uSplit: gl.getUniformLocation(prog, 'uSplit'),
      uBand: gl.getUniformLocation(prog, 'uBand'),
      uTime: gl.getUniformLocation(prog, 'uTime')
    };

    var dpr = 1;
    function draw() {
      gl.uniform2f(U.uRes, canvas.width, canvas.height);
      var cov = coverFraction(canvas.width, canvas.height, img.naturalWidth, img.naturalHeight);
      gl.uniform2f(U.uCover, cov[0], cov[1]);
      gl.uniform1f(U.uSplit, split / 100);
      gl.uniform1f(U.uBand, 6 * dpr); // ~12px visible ripple band
      gl.uniform1f(U.uTime, performance.now() / 1000);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }

    // render-on-demand: coalesce update() calls into one frame
    var pending = false;
    function requestRender() {
      if (pending || shimmerRaf) return;
      pending = true;
      requestAnimationFrame(function () { pending = false; draw(); });
    }

    // idle shimmer: continuous loop ONLY while visible and motion is allowed
    var shimmerRaf = 0;
    function shimmerLoop() { draw(); shimmerRaf = requestAnimationFrame(shimmerLoop); }
    function start() { if (!shimmerRaf && !reduceMotion) shimmerRaf = requestAnimationFrame(shimmerLoop); }
    function stop() { cancelAnimationFrame(shimmerRaf); shimmerRaf = 0; }

    function resize() {
      var r = root.getBoundingClientRect();
      dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas.width = Math.max(1, Math.round(r.width * dpr));
      canvas.height = Math.max(1, Math.round(r.height * dpr));
      gl.viewport(0, 0, canvas.width, canvas.height);
      requestRender();
    }

    var ro = new ResizeObserver(resize);
    ro.observe(root);

    // ponytail: on GL context loss we don't rebuild — we swap to the CSS
    // fallback, which is visually close and unconditionally reliable.
    canvas.addEventListener('webglcontextlost', function (e) {
      e.preventDefault();
      if (api && api.destroy === destroy) {
        destroy();
        api = initFallback();
        api.update();
      }
    });

    function destroy() {
      stop();
      ro.disconnect();
      canvas.remove();
    }

    root.insertBefore(canvas, img.nextSibling);
    resize();
    return { update: requestRender, start: start, stop: stop, destroy: destroy };
  }

  // object-fit:cover — fraction of the image visible per axis
  function coverFraction(cw, ch, iw, ih) {
    if (!iw || !ih) return [1, 1];
    var s = Math.max(cw / iw, ch / ih);
    return [cw / (iw * s), ch / (ih * s)];
  }

  // one gentle handle nudge on first intersection (motion-safe only)
  function nudge() {
    if (nudged || reduceMotion) return;
    nudged = true;
    var t0 = performance.now(), dur = 900, from = split;
    (function step(now) {
      if (dragging) return; // the visitor took over — stop immediately
      var t = Math.min(1, (now - t0) / dur);
      setSplit(from - Math.sin(t * Math.PI) * 8);
      if (t < 1) requestAnimationFrame(step);
    })(t0);
  }

  function whenImgReady(cb) {
    if (img.complete && img.naturalWidth) cb();
    else img.addEventListener('load', cb, { once: true });
  }

  // ---- lazy init when near the viewport ----
  var inited = false;
  function init() {
    if (inited) return;
    inited = true;
    whenImgReady(function () {
      api = initWebGL() || initFallback();
      setSplit(split);
      // shimmer visibility gate
      var vio = new IntersectionObserver(function (ents) {
        ents.forEach(function (en) {
          if (en.isIntersecting) { api.start(); if (en.intersectionRatio >= 0.6) nudge(); }
          else api.stop();
        });
      }, { threshold: [0.05, 0.6] });
      vio.observe(root);
    });
  }

  if ('IntersectionObserver' in window) {
    var lio = new IntersectionObserver(function (ents, obs) {
      ents.forEach(function (en) {
        if (en.isIntersecting) { obs.unobserve(root); init(); }
      });
    }, { rootMargin: '200px' });
    lio.observe(root);
  } else {
    init();
  }
})();
