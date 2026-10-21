export const prefersReducedMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
export const isTouch = () => matchMedia('(hover: none), (pointer: coarse)').matches;
export const isMobile = () => matchMedia('(max-width: 767px)').matches;

// Shared easing vocabulary. Use these names everywhere; never invent per-component curves.
// `lock` is this site's motion verb (advance and lock): slow to leave, hard to settle.
// It is registered as a CustomEase in src/motion/setup.ts before the first page initializes.
export const ease = {
  out: 'expo.out', // default entrance
  inOut: 'expo.inOut', // curtains, page transitions
  soft: 'power3.out', // small UI
  lock: 'lock', // the signature: a position arriving at the read head
} as const;
