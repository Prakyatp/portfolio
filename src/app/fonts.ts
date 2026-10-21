import { Schibsted_Grotesk, JetBrains_Mono } from 'next/font/google';

// Schibsted Grotesk: a newspaper grotesk, warm and solid. Deliberately not Inter, which is the
// reflexive choice and reads as a default rather than a decision.
export const sans = Schibsted_Grotesk({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

// Mono is for dates, counts and stack tags only. Never for running text.
export const mono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-mono',
  display: 'swap',
});
