'use client';
// A hanging ID pass. The rope is a Verlet particle chain (pinned clip + 3 free joints) solved
// with repeated distance constraints, the same approach the Framer original uses — but the strap
// is an SVG tube and the card is real DOM, so the name on it is the page's actual <h1> rather
// than pixels on a canvas.
//
// Everything is computed in "pass units": the card is 100 units wide, so one unit is
// --pass-w / 100 and the whole rig is resolution independent. The rest pose is correct in pure
// CSS, which means the pass paints with the document and never waits on this bundle; the drop and
// the swing are a CSS animation, and the simulation only takes over once that animation ends.
import Image from 'next/image';
import { useEffect, useRef } from 'react';
import { education, site } from '@/data/site';

const JOINTS = 3;
const SEG = 34; // segment length, units
const REST = SEG * JOINTS; // where the card's hole hangs at rest; the hole sits 11u
// below the card's top edge, which globals.css uses as the card's transform origin.
const GRAVITY = 1400; // units/s², y points down
const AIR = 0.986; // per-step damping
const ITERS = 18; // distance-constraint passes
const DT = 1 / 60;
const TOP = -46; // where the strap leaves the top of the frame; matches the viewBox
const REACH = SEG * JOINTS; // how far the hole can be dragged from the clip
const SWING = 0.55; // how much of the throw velocity is kept on release

type P = { x: number; y: number; px: number; py: number };

export function LanyardPass() {
  const stage = useRef<HTMLDivElement>(null);
  const card = useRef<HTMLDivElement>(null);
  const flip = useRef<HTMLDivElement>(null);
  const clip = useRef<SVGSVGElement>(null);
  const path = useRef<SVGPathElement>(null);

  useEffect(() => {
    if (!stage.current || !card.current || !flip.current || !clip.current || !path.current) return;
    const stageEl = stage.current;
    const cardEl = card.current;
    const flipEl = flip.current;
    const clipEl = clip.current;
    const pathEl = path.current;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    // Clip is pinned at the origin; the joints hang below it, the last one being the card's hole.
    const pts: P[] = Array.from({ length: JOINTS + 1 }, (_, i) => ({
      x: 0,
      y: i * SEG,
      px: 0,
      py: i * SEG,
    }));
    const hole = pts[JOINTS];

    let tilt = 0; // card rotation about z, degrees
    let tiltV = 0;
    let strap = 0; // angle of the last strap segment, degrees
    let spin = 0; // card rotation about y, degrees
    let spinV = 0;
    let unit = 1; // px per unit
    let grab: { dx: number; dy: number; id: number } | null = null;
    let raf = 0;
    let last = 0;
    let acc = 0;
    let clock = 0;
    let visible = true;

    const measure = () => {
      unit = cardEl.offsetWidth / 100 || 1;
    };
    measure();

    // ── rope ────────────────────────────────────────────────────────────────
    function integrate() {
      // A touch of air movement so a pass at rest is never perfectly dead.
      const drift = Math.sin(clock * 0.62) * 7 + Math.sin(clock * 0.237) * 4.5;
      for (let i = 1; i <= JOINTS; i++) {
        const p = pts[i];
        if (grab && i === JOINTS) continue;
        const vx = (p.x - p.px) * AIR;
        const vy = (p.y - p.py) * AIR;
        p.px = p.x;
        p.py = p.y;
        p.x += vx + drift * DT * DT;
        p.y += vy + GRAVITY * DT * DT;
      }
    }

    function solve() {
      for (let k = 0; k < ITERS; k++) {
        for (let i = 0; i < JOINTS; i++) {
          const a = pts[i];
          const b = pts[i + 1];
          let dx = b.x - a.x;
          let dy = b.y - a.y;
          let d = Math.hypot(dx, dy);
          if (d < 1e-5) {
            dx = 0;
            dy = 1;
            d = 1;
          }
          const diff = (d - SEG) / d;
          // The clip never moves; a dragged hole is held by the pointer, not the rope.
          const aFixed = i === 0;
          const bFixed = grab !== null && i + 1 === JOINTS;
          const wa = aFixed ? 0 : bFixed ? 1 : 0.5;
          const wb = bFixed ? 0 : aFixed ? 1 : 0.5;
          a.x += dx * diff * wa;
          a.y += dy * diff * wa;
          b.x -= dx * diff * wb;
          b.y -= dy * diff * wb;
        }
      }
    }

    function step() {
      integrate();
      solve();
      clock += DT;

      // The card hangs from the hole and swings to line up with the last strap segment, with
      // enough inertia that it keeps going a little past it.
      const seg = pts[JOINTS - 1];
      strap = (Math.atan2(hole.x - seg.x, hole.y - seg.y) * 180) / Math.PI;
      tiltV += (strap - tilt) * 62 * DT - tiltV * 11 * DT;
      tilt += tiltV * DT;

      // Spin settles facing the viewer, or showing its back if it was turned far enough.
      const face = Math.round(spin / 180) * 180;
      spinV += (face - spin) * 9 * DT - spinV * 3.2 * DT;
      spin += spinV * DT;
    }

    // ── strap ───────────────────────────────────────────────────────────────
    // Catmull-Rom through the clip and the joints, converted to cubics. The ends are clamped with
    // virtual points so the strap leaves the top of the frame straight and enters the clip
    // along the last segment.
    function draw() {
      const n = pts.length;
      const first = { x: pts[0].x, y: pts[0].y - SEG };
      const lx = pts[n - 1].x - pts[n - 2].x;
      const ly = pts[n - 1].y - pts[n - 2].y;
      const after = { x: pts[n - 1].x + lx, y: pts[n - 1].y + ly };
      let d = `M${pts[0].x.toFixed(2)},${TOP}L${pts[0].x.toFixed(2)},${pts[0].y.toFixed(2)}`;
      for (let i = 0; i < n - 1; i++) {
        const p0 = i === 0 ? first : pts[i - 1];
        const p1 = pts[i];
        const p2 = pts[i + 1];
        const p3 = i + 2 < n ? pts[i + 2] : after;
        d +=
          `C${(p1.x + (p2.x - p0.x) / 6).toFixed(2)},${(p1.y + (p2.y - p0.y) / 6).toFixed(2)}` +
          ` ${(p2.x - (p3.x - p1.x) / 6).toFixed(2)},${(p2.y - (p3.y - p1.y) / 6).toFixed(2)}` +
          ` ${p2.x.toFixed(2)},${p2.y.toFixed(2)}`;
      }
      pathEl.setAttribute('d', d);
      cardEl.style.transform = `translate3d(${(hole.x * unit).toFixed(2)}px,${(hole.y * unit).toFixed(2)}px,0) rotate(${tilt.toFixed(3)}deg)`;
      flipEl.style.transform = `rotateY(${spin.toFixed(2)}deg)`;
      // The clip hangs off the strap, not the card, so it is held back out of the card's lag.
      clipEl.style.transform = `translateZ(${(unit * 3).toFixed(2)}px) rotate(${(strap - tilt).toFixed(2)}deg)`;
    }

    // ── loop ────────────────────────────────────────────────────────────────
    function frame(now: number) {
      raf = requestAnimationFrame(frame);
      if (!last) last = now;
      acc += Math.min((now - last) / 1000, 0.1);
      last = now;
      let steps = 0;
      while (acc >= DT && steps < 3) {
        step();
        acc -= DT;
        steps++;
      }
      if (steps) draw();
    }

    function start() {
      if (raf || !visible) return;
      last = 0;
      acc = 0;
      raf = requestAnimationFrame(frame);
    }
    function stop() {
      cancelAnimationFrame(raf);
      raf = 0;
    }

    // Hand over from the CSS drop only once it has finished, so the pass never jumps.
    function live() {
      stageEl.dataset.live = '1';
      measure();
      start();
    }
    const anim = cardEl.getAnimations().find((a) => a.playState === 'running');
    if (anim) anim.finished.then(live, () => live());
    else live();

    // ── drag ────────────────────────────────────────────────────────────────
    function local(e: PointerEvent) {
      const r = stageEl.getBoundingClientRect();
      return { x: (e.clientX - r.left - r.width / 2) / unit, y: (e.clientY - r.top) / unit };
    }

    function down(e: PointerEvent) {
      if (e.button !== 0 && e.pointerType === 'mouse') return;
      // Without this the browser starts its own image drag and cancels the pointer.
      e.preventDefault();
      const p = local(e);
      grab = { dx: hole.x - p.x, dy: hole.y - p.y, id: e.pointerId };
      cardEl.setPointerCapture(e.pointerId);
      stageEl.dataset.held = '1';
      start();
    }

    function move(e: PointerEvent) {
      if (!grab || e.pointerId !== grab.id) return;
      const p = local(e);
      let x = p.x + grab.dx;
      let y = p.y + grab.dy;
      const d = Math.hypot(x, y);
      if (d > REACH) {
        x = (x / d) * REACH;
        y = (y / d) * REACH;
      }
      // Dragging sideways across the face turns it, so the pass can be flipped over.
      spinV += (x - hole.x) * 14;
      hole.px = hole.x;
      hole.py = hole.y;
      hole.x = x;
      hole.y = y;
    }

    function up(e: PointerEvent) {
      if (!grab || e.pointerId !== grab.id) return;
      grab = null;
      stageEl.removeAttribute('data-held');
      // Keep part of the throw: Verlet reads velocity straight off the previous position.
      hole.px = hole.x - (hole.x - hole.px) * SWING;
      hole.py = hole.y - (hole.y - hole.py) * SWING;
    }

    cardEl.addEventListener('pointerdown', down);
    addEventListener('pointermove', move);
    addEventListener('pointerup', up);
    addEventListener('pointercancel', up);

    // Don't simulate a pass nobody is looking at.
    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible) start();
        else stop();
      },
      { rootMargin: '120px' },
    );
    io.observe(stageEl);
    const ro = new ResizeObserver(() => {
      measure();
      draw();
    });
    ro.observe(cardEl);

    return () => {
      stop();
      io.disconnect();
      ro.disconnect();
      cardEl.removeEventListener('pointerdown', down);
      removeEventListener('pointermove', move);
      removeEventListener('pointerup', up);
      removeEventListener('pointercancel', up);
    };
  }, []);

  return (
    <div className="stage" ref={stage}>
      <svg
        className="stage__strap"
        viewBox={`-150 ${TOP} 300 200`}
        preserveAspectRatio="xMidYMin meet"
        aria-hidden="true"
        focusable="false"
      >
        <defs>
          {/* One geometry, drawn three times: the webbing, its weave, then the round of it. */}
          <path
            ref={path}
            id="cord"
            fill="none"
            strokeLinecap="butt"
            d={`M0,${TOP}L0,0C0,${SEG / 3} 0,${(SEG * 2) / 3} 0,${SEG}C0,${SEG * 1.33} 0,${SEG * 1.67} 0,${SEG * 2}C0,${SEG * 2.33} 0,${SEG * 2.67} 0,${REST}`}
          />
          <pattern id="weave" width="3" height="3" patternUnits="userSpaceOnUse" patternTransform="rotate(38)">
            <rect width="3" height="3" fill="none" />
            <path d="M0,0.5H3" stroke="#ffffff" strokeWidth="0.7" strokeOpacity="0.1" />
          </pattern>
          <linearGradient id="round" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0" stopColor="#000" stopOpacity="0.5" />
            <stop offset="0.3" stopColor="#fff" stopOpacity="0.13" />
            <stop offset="0.55" stopColor="#fff" stopOpacity="0.03" />
            <stop offset="1" stopColor="#000" stopOpacity="0.45" />
          </linearGradient>
        </defs>
        <use href="#cord" stroke="#15161a" strokeWidth="9.2" />
        <use href="#cord" stroke="url(#weave)" strokeWidth="9.2" />
        <use href="#cord" stroke="url(#round)" strokeWidth="9.2" />
      </svg>

      {/* Hides the length of strap that has not paid out yet. See globals.css. */}
      <span className="stage__payout" aria-hidden="true" />

      <div className="pass" ref={card}>
        <svg className="pass__clip" ref={clip} viewBox="0 0 34 30" aria-hidden="true" focusable="false">
          {/* Webbing crimp, then the swivel ring that sits through the slot. */}
          <rect x="11" y="0" width="12" height="9" rx="1.6" fill="#c8ccd2" />
          <rect x="11" y="0" width="12" height="9" rx="1.6" fill="url(#metal)" />
          <path d="M14.5 8.5h5l1.2 5h-7.4z" fill="#b4b9c1" />
          <circle cx="17" cy="19.5" r="6.1" fill="none" stroke="#aeb3bb" strokeWidth="2.1" />
          <circle cx="17" cy="19.5" r="6.1" fill="none" stroke="#ffffff" strokeOpacity="0.55" strokeWidth="0.7" />
          <defs>
            <linearGradient id="metal" x1="0" x2="1" y1="0" y2="0">
              <stop offset="0" stopColor="#6f757e" />
              <stop offset="0.35" stopColor="#ffffff" stopOpacity="0.8" />
              <stop offset="0.7" stopColor="#8c929b" />
              <stop offset="1" stopColor="#5d636b" />
            </linearGradient>
          </defs>
        </svg>

        <div className="pass__flip" ref={flip}>
          <div className="pass__side pass__front">
            <span className="pass__slot" aria-hidden="true" />
            <div className="pass__head">
              <span className="pass__rit">RIT</span>
              <span className="pass__school">{education.school}</span>
            </div>
            <div className="pass__photo">
              <Image
                src="/assets/prakyat.jpeg"
                alt={`${site.name}, portrait`}
                width={320}
                height={320}
                draggable={false}
                priority
              />
            </div>
            <h1 className="pass__name">{site.name}</h1>
            <p className="pass__role">Software Engineer</p>
            <div className="pass__foot">
              <span className="pass__year">Class of 2026</span>
              <span className="pass__deg">MS Computer Science</span>
            </div>
            <span className="pass__gloss" aria-hidden="true" />
          </div>

          <div className="pass__side pass__back" aria-hidden="true">
            <span className="pass__slot" />
            <p className="pass__backline">Graduate Research Assistant</p>
            <p className="pass__backline">Cui Lab &middot; Computational Genomics</p>
            <span className="pass__code" />
            <span className="pass__ref">github.com/Prakyatp</span>
            <span className="pass__gloss" />
          </div>
        </div>
      </div>
    </div>
  );
}
