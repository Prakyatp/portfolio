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
| III | **Experience** | both roles with org, dates, place and three bullets each |
| IV | **Projects** | three blocks, each led by the button to the live site |
| V | **Contact** | email, LinkedIn, GitHub, résumé |

Each volume is a real hardcover in the scene: cloth with a woven normal and roughness map,
embossed foil on the front, spine and back, printed endpapers, a page block with gutter
compression and signatures, headbands, a ribbon, and eight interior pages generated from that
section's own text. Select one and the whole room — walls, shelf, every light — crossfades to its
palette. Open it and the cover swings, the pages flex as real geometry, and you can drag a page
across the gutter.

**The name is the masthead, and the masthead is also the way out.** The name sits centred and
large; the top right holds the two things a reader might want instead of a 3D shelf — the
résumé, and `/read`. Opening a volume fades the name but *not* those two links: they are the
escape hatch, so they are exactly what a reader wants when the shelf is not working for them.
The static catalog repeats them for the same reason.

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

## Direction: the plain page

`/read` is the same material as the shelf, in the order a reader expects it, on one scroll, with
nothing to operate. It exists because the shelf asks for patience that a hiring manager with
forty seconds does not have, and because a 3D scene is not a document: it cannot be searched with
ctrl-F, quoted, or printed.

Three decisions make it that rather than a second landing page.

**Everything is in the DOM at first paint.** No `data-reveal`, no split text, no intersection
observers. The engine's reveal attributes are opt-in, so leaving them off is all it takes. The
consequence is that the page reads with JavaScript off and that ctrl-F finds every word, which is
the point of having it.

**It reads from `src/data/site.ts`, which the shelf cannot.** The authored HTML document is a
copied artefact that must not import from the application's module graph, so its panel text is
written into the document itself. That is the one duplication in the build, and it is deliberate.
**When you change a role, a course or a paper, change both** — `src/data/site.ts` and the
`BOOKS` array in `public/landing-pages/complete-shelf-v2.html`.

**It prints.** `@media print` drops the actions, the nav and the footer, keeps entries off page
breaks, and appends the href after every external link, so a printed copy still carries its URLs.

| | |
|---|---|
| `src/app/read/page.tsx` | the document, a server component |
| `src/app/read/read.css` | its own stylesheet, built from the tokens in `globals.css` |
| `public/resume.pdf` | the résumé, served under a readable download name |

The résumé PDF carries a phone number; the page does not. A résumé is handed to someone, and a
public page is scraped by anyone, so the number stays in the file you send.

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

72 hunks of 6,630 lines — 825 added, 210 replaced — across three passes: the volumes, then the
sections, then the masthead.

| | |
|---|---|
| Rewritten | the `BOOKS` array, the right-hand panel and the interior pages |
| Added | the per-volume panel markup, `fitPanel()`, page-plate loading, tap-to-open on a page, the centred masthead, the two masthead links |
| Untouched | every shader, light, material, geometry builder, pointer gesture, keyboard path, responsive rule, reduced-motion branch, visibility handler, context-loss fallback and disposal routine |

Three decisions worth recording.

**The foil on Research and Contact was lifted.** `#efc16d` on burnt orange and `#efb0aa` on
vermilion both sat around 3:1 against their own cloth, and the foil is what carries the title on
the cover and the spine. They are now `#ffe2b8` and `#ffd9d2`, around 4:1. The other three were
already clear.

**A book must have exactly three chapters.** `chapters` reads as a list, but the interior-page
generator indexes `chapters[0]`, `[1]` and `[2]` unconditionally, in two places. Cutting
Experience from three roles to two and its chapters from three to two threw
`Cannot read properties of undefined (reading 'split')` inside `drawWrappedCanvasText` — and
`initialize().catch()` swallows it and shows the static catalog, so the symptom is a shelf that
silently never appears rather than an error. If a volume loses a subject, give the third chapter
another name; do not shorten the array.

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
| Experience, now two roles | 6 bullets, scale 1.0, no overflow |
| The masthead at 9 widths, 390 to 1920 | the name never reaches the links, nothing leaves the viewport |
| The two masthead links | clickable through the header's `pointer-events: none`, and they hit-test to themselves |
| `/read` from inside the frame | opens in a new tab — the authored sandbox allows popups, not top navigation |
| The résumé from inside the frame | downloads as `Prakyat-Prakash-Resume.pdf`, 106,619 bytes |
| Both links while a volume is open | still visible and still hit-testing, while the name fades |
| Keyboard | the two links are **first** in the frame's tab order, and `:focus-visible` draws the authored 1px ring |
| `/read` at 1440 and 390 | 7 sections, 2 roles, 6 courses, 2 papers, 3 projects, 5 skill groups, no horizontal scroll |
| `/read` with reveals | 0 sections hidden by motion — nothing waits for JavaScript |
| `/read` with JavaScript off | 7 sections, both roles, 4,888 characters of text |
| `/read` against axe-core, WCAG 2.1 AA | **0 violations**; the heading outline runs h1 → h2 → h3 with no skips |
| Education at 390 × 844 | fits at 0.825, no horizontal scroll |
| Links in the panels | 2 DOIs, 3 project URLs, 4 contact links — all correct |
| Tap a page in the Projects book | cursor reads `has-page-link`, tap opened the PTM dashboard |
| Book clears the panel | yes, after the placement correction |
| No WebGL | catalog shown, five columns, all five section titles, both links present |
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

A second one, found the same way: **the page renders on demand, so an idle headless browser
never ticks a CSS transition.** Hovering a link and reading its computed style gives the value at
progress 0 — Chromium even serializes it as `oklab(...)` to say so — which reads as a rule that
does not apply. Add `transition: none` before measuring, or measure a screenshot.

---

## To replace

Nothing on this page is written by me — every date, course, author list, journal, metric and
project description is yours.

Two things you may want to change:

- **Experience follows the October 2026 résumé: two roles, three bullets each.** That résumé
  drops Handshake AI and re-dates Acinonyx to Jan–Apr 2025 as a remote contract, carrying the
  bullets the site previously credited to Handshake. If that is a renaming rather than a
  correction, say so and it goes back.
- **The cover artworks are ThreeUI's**, from the embedded atlas. They are abstract and read as
  field-guide covers, but they were drawn for someone else's books. Replacing them means making
  five new 2:3 artworks; the code takes them from one atlas image, so it is a drop-in.
