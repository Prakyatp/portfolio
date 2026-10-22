import { Bricolage_Grotesque, DM_Sans, DM_Mono, Newsreader, Inter } from 'next/font/google';

// Display: the masthead and the panel titles. Bricolage Grotesque has wide, solid counters, which
// is what the fluid distortion on the name needs — thin letterforms smear into nothing.
export const display = Bricolage_Grotesque({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
});

// Body. DM Sans and DM Mono are drawn as a pair, so the running text and the mono labels agree
// about width and tone instead of being two unrelated choices.
export const sans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

export const mono = DM_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-mono',
  display: 'swap',
});

// ── /read only ──────────────────────────────────────────────────────────────
// The plain page is a document, so it is set like one: a text serif for the name and the
// things you scan for (titles, the lead lines), and a neutral grotesque for everything you
// actually read. Newsreader is a *text* serif rather than a display one, so it still holds
// at 17px where Bricolage's display cut would get thin. Inter is the shelf's own body face,
// which quietly ties the two pages together.
export const readSerif = Newsreader({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-read-serif',
  display: 'swap',
});

export const readSans = Inter({
  subsets: ['latin'],
  variable: '--font-read-sans',
  display: 'swap',
});
