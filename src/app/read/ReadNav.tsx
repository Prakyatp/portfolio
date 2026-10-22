'use client';
import { useEffect, useState } from 'react';

export type Section = { id: string; label: string };

/** The sticky bar's section links, with the one you are reading marked.
 *
 *  The marking is the only part that needs JavaScript: the links are plain anchors and the
 *  bar is sticky in CSS, so with JS off this is still a working table of contents. Lenis is
 *  configured with `anchors: true`, so a click is smooth-scrolled by the same engine that
 *  drives the rest of the site rather than fighting it. */
export function ReadNav({ sections }: { sections: Section[] }) {
  const [active, setActive] = useState<string | null>(null);

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

  return (
    <>
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
    </>
  );
}
