/* ------------------------------------------------------------------ *
 *  POOL WATER — R3F fullscreen caustics + mouse ripples + scroll dive
 *  Plain-JS web component. No static imports / no JSX so it loads under
 *  any evaluator. Deps pulled at runtime from esm.sh (deps pinned so
 *  react-three-fiber shares one THREE / React instance).
 *
 *  Bridge: window.__POOL = { scroll, scrollVel, dark, mouse:{x,y},
 *                            ripples:[{x,y,t}], colors:{deep,shallow,foam,sun} }
 * ------------------------------------------------------------------ */
(function () {
  var THREE_URL = 'https://esm.sh/three@0.160.0';

  var vert = [
    'varying vec2 vUv;',
    'void main(){ vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }'
  ].join('\n');

  var frag = [
    'precision highp float;',
    'varying vec2 vUv;',
    'uniform float uTime, uTimeW, uScroll, uScrollVel;',
    'uniform vec2  uRes, uMouse;',
    'uniform vec4  uRipples[12];',
    'uniform vec3  uDeep, uShallow, uFoam, uSun;',
    'uniform float uClarity;',
    'uniform vec3  uMurkDeep, uMurkShallow, uMurkFoam;',
    'uniform vec4  uWeights;', // x: algae blobs, y: specks, z: surface film, w: turbidity haze
    'uniform float uIri;',
    'uniform float uDark;',
    '#define TAU 6.28318530718',
    '#define ITER 5',
    'float hash21(vec2 p){ p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }',
    'float vnoise(vec2 p){ vec2 i = floor(p); vec2 f = fract(p); f = f*f*(3.0-2.0*f);',
    '  return mix(mix(hash21(i), hash21(i+vec2(1,0)), f.x), mix(hash21(i+vec2(0,1)), hash21(i+vec2(1,1)), f.x), f.y); }',
    // classic screen-space caustic field (shadertoy MdlXz8, adapted)
    'float caustic(vec2 uv, float time){',
    '  vec2 p = mod(uv * TAU, TAU) - 250.0;',
    '  vec2 i = vec2(p);',
    '  float c = 1.0; float inten = 0.005;',
    '  for(int n = 0; n < ITER; n++){',
    '    float t = time * (1.0 - (3.5 / float(n + 1)));',
    '    i = p + vec2(cos(t - i.x) + sin(t + i.y), sin(t - i.y) + cos(t + i.x));',
    '    c += 1.0 / length(vec2(p.x / (sin(i.x + t) / inten), p.y / (cos(i.y + t) / inten)));',
    '  }',
    '  c /= float(ITER);',
    '  c = 1.17 - pow(c, 1.4);',
    '  return c;',
    '}',
    'void main(){',
    '  vec2 uv = vUv;',
    '  float aspect = uRes.x / max(uRes.y, 1.0);',
    '  vec2 auv = vec2(uv.x * aspect, uv.y);',
    // mouse / scroll ripples
    '  vec2 disp = vec2(0.0); float rippleLight = 0.0;',
    '  for(int k = 0; k < 12; k++){',
    '    vec4 r = uRipples[k];',
    '    if(r.z < 0.0) continue;',
    '    vec2 rp = vec2(r.x * aspect, r.y);',
    '    float d = distance(auv, rp);',
    '    float age = uTime - r.z;',
    '    if(age < 0.0) continue;',
    '    float radius = age * 0.5;',
    '    float bw = 10.0 / (1.0 + age * 1.6);',
    '    float bnd = exp(-pow((d - radius) * bw, 2.0));',
    '    float life = exp(-age * 1.15) * smoothstep(0.0, 0.12, age);',
    '    vec2 dir = normalize(auv - rp + 1e-4);',
    '    disp += dir * bnd * life * 0.05 * r.w * sin((d - radius) * 42.0 - uTime * 4.2);',
    '    rippleLight += bnd * life * r.w;',
    '  }',
    // caustic light on pool floor
    '  float t = uTime * 0.32 + 23.0;',
    '  vec2 cuv = (auv + disp) * 2.15;',
    '  cuv += vec2(0.0, -uTime * 0.025 + uScroll * 0.9);',
    '  float c1 = caustic(cuv, t);',
    '  float c2 = caustic(cuv * 1.7 + 4.0, t * 0.85);',
    '  float caust = clamp(pow(max(c1, c2 * 0.65), 1.5), 0.0, 1.0);',
    // depth gradient
    '  float cl = clamp(uClarity, 0.0, 1.0);',
    '  float dgrad = smoothstep(-0.05, 1.32, uv.y - uScroll * 0.55);',
    '  vec3 water = mix(mix(uMurkDeep, uMurkShallow, dgrad), mix(uDeep, uShallow, dgrad), cl);',
    '  vec3 lightTint = mix(uMurkFoam, mix(uSun, uFoam, dgrad), cl);',
    '  vec3 col = water + caust * mix(0.14, 1.0, cl) * lightTint * (0.48 + 0.52 * dgrad);',
    '  float scum = smoothstep(0.55, 0.95, c1) * (1.0 - cl);',
    '  col += uMurkFoam * scum * 0.24;',
    '  float algae = smoothstep(0.5, 0.95, c2) * (1.0 - cl);',
    '  col = mix(col, uMurkShallow * 1.2, algae * 0.4);',
    '  float murk = 1.0 - cl;',
    // parallax algae layers (3 depths, offset by scroll at different rates) + swamp bubbles
    '  if (murk > 0.01) {',
    '    float a1 = smoothstep(0.50, 0.82, vnoise(auv * 2.6 + vec2(uTime * 0.06, uScroll * 0.45 + 2.0)));',
    '    float a2 = smoothstep(0.54, 0.86, vnoise(auv * 4.8 + vec2(-uTime * 0.09, uScroll * 0.95 + 7.3)));',
    '    float a3 = smoothstep(0.58, 0.90, vnoise(auv * 8.5 + vec2(uTime * 0.12, uScroll * 1.8 + 3.1)));',
    '    col = mix(col, uMurkShallow * 1.35, a1 * murk * 0.35 * uWeights.x);',
    '    col = mix(col, uMurkDeep * 1.3,    a2 * murk * 0.34 * uWeights.x);',
    '    col = mix(col, uMurkFoam * 0.85,   a3 * murk * 0.20 * uWeights.z);',
    // turbidity haze — milky suspension that flattens contrast (cloudy-water preset)
    '    float haze = 0.55 + 0.30 * vnoise(auv * 2.0 + vec2(uTime * 0.05, uScroll * 0.6));',
    '    col = mix(col, uMurkFoam * (0.72 + 0.28 * dgrad), clamp(uWeights.w, 0.0, 1.4) * 0.55 * murk * haze);',
    // sediment plumes — deepest layer, slow billowing dark clouds near the bottom
    '    float sed = vnoise(auv * 1.4 + vec2(uTime * 0.02, uTime * 0.05 + uScroll * 0.25));',
    '    sed = smoothstep(0.45, 0.9, sed) * (1.0 - smoothstep(0.2, 0.75, uv.y));',
    '    col = mix(col, uMurkDeep * 0.75, sed * murk * 0.5 * mix(0.6, 1.2, clamp(uWeights.w, 0.0, 1.0)));',
    // dusty light shafts barely cutting through the murk
    '    float shaft = vnoise(vec2(auv.x * 3.0 - auv.y * 0.6 + uTime * 0.03, 1.7));',
    '    shaft = smoothstep(0.55, 0.95, shaft) * smoothstep(0.3, 1.0, uv.y);',
    '    col += vec3(0.10, 0.11, 0.06) * shaft * murk * 0.45;',
    // oily scum filaments on the surface (ridged noise)
    '    float rn = vnoise(auv * 6.0 + vec2(uTime * 0.04, uScroll * 1.3));',
    '    float fil = 1.0 - abs(2.0 * rn - 1.0);',
    '    fil = smoothstep(0.75, 0.98, fil);',
    '    col += uMurkFoam * fil * 0.10 * murk * smoothstep(0.5, 0.95, uv.y) * uWeights.z;',
    // thin-film iridescence on the surface film (cosine-palette approximation, oil-sheen style)
    '    vec3 iri = 0.5 + 0.5 * cos(TAU * (rn * 2.2 + vec3(0.0, 0.33, 0.66)));',
    '    col += iri * fil * uIri * murk * 0.30 * smoothstep(0.4, 0.95, uv.y);',
    // duckweed specks — nearest layer, fastest parallax, clustered toward the surface
    '  }',
    '  float sheen = smoothstep(0.72, 1.0, uv.y) * caust;',
    '  col += uFoam * sheen * 0.22 * mix(0.25, 1.0, cl);',
    '  col += mix(uMurkFoam, uFoam, cl) * rippleLight * mix(0.24, 0.5, cl);',
    '  col += caust * clamp(abs(uScrollVel) * 6.0, 0.0, 1.0) * 0.35 * uFoam * cl;',
    // star-wars blackout — crush the scene to near-black but keep the sunlight
    // refractors alive as an iridescent web (before vignette/grain so both still
    // shape the black frame)
    '  if (uDark > 0.001) {',
    '    vec3 iriC = 0.5 + 0.5 * cos(TAU * (caust * 1.6 + vec3(0.0, 0.33, 0.66)));',
    '    float web = smoothstep(0.5, 1.0, caust);', // only the bright refractor web survives the dark
    '    vec3 blk = web * iriC * 0.6',
    '             + col * 0.05',
    '             + rippleLight * vec3(0.10, 0.12, 0.15);',
    '    col = mix(col, blk, uDark);',
    '  }',
    '  float vig = smoothstep(1.35, 0.25, length((uv - 0.5) * vec2(aspect, 1.0)));',
    '  col *= mix(mix(0.62, 0.8, cl), 1.0, vig);',
    '  float g = fract(sin(dot(uv * uRes, vec2(12.9898, 78.233))) * 43758.5453);',
    '  col += (g - 0.5) * mix(0.05, 0.015, cl);',
    '  gl_FragColor = vec4(col, 1.0);',
    '}'
  ].join('\n');

  var libs = null;
  var THREE_URLS = [
    'https://esm.sh/three@0.160.0',
    'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js',
    'https://unpkg.com/three@0.160.0/build/three.module.js'
  ];
  function tryImport(i) {
    if (i >= THREE_URLS.length) return Promise.reject(new Error('all three.js CDNs failed'));
    return import(THREE_URLS[i]).catch(function (e) {
      console.warn('[water-scene] cdn failed: ' + THREE_URLS[i], e && (e.message || e));
      return tryImport(i + 1);
    });
  }
  function load() {
    if (libs) return Promise.resolve(libs);
    return tryImport(0).then(function (mod) {
      libs = { THREE: mod };
      return libs;
    });
  }

  // WebGL availability probe. Create a throwaway context so we can bail
  // cleanly on WebGL-less browsers (or ones where context creation is blocked)
  // instead of letting WebGLRenderer throw less predictably deep in three.js.
  // The throwaway context is released immediately so it never occupies one of
  // the browser's limited live-context slots.
  function webglSupported() {
    try {
      var c = document.createElement('canvas');
      var gl = c.getContext('webgl2') || c.getContext('webgl') || c.getContext('experimental-webgl');
      if (!gl || typeof gl.getParameter !== 'function') return false;
      var lose = gl.getExtension && gl.getExtension('WEBGL_lose_context');
      if (lose) lose.loseContext();
      return true;
    } catch (e) {
      return false;
    }
  }

  function mount(host) {
    var disposed = false;
    var cleanup = function () { disposed = true; };
    load().then(function (L) {
      if (disposed) return;
      var THREE = L.THREE;
      // Expected, handled condition on WebGL-less browsers: bail through the
      // shared catch below (logged as a warning, not an error). The page's
      // static swamp-black backdrop stays as the correct fallback visual.
      if (!webglSupported()) {
        var noWebGL = new Error('WebGL unavailable — leaving static backdrop');
        noWebGL.expected = true;
        throw noWebGL;
      }
      var canvas = document.createElement('canvas');
      canvas.style.cssText = 'display:block;width:100%;height:100%;';
      host.appendChild(canvas);

      var renderer = new THREE.WebGLRenderer({
        canvas: canvas, antialias: true, alpha: false,
        powerPreference: 'high-performance', preserveDrawingBuffer: true
      });
      renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));

      var scene = new THREE.Scene();
      var camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

      var ripples = [];
      for (var i = 0; i < 12; i++) ripples.push(new THREE.Vector4(0, 0, -1, 0));
      var uniforms = {
        uTime:      { value: 0 },
        uTimeW:     { value: 0 },
        uScroll:    { value: 0 },
        uScrollVel: { value: 0 },
        uRes:       { value: new THREE.Vector2(1, 1) },
        uMouse:     { value: new THREE.Vector2(0.5, 0.5) },
        uRipples:   { value: ripples },
        uDeep:      { value: new THREE.Color('#06222e') },
        uShallow:   { value: new THREE.Color('#1aa6a0') },
        uFoam:      { value: new THREE.Color('#dff7f1') },
        uSun:       { value: new THREE.Color('#8ff0e6') },
        uClarity:   { value: (window.__POOL && window.__POOL.clarity != null) ? window.__POOL.clarity : 1 },
        uMurkDeep:  { value: new THREE.Color('#141d0c') },
        uMurkShallow: { value: new THREE.Color('#4a6120') },
        uMurkFoam:  { value: new THREE.Color('#a8b86a') },
        uWeights:   { value: new THREE.Vector4(1, 1, 1, 0) },
        uIri:       { value: 0 },
        uDark:      { value: 0 }
      };

      var mesh = new THREE.Mesh(
        new THREE.PlaneGeometry(2, 2),
        new THREE.ShaderMaterial({
          vertexShader: vert, fragmentShader: frag, uniforms: uniforms,
          depthTest: false, depthWrite: false
        })
      );
      mesh.frustumCulled = false;
      scene.add(mesh);

      var size = function () {
        var r = host.getBoundingClientRect();
        var w = r.width || window.innerWidth, hgt = r.height || window.innerHeight;
        renderer.setSize(w, hgt, false);
        uniforms.uRes.value.set(w, hgt);
      };
      size();
      var ro = new ResizeObserver(size);
      ro.observe(host);

      var last = performance.now();
      var raf = 0;
      var running = false;
      var loop = function (now) {
        raf = requestAnimationFrame(loop);
        try {
        var S = window.__POOL || (window.__POOL = {});
        var u = uniforms;
        var dt = Math.min((now - last) / 1000 || 0.016, 0.05);
        last = now;
        // water time flows with clarity: swamp is thick and near-still, clear water is fluid
        var flow = 0.10 + 0.90 * Math.max(0, Math.min(1, u.uClarity.value));
        u.uTime.value += dt * flow;
        u.uTimeW.value += dt;
        S.now = u.uTime.value; // shared clock so DOM ripples age correctly
        u.uScroll.value    += ((S.scroll    || 0) - u.uScroll.value)    * 0.06;
        u.uScrollVel.value += ((S.scrollVel || 0) - u.uScrollVel.value) * 0.12;
        var clT = (S.clarity == null) ? 1 : S.clarity;
        u.uClarity.value += (clT - u.uClarity.value) * 0.07;
        u.uDark.value += ((S.dark || 0) - u.uDark.value) * 0.08;
        if (S.mouse) u.uMouse.value.set(S.mouse.x, S.mouse.y);
        if (S.colors) {
          u.uDeep.value.set(S.colors.deep);   u.uShallow.value.set(S.colors.shallow);
          u.uFoam.value.set(S.colors.foam);   u.uSun.value.set(S.colors.sun);
        }
        if (S.murk) {
          u.uMurkDeep.value.set(S.murk.deep); u.uMurkShallow.value.set(S.murk.shallow); u.uMurkFoam.value.set(S.murk.foam);
          var mw = S.murk.w || [1, 1, 1, 0];
          u.uWeights.value.set(mw[0], mw[1], mw[2], mw[3]);
          u.uIri.value = (S.murk.iri || 0) + u.uDark.value * 0.85;
        }
        var rip = S.ripples || [];
        for (var k = 0; k < 12; k++) {
          var r = rip[k]; var v = u.uRipples.value[k];
          if (r) v.set(r.x, r.y, r.t, (r.s == null ? 1 : r.s)); else v.set(0, 0, -1, 0);
        }
        renderer.render(scene, camera);
        } catch (err) {
          // A per-frame failure (e.g. lazy shader-program compilation, or a
          // lost/failed GL context) would otherwise re-throw every frame since
          // the next frame is already scheduled above. Stop and tear down once,
          // silently to the visitor — the static backdrop remains.
          cancelAnimationFrame(raf);
          console.error('[water-scene] render loop failed', err && (err.message || err.stack || String(err)));
          try { cleanup(); } catch (e2) {}
        }
      };
      var startLoop = function () {
        if (running || disposed) return;
        running = true;
        // Reset the clock so the first frame after a (re)start has a small dt
        // instead of a spike proportional to how long we were paused.
        last = performance.now();
        raf = requestAnimationFrame(loop);
      };
      var stopLoop = function () {
        running = false;
        cancelAnimationFrame(raf);
      };
      var onVisibility = function () {
        if (document.hidden) stopLoop();
        else startLoop();
      };
      // Honor reduced-motion: paint a single static frame and never spin up the
      // continuous loop. Otherwise run normally, but pause while the tab is hidden.
      var reduceMotion = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
      if (reduceMotion) {
        renderer.render(scene, camera);
      } else {
        document.addEventListener('visibilitychange', onVisibility);
        if (!document.hidden) startLoop();
      }

      cleanup = function () {
        if (disposed) return; // idempotent: error path + disconnectedCallback may both call this
        disposed = true;
        running = false;
        document.removeEventListener('visibilitychange', onVisibility);
        cancelAnimationFrame(raf);
        ro.disconnect();
        mesh.geometry.dispose();
        mesh.material.dispose();
        renderer.dispose();
        canvas.remove();
      };
    }).catch(function (e) {
      if (e && e.expected) {
        // Expected, handled condition (no WebGL) — not an error. Static backdrop stands.
        console.warn('[water-scene] ' + (e.message || 'WebGL unavailable'));
      } else {
        console.error('[water-scene] load failed', e && (e.message || e.stack || String(e)));
      }
    });
    return function () { cleanup(); };
  }

  if (!customElements.get('water-scene')) {
    customElements.define('water-scene', class extends HTMLElement {
      connectedCallback() {
        this.style.cssText = 'position:absolute;inset:0;display:block;';
        var self = this;
        requestAnimationFrame(function () { self._cleanup = mount(self); });
      }
      disconnectedCallback() { if (this._cleanup) this._cleanup(); }
    });
  }
})();
