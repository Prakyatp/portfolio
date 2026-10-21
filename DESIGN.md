# DESIGN.md

prakyatprakash.com. What it is, how it is built, and what still needs your words.

---

## Brief

| | |
|---|---|
| **Subject** | Prakyat Prakash. MS Computer Science, RIT (Aug 2024 to Dec 2026). Graduate Research Assistant in ML at the Cui Lab, two co-authored papers, previously AI Engineer at Handshake AI. |
| **Audience** | Recruiters and hiring engineers for 2026 SWE and ML roles. |
| **Job** | Show what he builds, prove it is real, make it easy to get in touch. |
| **Order** | Name, Education, Research, Projects, Experience, Off the clock, Contact. |
| **Stack** | Next.js 14 App Router, TypeScript, plain CSS. GSAP + Lenis for scroll and reveals. |

---

## Direction: a product interface, not a poster

Three earlier attempts failed in the same way and it is worth writing down so it does not happen
again. Each one used display type at poster scale (the name filling the viewport), full-screen
sections, and large gaps between everything. The feedback each time was the same: **too big, too
much empty space.**

So the rule for this build is: **nothing is sized to impress.** The largest thing on the page is
the name at about 42px, which is a normal page heading. Sections are separated by a hairline and
roughly 48px, not by a screenful. A recruiter sees the name, the pitch, the education and the
start of the research section in the first screen, instead of just the name.

### Scale

| Token | Value | Was |
|---|---|---|
| `--t-display` (the name) | 1.85 to 2.65rem | up to 13.5rem |
| `--t-h2` (section heads) | 1.25 to 1.55rem | up to 4.6rem |
| `--t-body` | 1rem | 1rem |
| `--s-section` | 2.25 to 3.5rem | 5 to 11rem |
| content width | 68rem | 108rem |

Spacing runs on a single 4px step (`--s-1` through `--s-7`). Nothing is spaced by eye.

### Palette

Warm off-white, near-black ink, one green accent. The green is used for things you can act on and
for the availability pill, nothing else. No gradients, no glass, no coloured shadows.

| Role | Value | Notes |
|---|---|---|
| `--c-bg` | `#fbfbf9` | warm off-white |
| `--c-surface` | `#ffffff` | cards |
| `--c-fg` | `#16181c` | text |
| `--c-muted` | `#5c6168` | secondary, 5.9:1 |
| `--c-faint` | `#6b7077` | meta, 4.9:1 (was 3.2:1 and failing) |
| `--c-accent` | `#0f6b4a` | pine green |

### Type

**Schibsted Grotesk** for everything, **JetBrains Mono** for dates, counts and stack tags only.
Not Inter: it is the reflexive choice and reads as a default rather than a decision.

### Depth

Hairline borders and a 1px shadow. Cards lift 3px on hover with a slightly stronger shadow. That
is the whole system. No layered soft shadows, no glass, no accent rails on cards.

### Motion

Restrained, the way a good app moves.

| Thing | Treatment |
|---|---|
| Top of page | small staggered fade-up, in CSS, so it runs at first paint rather than waiting for JS |
| On scroll | 14px fade-up per block, 0.5s, staggered. Short distances, not stage entrances |
| Header | borderless at the top, picks up a hairline once the page moves under it |
| Project cards | lift 3px, shadow deepens, screenshot scales 1.04, destination label turns green |
| Publications | border and background turn green, lift 1px |
| Buttons and links | background or colour shift, arrows nudge 2px |
| Smooth scrolling | Lenis, on the GSAP ticker |

### Decisions

**No blackjack table.** Removed at your request, along with the component and its rules module.

**Projects link out.** Every card opens the live dashboard or the repository. There are no
case-study pages and no `/work/*` routes.

**One light theme.** A committed single look rather than a light and dark pair neither of which
gets full attention.

---

## Measured

Production build, measured with the `awwwards` skill's `audit.mjs` and `shoot.mjs`.

| | Result |
|---|---|
| audit | **0 FAIL, 0 WARN** |
| mobile LCP, throttled | **824ms** home, 520ms 404 |
| CLS | **0** |
| page weight | **375 KB** total, 196 KB JS gz, 76 KB fonts, 90 KB images |
| axe serious or critical | **0** |
| keyboard focus issues | **0** |
| tap targets under 24px | **0** |
| horizontal overflow | **none** at 390 and 1440 |
| scroll fps desktop / mobile | **60 / 60** |
| dead hovers | **0** |
| reduced motion | **0** hidden text, nothing moving |
| console errors | **0** |

---

## To replace

One thing in `src/data/site.ts`, marked `TODO(prakyat)`: the single line under **Off the clock**
and the four interest tags beside it. That is the only sentence on this site I wrote rather than
took from your own material. Everything else, every number, author list, date and project
description, is yours.
