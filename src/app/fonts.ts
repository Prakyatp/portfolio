import { Bricolage_Grotesque, DM_Sans, DM_Mono } from 'next/font/google';

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
