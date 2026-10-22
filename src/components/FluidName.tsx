'use client';
// The name, rendered to a texture and stirred by the pointer.
//
// A port of the Framer FluidImage component's approach to type rather than a photo: the same
// twelve-point pointer trail, the same vortex + smudge + curl-noise displacement of the sampled
// UVs, the same click burst. What it samples is a canvas with the name drawn into it, so the
// letters themselves smear and swirl, picking up the colours of the folders below as they go.
//
// It is not a fluid solver. There is no velocity field and no dye buffer; the look comes from
// summing a decaying trail of swirls, which is cheap enough to run only while the pointer is near.
//
// The <h1> stays in the DOM with its real text. The canvas is decoration over the top of it, and
// without WebGL — or under reduced motion — the text simply shows as itself.
import { useEffect, useRef } from 'react';

const TRAIL = 12;
const RADIUS = 0.42; // falloff of one trail point, in uv
const STRENGTH = 0.9;
const DISTORTION = 0.45;
const SPEED = 0.4;
const HUE = 0.5;
const CYCLE = 0.05;
const PERSISTENCE = 0.95; // trail decay per 60fps frame
const SMOOTH = 0.14; // pointer easing
const MAX_DPR = 1.75;

const VERT = `attribute vec2 aPos;varying vec2 vUv;
void main(){vUv=aPos*0.5+0.5;gl_Position=vec4(aPos,0.0,1.0);}`;

const FRAG = `precision highp float;
varying vec2 vUv;
uniform sampler2D uTex;
uniform vec2 uRes;
uniform float uTime, uActive, uBurst;
uniform vec2 uTrail[${TRAIL}];
uniform vec2 uVel[${TRAIL}];
uniform float uStr[${TRAIL}];
uniform vec2 uBurstPos;
uniform vec3 uInk, uC1, uC2, uC3, uC4;

vec2 hash2(vec2 p){
  p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
  return -1.0 + 2.0 * fract(sin(p) * 43758.5453123);
}
float gnoise(vec2 p){
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(dot(hash2(i), f), dot(hash2(i + vec2(1.0, 0.0)), f - vec2(1.0, 0.0)), u.x),
             mix(dot(hash2(i + vec2(0.0, 1.0)), f - vec2(0.0, 1.0)),
                 dot(hash2(i + vec2(1.0, 1.0)), f - vec2(1.0, 1.0)), u.x), u.y);
}
float fbm(vec2 p){
  float v = 0.0, a = 0.5;
  for (int i = 0; i < 4; i++) { v += a * gnoise(p); p *= 2.03; a *= 0.5; }
  return v;
}
vec2 curl(vec2 p){
  float e = 0.09;
  return vec2(fbm(p + vec2(0.0, e)) - fbm(p - vec2(0.0, e)),
              fbm(p - vec2(e, 0.0)) - fbm(p + vec2(e, 0.0))) / (2.0 * e);
}

void main(){
  vec2 uv = vUv;
  float aspect = uRes.x / uRes.y;
  vec2 disp = vec2(0.0);
  float heat = 0.0;

  for (int i = 0; i < ${TRAIL}; i++) {
    float s = uStr[i];
    if (s <= 0.002) continue;
    vec2 d = uv - uTrail[i];
    d.x *= aspect;
    float dist = length(d);
    float w = s * exp(-(dist * dist) / (RADIUS_SQ));
    vec2 dir = d / max(dist, 1e-4);
    disp += vec2(-dir.y, dir.x) * w * ${STRENGTH} * 0.012;  // vortex around the point
    disp += uVel[i] * w * ${STRENGTH} * 0.5;                // smudge along its travel
    heat += w;
  }

  // Twelve overlapping trail points sum to roughly ten, so the raw totals have to come back
  // down to a scale where the letters are stirred rather than erased.
  heat *= 0.26;
  float stir = clamp(heat, 0.0, 1.0);
  disp += curl(uv * 3.2 + uTime * ${SPEED} * 0.25) * stir * ${DISTORTION} * 0.035;
  disp *= min(1.0, 0.075 / max(length(disp), 1e-5));

  if (uBurst > 0.002) {
    vec2 bd = uv - uBurstPos; bd.x *= aspect;
    float ring = exp(-pow((length(bd) - (1.0 - uBurst) * 0.5) * 8.0, 2.0));
    disp += normalize(bd + 1e-5) * ring * uBurst * 0.08;
    heat += ring * uBurst;
  }

  float a = texture2D(uTex, uv - disp).a;

  float g = clamp(fbm(uv * 2.4 + disp * 4.0 + uTime * ${CYCLE}) + 0.5 + (${HUE} - 0.5), 0.0, 1.0);
  vec3 grad = mix(mix(uC1, uC2, smoothstep(0.0, 0.5, g)),
                  mix(uC3, uC4, smoothstep(0.5, 1.0, g)),
                  smoothstep(0.3, 0.7, g));
  vec3 col = mix(uInk, grad, clamp(heat * 1.35, 0.0, 1.0) * uActive);
  gl_FragColor = vec4(col * a, a);
}`.replace('RADIUS_SQ', (RADIUS * RADIUS * 0.5).toFixed(5));

/** Accepts whatever getComputedStyle hands back: rgb(), #rgb or #rrggbb. */
function rgb(v: string): [number, number, number] {
  const m = v.match(/[\d.]+/g);
  if (v.trim().startsWith('rgb') && m) return [+m[0] / 255, +m[1] / 255, +m[2] / 255];
  const h = v.trim().replace('#', '');
  const f = h.length === 3 ? h.replace(/./g, (c) => c + c) : h;
  return [parseInt(f.slice(0, 2), 16) / 255, parseInt(f.slice(2, 4), 16) / 255, parseInt(f.slice(4, 6), 16) / 255];
}

function compile(gl: WebGLRenderingContext, type: number, src: string) {
  const sh = gl.createShader(type)!;
  gl.shaderSource(sh, src);
  gl.compileShader(sh);
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(sh) || 'shader');
  return sh;
}

export function FluidName({ children }: { children: string }) {
  const host = useRef<HTMLHeadingElement>(null);
  const text = useRef<HTMLSpanElement>(null);
  const cv = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!host.current || !text.current || !cv.current) return;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const hostEl = host.current;
    const textEl = text.current;
    const canvas = cv.current;

    const ctx3d = canvas.getContext('webgl', {
      alpha: true,
      premultipliedAlpha: true,
      antialias: false,
      depth: false,
    });
    if (!ctx3d) return;
    const gl = ctx3d;

    let prog: WebGLProgram;
    try {
      prog = gl.createProgram()!;
      gl.attachShader(prog, compile(gl, gl.VERTEX_SHADER, VERT));
      gl.attachShader(prog, compile(gl, gl.FRAGMENT_SHADER, FRAG));
      gl.linkProgram(prog);
      if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error('link');
    } catch {
      return;
    }
    gl.useProgram(prog);

    // One oversized triangle; no index buffer, no per-vertex work.
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const aPos = gl.getAttribLocation(prog, 'aPos');
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const u = (n: string) => gl.getUniformLocation(prog, n);
    const U = {
      tex: u('uTex'), res: u('uRes'), time: u('uTime'), active: u('uActive'),
      trail: u('uTrail'), vel: u('uVel'), str: u('uStr'),
      burst: u('uBurst'), burstPos: u('uBurstPos'),
      ink: u('uInk'), c1: u('uC1'), c2: u('uC2'), c3: u('uC3'), c4: u('uC4'),
    };
    // Ink at rest; stirring it reveals the four folder papers underneath. Both live in
    // globals.css so there is one place to change them.
    const hs = getComputedStyle(hostEl);
    gl.uniform3fv(U.ink, rgb(getComputedStyle(textEl).color));
    gl.uniform3fv(U.c1, rgb(hs.getPropertyValue('--fx1') || '#c3c45a'));
    gl.uniform3fv(U.c2, rgb(hs.getPropertyValue('--fx2') || '#e7c0c6'));
    gl.uniform3fv(U.c3, rgb(hs.getPropertyValue('--fx3') || '#b9a1ad'));
    gl.uniform3fv(U.c4, rgb(hs.getPropertyValue('--fx4') || '#9d2a2a'));

    const tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.uniform1i(U.tex, 0);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA); // the shader writes premultiplied
    gl.clearColor(0, 0, 0, 0);

    const paint = document.createElement('canvas');
    const ctx = paint.getContext('2d')!;
    let W = 0;
    let H = 0;
    let pad = 60;

    /** Redraw the name into the texture at the size the real <h1> is currently laid out at. */
    function build() {
      const r = textEl.getBoundingClientRect();
      if (r.width < 2) return false;
      const cs = getComputedStyle(textEl);
      const size = parseFloat(cs.fontSize);
      const lh = parseFloat(cs.lineHeight) || size * 1.1;
      pad = Math.round(Math.min(120, Math.max(40, size * 0.8)));
      W = Math.ceil(r.width) + pad * 2;
      H = Math.ceil(r.height) + pad * 2;

      const dpr = Math.min(MAX_DPR, devicePixelRatio || 1);
      paint.width = canvas.width = Math.round(W * dpr);
      paint.height = canvas.height = Math.round(H * dpr);
      canvas.style.width = `${W}px`;
      canvas.style.height = `${H}px`;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);
      ctx.font = `${cs.fontStyle} ${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
      if ('letterSpacing' in ctx) ctx.letterSpacing = cs.letterSpacing;
      ctx.fillStyle = '#fff'; // only the alpha channel is read
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      // Greedy wrap at the width the browser gave the real text, so the canvas breaks where it does.
      const words = (textEl.textContent || '').split(/\s+/).filter(Boolean);
      const lines: string[] = [];
      let line = '';
      for (const w of words) {
        const next = line ? `${line} ${w}` : w;
        if (line && ctx.measureText(next).width > r.width + 0.5) {
          lines.push(line);
          line = w;
        } else line = next;
      }
      if (line) lines.push(line);

      const top = H / 2 - ((lines.length - 1) * lh) / 2;
      lines.forEach((l, i) => ctx.fillText(l, W / 2, top + i * lh));

      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(U.res, W, H);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, paint);
      hostEl.dataset.gl = '1';
      return true;
    }

    // ── state ───────────────────────────────────────────────────────────────
    const trail = new Float32Array(TRAIL * 2);
    const vel = new Float32Array(TRAIL * 2);
    const str = new Float32Array(TRAIL);
    let head = 0;
    const target = { x: 0.5, y: 0.5 };
    const pos = { x: 0.5, y: 0.5 };
    let prev = { x: 0.5, y: 0.5 };
    let inside = 0;
    let active = 0;
    let burst = 0;
    const burstPos = { x: 0.5, y: 0.5 };
    let t0 = 0;
    let last = 0;
    let raf = 0;

    function frame(now: number) {
      if (!t0) t0 = now;
      const dt = Math.min(0.1, last ? (now - last) / 1000 : 1 / 60);
      last = now;
      const f = dt * 60;

      const k = 1 - Math.pow(1 - SMOOTH, f);
      pos.x += (target.x - pos.x) * k;
      pos.y += (target.y - pos.y) * k;
      active += (inside - active) * Math.min(1, 0.1 * f);

      for (let i = 0; i < TRAIL; i++) str[i] *= Math.pow(PERSISTENCE, f);
      head = (head + 1) % TRAIL;
      trail[head * 2] = pos.x;
      trail[head * 2 + 1] = pos.y;
      vel[head * 2] = pos.x - prev.x;
      vel[head * 2 + 1] = pos.y - prev.y;
      str[head] = active;
      prev = { x: pos.x, y: pos.y };
      burst *= Math.pow(0.94, f);

      gl.uniform1f(U.time, (now - t0) / 1000);
      gl.uniform1f(U.active, active);
      gl.uniform2fv(U.trail, trail);
      gl.uniform2fv(U.vel, vel);
      gl.uniform1fv(U.str, str);
      gl.uniform1f(U.burst, burst);
      gl.uniform2f(U.burstPos, burstPos.x, burstPos.y);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLES, 0, 3);

      let hot = burst > 0.002 || active > 0.002;
      for (let i = 0; i < TRAIL && !hot; i++) hot = str[i] > 0.002;
      if (hot) raf = requestAnimationFrame(frame);
      else {
        raf = 0;
        last = 0;
      }
    }

    function wake() {
      if (!raf) raf = requestAnimationFrame(frame);
    }

    // ── pointer ─────────────────────────────────────────────────────────────
    function at(e: PointerEvent) {
      const r = canvas.getBoundingClientRect();
      return { x: (e.clientX - r.left) / r.width, y: 1 - (e.clientY - r.top) / r.height };
    }
    function onMove(e: PointerEvent) {
      const p = at(e);
      if (!inside) {
        pos.x = p.x;
        pos.y = p.y;
        prev = { ...pos };
      }
      target.x = p.x;
      target.y = p.y;
      inside = 1;
      wake();
    }
    const onLeave = () => {
      inside = 0;
      wake();
    };
    function onDown(e: PointerEvent) {
      const p = at(e);
      burstPos.x = p.x;
      burstPos.y = p.y;
      burst = 1;
      wake();
    }
    canvas.addEventListener('pointermove', onMove);
    canvas.addEventListener('pointerleave', onLeave);
    canvas.addEventListener('pointercancel', onLeave);
    canvas.addEventListener('pointerdown', onDown);

    // The face has to be loaded before the glyphs are worth measuring.
    let alive = true;
    const start = () => {
      if (!alive || !build()) return;
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };
    if (document.fonts?.status === 'loaded') start();
    else document.fonts?.ready.then(start);

    const ro = new ResizeObserver(() => {
      if (build()) wake();
    });
    ro.observe(textEl);

    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      ro.disconnect();
      canvas.removeEventListener('pointermove', onMove);
      canvas.removeEventListener('pointerleave', onLeave);
      canvas.removeEventListener('pointercancel', onLeave);
      canvas.removeEventListener('pointerdown', onDown);
      delete hostEl.dataset.gl;
      gl.getExtension('WEBGL_lose_context')?.loseContext();
    };
  }, []);

  return (
    <h1 className="fluid stack__name" ref={host}>
      <span className="fluid__text" ref={text}>
        {children}
      </span>
      <canvas className="fluid__gl" ref={cv} aria-hidden="true" />
    </h1>
  );
}
