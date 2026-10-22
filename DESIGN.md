# DESIGN.md

prakyatprakash.com. What it is, how it is built, and what still needs your words.

> Four directions are kept whole, one per branch. This is **`redesign/shelf`**.
> **`redesign/folders`** is the drawer of file folders with the fluid name.
> **`redesign/lanyard`** is the ID pass hanging on a lanyard.
> **`draft/clean-ui`** is the plain, compact text site.

---

## Direction: the shelf

The landing page is the ThreeUI **Complete Shelf** page, running its own authored Three.js
presentation, with one thing changed: the seven volumes about other people's tools are replaced
by five about Prakyat's own work.

| | Volume | Opens |
|---|---|---|
| I | **Hydration Break** — WC2026 Hydration Break Analyzer | Live dashboard |
| II | **PTM Negatives** — PTM Dataset Extraction Pipeline | Live dashboard |
| III | **CareBridge** — medical cost navigator | Repository |
| IV | **Bladder Cancer** — *Frontiers in Bioinformatics*, 2026 | DOI |
| V | **DNA Codes** — *Nature Communications*, 2026 | DOI |

Each is a real hardcover in the scene: cloth with a woven normal and roughness map, embossed foil
on the front, spine and back, printed endpapers, a page block with gutter compression and
signatures, headbands, a ribbon, and eight interior pages generated from that volume's own text.
Select one and the whole room — walls, shelf, every light — crossfades to its palette. Open it and
the cover swings, the pages flex as real geometry, and you can drag a page across the gutter.

---

## Provenance

The source was fetched, not reconstructed.

| | |
|---|---|
| Fetched from | `https://threeui.com/landing-pages/complete-shelf-v2.html` |
| Result | HTTP 200, 189,455 bytes, 5,933 lines |
| SHA-256 as fetched | `8f1256796bab42b0d60e187176dfcc9d9df33cec1d22ca6f3c3767dcfeca4cb9` |
| SHA-256 in the brief | `606f200fed8602c243f40a11c8c364f0e625c57f80e7c97dc76419da207f198e`, 900,296 bytes |

**The live file no longer matches the registered revision.** The registry entry describes an older
build whose media was base64-embedded, which is where the extra ~710 KB went; the live document
carries the same images as Supabase storage URLs instead. The pasted source bundle agrees with the
live file on every anchor checked — the book array, the geometry builders, the texture generators,
the interaction state machine, the disposal path — so the file on disk is the canonical current
document. Nothing here was rebuilt from a screenshot.

### What was changed, and nothing else

49 hunks, 380 of 5,959 lines. About 300 of those are the volume data.

| Lines | Change |
|---|---|
| 1749–1980 | The `BOOKS` array: five volumes instead of seven |
| 10, 12, 1613–1618 | Title, description and masthead carry his name instead of the series name |
| 2479, 2505, 2821, 3234 | The foil on every cover, spine and page reads `PRAKYAT PRAKASH` |
| 1664–1684, 4386–4389 | The four detail rows are labelled by the volume |
| 1703, 1390–1399, 5684 | **The one addition:** each volume opens the thing it is about |
| 1713–1731, 595–601, 788 | The no-WebGL catalog lists the five, and its titles link out |
| 2930 | One line of colophon text |

Every shader, light, material, geometry builder, texture generator, pointer gesture, keyboard
path, responsive rule, reduced-motion branch, visibility handler, context-loss fallback and
disposal routine is untouched.

**Why the detail rows are data-driven.** A pipeline and a peer-reviewed paper do not describe
themselves with the same four words. Volume II reads *Built with · Scale · Finding · Opens*;
Volume V reads *Authors · Journal · Subject · Opens*. Each volume carries its own labels rather
than everything being forced into Binding / Format / Theme / Motif.

**Why the one addition.** You have asked three times that a project open the real thing. The
authored page has no outward links at all, so one control was added to the detail panel: it takes
the volume's own href, joins the existing focus trap, and is drawn by the page's own
`.text-button` rule.

**Why the cloth colours are the authored ones.** The seven cover artworks live in one embedded
atlas and are assigned by shelf position, so a volume's cloth, spine and back have to agree with
the artwork it is handed. Each volume therefore takes the palette the artwork was tuned against —
ultramarine, burnt orange, citron, cobalt, vermilion — rather than a colour picked for its subject.
The first pass used subject colours and the cloth visibly disagreed with the cover.

---

## The host

Per the integration brief: the document is served from `public/`, loaded by URL into a full-size
iframe with the authored sandbox string, and never imported into the application's JavaScript
graph. First Load JS is **89.8 kB** — the 190 KB document is not part of it.

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
the page's own behaviour, not a bug in the seam.

---

## Measured

Production build, driven in a real browser. Scripts in `.qa/` (gitignored).

| | Result |
|---|---|
| Five volumes, counter, titles, palettes | correct, and the room crossfades with the selection |
| Detail panel, a project | `Built with · Scale · Finding · Opens`, values from the volume |
| Detail panel, a paper | `Authors · Journal · Subject · Opens`, full author list, DOI |
| Each volume opens its own thing | visible row link **and** a control, both to the right URL |
| Book opens, pages turn | `Title page 01/05` → `Break window · Notes 03/05` |
| Dragging a page across the gutter | holds; the spread does not jump |
| Typography seam | applied; `--serif` resolves to Iowan Old Style |
| Mobile 390 × 844 | WebGL up, no horizontal overflow, the host does not scroll |
| Reduced motion | the detail view opens with no transition, as authored |
| No WebGL | the static catalog appears with all five titles, each a link |
| Console errors, host and frame | **0** |

One thing worth knowing about verifying this page: **the open and close transitions are
frame-count-bound, not wall-clock-bound.** `transitionTime` advances by `delta / 0.92` with
`delta` capped at 0.05, so the move always costs at least ~18 rendered frames. On real hardware
that is under a second. In headless Chromium, where this scene renders at a few frames a second,
it can take tens of seconds — the first test runs timed out against it and looked like a hang. A
side-by-side against the pristine, unedited document confirmed the same behaviour there, and
confirmed it is slower with seven books than with five.

---

## To replace

Nothing on this page is written by me. Every title, author list, journal, date, stack, count and
description is yours.

Two things you may want to change:

- **The volume titles are shortened for the spine** — *Hydration Break*, *PTM Negatives*,
  *Bladder Cancer*, *DNA Codes* — with the full name in the deck. Say the word if you want
  different ones.
- **The cover artworks are ThreeUI's**, from the embedded atlas. They are abstract and read as
  field-guide covers, but they were drawn for someone else's books. Replacing them means making
  five new 2:3 artworks; the code takes them from one atlas image, so it is a drop-in.
