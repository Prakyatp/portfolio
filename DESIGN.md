# DESIGN.md

prakyatprakash.com. What it is, how it is built, and what still needs your words.

> Four directions are kept whole, one per branch. This is **`redesign/shelf`**.
> **`redesign/folders`** is the drawer of file folders with the fluid name.
> **`redesign/lanyard`** is the ID pass hanging on a lanyard.
> **`draft/clean-ui`** is the plain, compact text site.

---

## Direction: the shelf

The landing page is the ThreeUI **Complete Shelf** page, running its own authored Three.js
presentation. The name sits in the middle of the masthead, and the five volumes on the shelf are
the five sections of the CV.

| | Volume | The panel holds |
|---|---|---|
| I | **Education** | RIT, the dates, the degree, the six courses |
| II | **Research** | one line on ML and deep learning in genomics, then both papers as cards linking to their DOIs |
| III | **Experience** | all three roles with org, dates, place and bullets |
| IV | **Projects** | three blocks, each led by the button to the live site |
| V | **Contact** | email, LinkedIn, GitHub, résumé |

Each volume is a real hardcover in the scene: cloth with a woven normal and roughness map,
embossed foil on the front, spine and back, printed endpapers, a page block with gutter
compression and signatures, headbands, a ribbon, and eight interior pages generated from that
section's own text. Select one and the whole room — walls, shelf, every light — crossfades to its
palette. Open it and the cover swings, the pages flex as real geometry, and you can drag a page
across the gutter.

**The panel never scrolls.** Each volume carries the markup for its own right-hand side, and
`fitPanel()` steps `--panel-scale` down until the column fits. It has to ask two questions, not
one: a short section leaves the panel under its ceiling and nothing is clipped, while a long one
pins the panel at the ceiling and the clipping shows up *inside* the body instead. Measured at
1440 × 900, Projects settles at 0.825 and the other four fit at 1.0.

**Inside the Projects book, the pages print the real screenshots** of each site, and tapping a
page opens it — the cursor says so first. Each page face carries its interior-page index, which
is how a tap is told apart from a drag across the gutter.

The book gives up room to the panel: the inspect scale floor drops from 0.9 to 0.58, and the
world placement is pulled back from −2.25 to −1.52 because the wider panel already doubled the
camera's view offset, and the two together walked the book off the left edge.

---

## Provenance

The source was fetched, not reconstructed.

| | |
|---|---|
| Fetched from | `https://threeui.com/landing-pages/complete-shelf-v2.html` |
| Result | HTTP 200, 189,455 bytes, 5,933 lines |
| SHA-256 as fetched | `8f1256796bab42b0d60e187176dfcc9d9df33cec1d22ca6f3c3767dcfeca4cb9` |
| SHA-256 in the brief | `606f200fed8602c243f40a11c8c364f0e625c57f80e7c97dc76419da207f198e`, 900,296 bytes |

**The live file no longer matches the registered revision.** The registry entry describes an
older build whose media was base64-embedded, which is where the extra ~710 KB went; the live
document carries the same images as Supabase storage URLs instead. The pasted source bundle
agreed with the live file on every anchor checked — the book array, the geometry builders, the
texture generators, the interaction state machine, the disposal path — so what was copied in is
the canonical current document. Nothing here was rebuilt from a screenshot.

### What was changed

71 hunks, 1,035 of 6,558 lines, across two passes: first the volumes, then the sections.

| | |
|---|---|
| Rewritten | the `BOOKS` array, the right-hand panel and the interior pages |
| Added | the per-volume panel markup, `fitPanel()`, page-plate loading, tap-to-open on a page, the centred masthead |
| Untouched | every shader, light, material, geometry builder, pointer gesture, keyboard path, responsive rule, reduced-motion branch, visibility handler, context-loss fallback and disposal routine |

Two decisions worth recording.

**The foil on Research and Contact was lifted.** `#efc16d` on burnt orange and `#efb0aa` on
vermilion both sat around 3:1 against their own cloth, and the foil is what carries the title on
the cover and the spine. They are now `#ffe2b8` and `#ffd9d2`, around 4:1. The other three were
already clear.

**The cloth colours are the authored ones.** The cover artworks live in one embedded atlas and
are handed out by shelf position, so a volume's cloth has to agree with the artwork it is given.
An earlier pass used subject colours and the two visibly clashed.

---

## The host

Per the integration brief: the document is served from `public/`, loaded by URL into a full-size
iframe with the authored sandbox string, and never imported into the application's JavaScript
graph. First Load JS is **89.8 kB** — the document itself is not part of it.

| File | |
|---|---|
| `public/landing-pages/complete-shelf-v2.html` | the document |
| `src/components/shelf/LandingPageFrame.tsx` | the bundle's frame component, as authored |
| `src/components/shelf/CompleteShelfLandingPage.tsx` | the bundle's entry for this page |
| `src/components/shelf/pageTypography.ts` | written here — see below |
| `src/components/shelf/shelf.css` | the `.threeui-background` rule plus the sized parent |

`pageTypography.ts` and `pageRecipes.ts` are **not** in the registered bundle, so that one file is
an implementation of the documented contract rather than a copy. Its recipe holds the document's
own authored values — Iowan Old Style, Inter, weight 400, `#c87046`, 60 / 12 / −0.055 — so the
configured props reproduce the authored page exactly and only an override changes anything. It
appends a style block to the loaded document's head; the packaged file is never rewritten.

One consequence worth knowing: `primaryColor` sets `--accent`, but the authored page rewrites
`--accent` to the selected volume's foil as an inline style on `documentElement` every time the
selection changes. So the prop governs the first frame and the volume governs the rest. That is
the page's own behaviour, not a fault in the seam.

---

## Measured

Production build, driven in a real browser. Scripts in `.qa/` (gitignored).

| | Result |
|---|---|
| Five sections at 1440 × 900 | **no overflow in any of them**; scale 1.0, 1.0, 1.0, 0.825, 1.0 |
| Education at 390 × 844 | fits at 0.825, no horizontal scroll |
| Links in the panels | 2 DOIs, 3 project URLs, 4 contact links — all correct |
| Tap a page in the Projects book | cursor reads `has-page-link`, tap opened the PTM dashboard |
| Book clears the panel | yes, after the placement correction |
| No WebGL | catalog shown, five columns, all five section titles |
| Reduced motion | opening and closing both land at once; panel fits at 1.0 |
| Console errors, host and frame | **0** |

One thing worth knowing about verifying this page: **the open and close transitions are
frame-count-bound, not wall-clock-bound.** `transitionTime` advances by `delta / 0.92` with
`delta` capped at 0.05, so the move always costs at least ~18 rendered frames. On real hardware
that is under a second. In headless Chromium, where this scene renders at a few frames a second,
it can take tens of seconds — early test runs timed out against it and looked like a hang. A
side-by-side against the pristine, unedited document confirmed the same behaviour there. Tests
should wait on state, with a long ceiling, and open each section in its own page rather than
closing between them.

---

## To replace

Nothing on this page is written by me — every date, course, author list, journal, metric and
project description is yours.

Two things you may want to change:

- **The bullets under Experience are two per role**, chosen to keep all three roles on one
  screen without the type shrinking. The résumé carries the rest.
- **The cover artworks are ThreeUI's**, from the embedded atlas. They are abstract and read as
  field-guide covers, but they were drawn for someone else's books. Replacing them means making
  five new 2:3 artworks; the code takes them from one atlas image, so it is a drop-in.
