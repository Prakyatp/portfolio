# DESIGN.md

prakyatprakash.com. What it is, how it is built, and what still needs your words.

> Three directions are kept whole, one per branch. This is **`redesign/folders`**.
> **`redesign/lanyard`** is the ID pass hanging on a lanyard.
> **`draft/clean-ui`** is the plain, compact text site.

---

## Brief

| | |
|---|---|
| **Subject** | Prakyat Prakash. MS Computer Science, RIT (Aug 2024 to Dec 2026). Graduate Research Assistant in ML at the Cui Lab, two co-authored papers, previously AI Engineer at Handshake AI. |
| **Audience** | Recruiters and hiring engineers for 2026 SWE and ML roles. |
| **Job** | Show what he builds, prove it is real, make it easy to get in touch. |
| **Order** | Name, Education, Research, Experience, Projects, Contact. |
| **Stack** | Next.js 14 App Router, TypeScript, plain CSS. GSAP + Lenis for scroll. |

---

## Direction: a drawer of folders

From a reference image: a stack of coloured file folders with offset tabs, under a serif
masthead. The whole site is that drawer. There is no nav bar and no footer — the folders are the
navigation and the last one is the contact page.

**Opening a folder lifts it, and everything above it, to the top of the screen as thin tabs;
pushes the folders still to come down to the bottom; and gives the open folder everything in
between.** Education opens and Research, Experience, Projects and Contact stay stacked at the
bottom. Contact has nothing below it, so it ends up covering the screen. Clicking a tab higher up
puts the choices back.

Click and scroll drive the same number. The page is six screens tall and how far into it you are
*is* the level, interpolated so dragging the scrollbar moves the folders directly, snapped 140ms
after you stop so it always settles on a level. A tab click is the same move with a duration.

### How the geometry works

One function decides everything, for folder `i` at whole level `L`, screen height `H`, tab
height `T`:

| | |
|---|---|
| `L = 0` (masthead) | `0.47H + i·T` — the stack sits under the name, each tab showing |
| folder is open or above the open one | `i·T` — stacked flush to the top |
| folder is still to come | `H − (5 − i)·T` — parked at the bottom |

Scrolling interpolates between `L` and `L+1`. Two things are set on a change of level rather than
every frame, because they cost layout: a panel is only ever as tall as the gap between its own tab
and the next folder's, and only the open folder's contents are visible and focusable (`inert`,
plus `visibility`, so a closed drawer is not in the tab order).

The folder shape is plain CSS — a tab with rounded top corners, and the concave shoulder where it
meets the folder's top edge is a `radial-gradient` corner on each side of it. The paper is one
`feTurbulence` tile multiplied into the colour, so there is no extra layer to composite.

### Palette

The folders are objects, so they carry their own paper colours against a pale blue ground.

| Folder | Paper | Ink | Secondary |
|---|---|---|---|
| ground | `#e3eef4` | | |
| Education | `#c3c45a` olive | `#1b1c12` | `#45461f` |
| Research | `#e7c0c6` blush | `#241a1c` | `#65464b` |
| Experience | `#b9a1ad` mauve | `#211a1e` | `#4e383f` |
| Projects | `#9d2a2a` red | `#f7efe5` | `#eec4b4` |
| Contact | `#24262a` ink | `#f1efe9` | `#a6aeb6` |

### Type

**Instrument Serif** for the masthead and the panel titles, **Schibsted Grotesk** for everything
else, **JetBrains Mono** for kickers, dates and destinations.

### Decisions

**No header, no footer.** The tabs are the navigation and Contact is the last folder. The 404 page
keeps a header and footer of its own, since it has no drawer.

**Projects link out.** Every card opens the live dashboard or the repository. There are no
case-study pages.

**On a phone the role and project cards run sideways.** Three columns will not fit the height a
panel has on a phone; a snapping horizontal row costs no vertical space at all.

**Reduced motion turns the rig off entirely.** No sticky stage, no scroll mapping: the folders
become a plain stack of sections, open, in document order.

**The first Tab finishes every pending scroll reveal** elsewhere on the site — those use
`visibility: hidden`, which takes a block out of the tab order.

---

## Measured

Production build. Scripts in `.qa/` (gitignored).

| | Result |
|---|---|
| mobile LCP, throttled 4G + 4x CPU | **692ms** |
| CLS | **0** |
| fps opening a folder, mobile | **60** |
| axe serious or critical, at every level | **0** |
| tap targets under 24px | **0** |
| horizontal overflow | **none** at 390 and 1440 |
| keyboard | tabs always reachable; only the open folder's links are |
| console errors | **0** |

---

## To replace

Nothing in this version is written by me — every number, author list, date, course and project
description is yours. The `offTheClock` block in `src/data/site.ts` is no longer rendered; if you
want it back, say where it belongs and give me your own line for it.
