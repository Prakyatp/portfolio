'use client';
import { useCallback, useEffect, useRef, useState } from 'react';

export type Section = { id: string; label: string };

/** The sticky bar's section links.
 *
 *  Everything structural is CSS: the bar is sticky, the links are plain anchors, and on a
 *  narrow screen they sit on their own row and scroll sideways. So with JavaScript off this
 *  is still a working table of contents. What JS adds is the three things that make it
 *  usable on a phone, where six labels cannot fit at once:
 *
 *    1. the section you are reading is marked,
 *    2. that mark is kept scrolled into view, so you can always see where you are,
 *    3. the row says which way there is more, via `data-edge` and a mask in CSS.
 *
 *  Lenis runs with `anchors: true`, so a click is smooth-scrolled by the same engine that
 *  drives the rest of the site rather than fighting it. */
export function ReadNav({ sections }: { sections: Section[] }) {
  const [active, setActive] = useState<string | null>(null);
  const navRef = useRef<HTMLElement>(null);

  // Which edges have more links behind them. Read on scroll and on resize, since the row
  // stops overflowing entirely once the window is wide enough.
  const syncEdges = useCallback(() => {
    const nav = navRef.current;
    if (!nav) return;
    const max = nav.scrollWidth - nav.clientWidth;
    nav.dataset.edge =
      max <= 1 ? 'none' : nav.scrollLeft <= 1 ? 'end' : nav.scrollLeft >= max - 1 ? 'start' : 'both';
  }, []);

  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;
    syncEdges();
    nav.addEventListener('scroll', syncEdges, { passive: true });
    window.addEventListener('resize', syncEdges);
    return () => {
      nav.removeEventListener('scroll', syncEdges);
      window.removeEventListener('resize', syncEdges);
    };
  }, [syncEdges]);

  useEffect(() => {
    const elements = sections
      .map((s) => document.getElementById(s.id))
      .filter((el): el is HTMLElement => el !== null);
    if (!elements.length || typeof IntersectionObserver === 'undefined') return;

    // A band just under the bar: whatever crosses it is what you are reading. When a gap
    // between sections leaves the band empty the previous answer stands, which is right —
    // you are still in the section you last entered.
    const observer = new IntersectionObserver(
      (entries) => {
        const topmost = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (topmost) setActive(topmost.target.id);
      },
      { rootMargin: '-72px 0px -70% 0px', threshold: 0 },
    );
    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [sections]);

  // Scroll the row, never the page: `scrollIntoView` would be free to move the document as
  // well, and the bar is already where it needs to be vertically.
  useEffect(() => {
    const nav = navRef.current;
    if (!nav || !active) return;
    const link = nav.querySelector<HTMLElement>(`a[href="#${active}"]`);
    if (!link) return;
    const smooth = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const behavior = smooth ? 'smooth' : 'auto';
    const pad = 16;
    if (link.offsetLeft < nav.scrollLeft + pad) {
      nav.scrollTo({ left: Math.max(0, link.offsetLeft - pad), behavior });
    } else if (link.offsetLeft + link.offsetWidth > nav.scrollLeft + nav.clientWidth - pad) {
      nav.scrollTo({ left: link.offsetLeft + link.offsetWidth - nav.clientWidth + pad, behavior });
    }
    syncEdges();
  }, [active, syncEdges]);

  return (
    <nav className="readbar__nav" aria-label="Sections" ref={navRef} data-edge="none">
      {sections.map((s) => (
        <a
          key={s.id}
          href={`#${s.id}`}
          aria-current={active === s.id ? 'true' : undefined}
          onClick={() => setActive(s.id)}
        >
          {s.label}
        </a>
      ))}
    </nav>
  );
}
