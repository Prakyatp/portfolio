'use client';
// A drawer of file folders. The masthead sits above a stack of five tabbed folders; opening one
// lifts it and everything above it to the top of the screen as thin tabs, pushes the folders
// still to come down to the bottom, and gives the open folder everything in between. The last
// folder has nothing below it, so Contact ends up covering the screen.
//
// Scroll and click drive the same number. The page is six screens tall; how far into it you are
// is the level, interpolated so dragging the scrollbar moves the folders directly, and snapped
// when you let go so it always settles on a level.
import Image from 'next/image';
import { useEffect, useRef } from 'react';
import { onScroll, scrollToTarget } from '@/engine/scroll';
import { CopyEmail } from './CopyEmail';
import { FluidName } from './FluidName';
import { education, projects, publications, research, roles, site } from '@/data/site';

const HERO = 0.47; // share of the screen the masthead gets before anything is open
const N = 5;

const clamp = (v: number, a: number, b: number) => (v < a ? a : v > b ? b : v);

/** Where folder `i` sits, in px from the top of the screen, at a whole `level`.
 *  level 0 is the masthead; level k+1 means folder k is open. */
function posAt(i: number, level: number, H: number, T: number) {
  if (level <= 0) return H * HERO + i * T;
  const open = level - 1;
  return i <= open ? i * T : H - (N - i) * T;
}

export function FolderStack() {
  const stack = useRef<HTMLDivElement>(null);
  const pin = useRef<HTMLDivElement>(null);
  const head = useRef<HTMLDivElement>(null);
  const items = useRef<HTMLElement[]>([]);
  const level = useRef(0);

  useEffect(() => {
    const els = items.current.filter(Boolean);
    if (!stack.current || !pin.current || !head.current || els.length !== N) return;
    const stackEl = stack.current;
    const pinEl = pin.current;
    const headEl = head.current;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    stackEl.dataset.live = '1';
    let H = 0;
    let T = 0;
    let snapTimer = 0;

    const measure = () => {
      H = pinEl.clientHeight;
      T = els[0].querySelector<HTMLElement>('.folder__tab')?.offsetHeight || 56;
    };

    const progress = () => clamp(-stackEl.getBoundingClientRect().top / (H || 1), 0, N);

    function place(p: number) {
      const a = clamp(Math.floor(p), 0, N - 1);
      const f = clamp(p - a, 0, 1);
      for (let i = 0; i < N; i++) {
        const from = posAt(i, a, H, T);
        const y = from + (posAt(i, a + 1, H, T) - from) * f;
        els[i].style.transform = `translate3d(0,${y.toFixed(1)}px,0)`;
      }
      // The masthead clears out as the first folder lifts over it.
      const o = 1 - clamp(p / 0.62, 0, 1);
      headEl.style.opacity = o.toFixed(3);
      headEl.style.transform = `translate3d(0,${(-28 * (1 - o)).toFixed(1)}px,0)`;
      headEl.style.visibility = o < 0.02 ? 'hidden' : 'visible';

      const open = Math.round(p);
      if (open !== level.current) {
        level.current = open;
        settle(open);
      }
    }

    /** Runs on a change of level, not every frame: a panel is only ever as tall as the gap
     *  between its own tab and the next folder's, and only the open one takes focus. */
    function settle(open: number) {
      const ys = Array.from({ length: N }, (_, i) => posAt(i, open, H, T));
      els.forEach((el, i) => {
        const isOpen = i === open - 1;
        const room = (i < N - 1 ? ys[i + 1] : H) - (ys[i] + T);
        el.style.setProperty('--avail', `${Math.max(0, room).toFixed(0)}px`);
        // An empty dataset value still matches [data-open], so remove it outright.
        if (isOpen) el.dataset.open = '1';
        else delete el.dataset.open;
        el.querySelector<HTMLElement>('.folder__tab')?.setAttribute('aria-expanded', String(isOpen));
        const panel = el.querySelector<HTMLElement>('.folder__panel');
        if (panel) panel.inert = !isOpen;
      });
    }

    function snap() {
      const p = progress();
      const target = Math.round(p);
      if (Math.abs(p - target) < 0.04) return;
      scrollToTarget(stackEl.offsetTop + target * H, 0.5);
    }

    measure();
    settle(Math.round(progress()));
    place(progress());

    const off = onScroll(() => {
      place(progress());
      clearTimeout(snapTimer);
      snapTimer = window.setTimeout(snap, 140);
    });

    // A tab opens its folder; the open folder's own tab closes it again.
    const onTab = (e: Event) => {
      const i = Number((e.currentTarget as HTMLElement).dataset.i);
      const want = level.current === i + 1 ? i : i + 1;
      scrollToTarget(stackEl.offsetTop + want * H, 0.75);
    };
    const tabs = els.map((el) => el.querySelector<HTMLElement>('.folder__tab'));
    tabs.forEach((t) => t?.addEventListener('click', onTab));

    const ro = new ResizeObserver(() => {
      measure();
      settle(level.current);
      place(progress());
    });
    ro.observe(pinEl);

    return () => {
      off();
      clearTimeout(snapTimer);
      ro.disconnect();
      tabs.forEach((t) => t?.removeEventListener('click', onTab));
    };
  }, []);

  const hold = (i: number) => (el: HTMLElement | null) => {
    if (el) items.current[i] = el;
  };

  return (
    <div className="stack" ref={stack}>
      <div className="stack__pin" ref={pin}>
        <div className="stack__head" ref={head}>
          <FluidName>{site.name}</FluidName>
          <p className="stack__role">Software engineer &middot; Data pipelines &middot; ML systems</p>
          <p className="stack__cue">Open a folder, or keep scrolling</p>
        </div>

        {/* 1 ── Education ─────────────────────────────────────────────────── */}
        <article className="folder" data-tone="olive" style={{ '--i': 0, zIndex: 1 } as React.CSSProperties} ref={hold(0)}>
          <button className="folder__tab" type="button" data-i="0" aria-expanded="false" aria-controls="p-education">
            Education
          </button>
          <div className="folder__panel" id="p-education">
            <div className="folder__inner">
              <p className="panel__kicker">{education.period}</p>
              <h2 className="panel__title">{education.school}</h2>
              <p className="panel__lead">
                {education.degree}. {education.place}.
              </p>
              <ul className="panel__chips">
                {education.courses.map((c) => (
                  <li key={c}>{c}</li>
                ))}
              </ul>
            </div>
          </div>
        </article>

        {/* 2 ── Research ──────────────────────────────────────────────────── */}
        <article className="folder" data-tone="blush" style={{ '--i': 1, zIndex: 2 } as React.CSSProperties} ref={hold(1)}>
          <button className="folder__tab" type="button" data-i="1" aria-expanded="false" aria-controls="p-research">
            Research
          </button>
          <div className="folder__panel" id="p-research">
            <div className="folder__inner">
              <p className="panel__kicker">{publications.length} papers, {publications[0].year}</p>
              <h2 className="panel__title">{research.lead}</h2>
              <p className="panel__lead">{research.body[0]}</p>
              <div className="panel__pubs">
                {publications.map((pub) => (
                  <a className="pcard" key={pub.doi} href={pub.doi} target="_blank" rel="noopener">
                    <span className="pcard__title">
                      {pub.title} <span className="arrow">&#8599;</span>
                    </span>
                    <span className="pcard__meta">
                      {pub.authorsBefore}
                      <b>Prakash, P.</b>
                      {pub.authorsAfter} &mdash; <i>{pub.journal}</i>, {pub.year}
                    </span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </article>

        {/* 3 ── Experience ────────────────────────────────────────────────── */}
        <article className="folder" data-tone="mauve" style={{ '--i': 2, zIndex: 3 } as React.CSSProperties} ref={hold(2)}>
          <button className="folder__tab" type="button" data-i="2" aria-expanded="false" aria-controls="p-experience">
            Experience
          </button>
          <div className="folder__panel" id="p-experience">
            <div className="folder__inner">
              <p className="panel__kicker">{roles.length} roles since 2024</p>
              <div className="panel__roles">
                {roles.map((r) => (
                  <section className="rcard" key={r.org}>
                    <h3 className="rcard__title">{r.title}</h3>
                    <p className="rcard__org">{r.org}</p>
                    <p className="rcard__when">
                      {r.period} &middot; {r.place}
                    </p>
                    <ul className="rcard__points">
                      {r.points.map((pt, j) => (
                        <li key={j}>{pt}</li>
                      ))}
                    </ul>
                  </section>
                ))}
              </div>
            </div>
          </div>
        </article>

        {/* 4 ── Projects ──────────────────────────────────────────────────── */}
        <article className="folder" data-tone="red" style={{ '--i': 3, zIndex: 4 } as React.CSSProperties} ref={hold(3)}>
          <button className="folder__tab" type="button" data-i="3" aria-expanded="false" aria-controls="p-projects">
            Projects
          </button>
          <div className="folder__panel" id="p-projects">
            <div className="folder__inner">
              <p className="panel__kicker">Every card opens the live thing</p>
              <div className="panel__projects">
                {projects.map((p) => (
                  <a className="jcard" key={p.index} href={p.href} target="_blank" rel="noopener">
                    <span className="jcard__shot">
                      <Image
                        src={p.cover.src}
                        alt={p.cover.alt}
                        width={1100}
                        height={688}
                        sizes="(max-width: 860px) 90vw, 20rem"
                      />
                    </span>
                    <h3 className="jcard__title">{p.title}</h3>
                    <span className="jcard__blurb">{p.blurb}</span>
                    <span className="jcard__go">
                      {p.destination} <span className="arrow">&#8599;</span>
                    </span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </article>

        {/* 5 ── Contact ───────────────────────────────────────────────────── */}
        <article className="folder" data-tone="ink" style={{ '--i': 4, zIndex: 5 } as React.CSSProperties} ref={hold(4)}>
          <button className="folder__tab" type="button" data-i="4" aria-expanded="false" aria-controls="p-contact">
            Contact
          </button>
          <div className="folder__panel" id="p-contact">
            <div className="folder__inner folder__inner--end">
              <p className="panel__kicker">{site.availability}</p>
              <CopyEmail />
              <div className="panel__socials">
                {site.socials.map((s) => (
                  <a
                    className="scard"
                    key={s.label}
                    href={s.href}
                    target={s.href.startsWith('http') ? '_blank' : undefined}
                    rel={s.href.startsWith('http') ? 'noopener' : undefined}
                  >
                    {s.label} <span className="arrow">&#8599;</span>
                  </a>
                ))}
              </div>
              <p className="panel__colophon">
                Based in {site.location}. Built with Next.js. &copy; 2026 {site.name}.
              </p>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}
