// Global motion for this site. Runs once on the client, after scroll init and before the first
// page initializes. The only safe place for code that touches `window` at setup time.
import { gsap } from 'gsap';
import { CustomEase } from 'gsap/CustomEase';
import { ease, onPage, onScroll, scrollToTarget, setTransition } from '@/engine';
import { startIdle } from './idle';

gsap.registerPlugin(CustomEase);

export function setupMotion() {
  // The motion verb: advance and lock. Slow to leave, hard to settle, no overshoot.
  CustomEase.create('lock', 'M0,0 C0.6,0 0.1,1 1,1');

  // Page transition: the read head sweeps across, in one direction, both ways. The signal edge
  // leads the panel in and trails it out, so the sweep reads as one continuous pass.
  setTransition({
    leave: (c) =>
      gsap
        .timeline()
        .set(c, { autoAlpha: 1 })
        .fromTo(
          c.querySelector('.curtain__panel'),
          { xPercent: -100 },
          { xPercent: 0, duration: 0.85, ease: ease.inOut },
        ),
    enter: (c) =>
      gsap
        .timeline()
        .to(c.querySelector('.curtain__panel'), { xPercent: 100, duration: 0.85, ease: ease.inOut })
        .set(c, { autoAlpha: 0 }),
  });

  startIdle();

  // The sticky header is borderless at the top and picks up a hairline once the page moves
  // under it, so it reads as part of the page rather than a bar sitting on top of it.
  onScroll(({ y }) => {
    document.documentElement.classList.toggle('scrolled', y > 8);
  });

  // A hash arriving with a navigation (for example /#work from a case page) still lands.
  onPage(() => {
    const hash = location.hash;
    if (hash.length < 2) return;
    const el = document.querySelector<HTMLElement>(hash);
    if (el) requestAnimationFrame(() => scrollToTarget(el));
  });
}
