# DESIGN.md

prakyatprakash.com. What it is, how it is built, and what still needs your words.

> The previous direction — the same site with a compact text masthead instead of the pass — is
> kept whole on the **`draft/clean-ui`** branch. This is **`redesign/lanyard`**.

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

## Direction: one object, then the facts

The landing is a single full screen of white with a conference pass hanging in it on a lanyard.
It is the whole first screen and it is the whole first impression: his face, RIT, Software
Engineer, Class of 2026. You can pick it up, swing it, throw it, and spin it over to read the
back. Then you scroll and the site turns into an ordinary, quiet, well-made CV.

That split is deliberate. Three earlier attempts failed the same way — display type at poster
scale, full-screen sections, huge gaps, the feedback each time being **too big, too much empty
space**. The fix is not to make everything small; it is to spend the big gesture in exactly one
place and then stop. The pass is the one indulgent thing on the site. Everything after it is at
normal interface scale: name-sized headings, hairline rules, 48px between sections.

### The pass

Ported from the Framer `Kern-LanyardPass` component's approach, not its code. That component is
three.js drawing a card onto a canvas; this is the same simulation driving real DOM.

| | |
|---|---|
| Rope | Verlet particle chain: a pinned clip plus 3 free joints, 18 distance-constraint passes per step, gravity 1400u/s², air damping 0.986, fixed 1/60s steps |
| Strap | one SVG path through the joints (Catmull-Rom converted to cubics), stroked three times: webbing, a woven pattern, then a cylindrical shading gradient |
| Card | real DOM at 100 × 134 units, two faces in `preserve-3d`, so **the name on it is the page's `<h1>`** — real text, selectable, indexable, read by screen readers |
| Hold | pointer capture, reach clamped to the rope's length, release keeps 55% of the throw velocity |
| Spin | sideways drag turns the card about Y; it settles facing front or back, so flipping it over is a real interaction |
| Clip | pivots on the strap's angle rather than the card's, so it stays attached while the card lags behind |

Everything is in **pass units**: the card is 100u wide, `--u` is `--pass-w / 100`, and the strap,
clip, type and slot all scale as one object. `--pass-w` is capped by `svh` as well as `vw`, so the
rig fits the screen it hangs in rather than overflowing it.

**The rest pose is pure CSS.** The pass is the LCP element, and a JS-driven entrance cannot start
until the bundle lands — the mistake that cost 3.9s in an earlier build. So the drop and its first
swings are a keyframe animation that runs at first paint, and the simulation only takes over once
that animation ends, at exactly the pose its last keyframe leaves. Under `prefers-reduced-motion`
the simulation never starts and the pass just hangs there, correct and still.

### Scale, below the fold

| Token | Value | Was |
|---|---|---|
| `--t-display` | 1.85 to 2.65rem | up to 13.5rem |
| `--t-h2` (section heads) | 1.25 to 1.55rem | up to 4.6rem |
| `--s-section` | 2.25 to 3.5rem | 5 to 11rem |
| content width | 68rem | 108rem |

Spacing runs on a single 4px step (`--s-1` through `--s-7`). Nothing is spaced by eye.

### Palette

White page, near-black ink, one green accent for things you can act on. The pass is a physical
object in the scene, so it carries its own colours — dark PVC, warm ink and RIT orange — and the
orange reappears exactly once more, on the RIT mark in the Education card, so the two agree.

| Role | Value | Notes |
|---|---|---|
| `--c-bg` | `#ffffff` | white, per the brief |
| `--c-surface` | `#ffffff` | cards |
| `--c-fg` | `#16181c` | text |
| `--c-muted` | `#5c6168` | secondary, 5.9:1 |
| `--c-faint` | `#6b7077` | meta, 4.9:1 (was 3.2:1 and failing) |
| `--c-accent` | `#0f6b4a` | pine green |
| `--p-body` | `#121317` | the card |
| `--p-ink` | `#f4f3ee` | type on the card |
| `--p-dim` | `#8f9299` | secondary on the card, 5.9:1 |
| `--p-rit` | `#f76902` | RIT orange, 5.6:1 on the card |

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
| The pass | falls, catches, swings, settles. Then it drifts very slightly, because nothing real hangs perfectly still |
| Top of page | small staggered fade-up, in CSS, so it runs at first paint rather than waiting for JS |
| On scroll | 14px fade-up per block, 0.5s, staggered. Short distances, not stage entrances |
| Header | borderless at the top, picks up a hairline once the page moves under it |
| Project cards | lift 3px, shadow deepens, screenshot scales 1.04, destination label turns green |
| Publications | border and background turn green, lift 1px |
| Buttons and links | background or colour shift, arrows nudge 2px |
| Smooth scrolling | Lenis, on the GSAP ticker |

### Decisions

**The pass is the masthead.** There is no separate hero heading. The `<h1>` is the name printed
on the card, which is why the card is DOM and not a canvas.

**The header is clear glass at the top** so the lanyard can run off the top of the screen. It
picks up a background and a hairline once the page moves under it.

**The first Tab finishes every pending reveal.** Scroll reveals use `visibility: hidden`, which
takes a block out of the tab order; without this a keyboard user would tab straight past
everything below the fold.

**No blackjack table.** Removed at your request, along with the component and its rules module.

**Projects link out.** Every card opens the live dashboard or the repository. There are no
case-study pages and no `/work/*` routes.

**One light theme.** A committed single look rather than a light and dark pair neither of which
gets full attention.

---

## Measured

Production build. Scripts in `.qa/` (gitignored).

| | Result |
|---|---|
| mobile LCP, throttled 4G + 4x CPU | **616ms** |
| CLS | **0.0001** |
| First Load JS | **95.9 kB** (the whole rig adds 3.3 kB) |
| axe serious or critical | **0** |
| keyboard focus issues | **0** |
| tap targets under 24px | **0** |
| horizontal overflow | **none** at 390 and 1440 |
| fps with the pass swinging, throttled mobile | **60** |
| dead hovers | **0** |
| reduced motion | **0** hidden text, nothing moving |
| console errors | **0** |

---

## To replace

One thing in `src/data/site.ts`, marked `TODO(prakyat)`: the single line under **Off the clock**
and the four interest tags beside it. That is the only sentence on this site I wrote rather than
took from your own material. Everything else, every number, author list, date and project
description, is yours.
