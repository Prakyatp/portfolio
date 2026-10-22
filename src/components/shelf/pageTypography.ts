// The typography seam the landing-page frame uses.
//
// `src/shaders/landing-pages/pageTypography.ts` and `pageRecipes.ts` are not part of the
// registered Complete Shelf bundle, so this is an implementation of the documented contract
// rather than a copy: a recipe holds the packaged document's own authored values, props
// override individual entries, and whatever differs is appended to the loaded document's head
// as one style block. The packaged file is never rewritten, so it stays byte-exact.

export type PageTypographyProps = {
  headingFont?: string;
  bodyFont?: string;
  headingWeight?: string;
  bodyWeight?: string;
  primaryColor?: string;
  headingSize?: number;
  bodySize?: number;
  headingLetterSpacing?: number;
};

export type LandingPageCustomization = PageTypographyProps & { css: string };

const STYLE_ID = "threeui-page-customization";

/** The families the behaviour contract lists, with the stack each one falls back through. */
const FAMILIES: Record<string, { stack: string; webfont?: string }> = {
  "iowan-old-style": { stack: '"Iowan Old Style", "Baskerville", "Times New Roman", serif' },
  "instrument-serif": {
    stack: '"Instrument Serif", Georgia, serif',
    webfont: "Instrument+Serif:ital@0;1",
  },
  newsreader: { stack: '"Newsreader", Georgia, serif', webfont: "Newsreader:opsz,wght@6..72,200..800" },
  geist: { stack: '"Geist", -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif', webfont: "Geist:wght@100..900" },
  inter: { stack: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif' },
};

const family = (key?: string) => (key && FAMILIES[key]) || undefined;

/** The packaged document's own values. Passing these back changes nothing. */
export const COMPLETE_SHELF_TYPOGRAPHY: PageTypographyProps = {
  headingFont: "iowan-old-style",
  bodyFont: "inter",
  headingWeight: "400",
  bodyWeight: "400",
  primaryColor: "#c87046",
  headingSize: 60,
  bodySize: 12,
  headingLetterSpacing: -0.055,
};

const TYPOGRAPHY_KEYS: (keyof PageTypographyProps)[] = [
  "headingFont",
  "bodyFont",
  "headingWeight",
  "bodyWeight",
  "primaryColor",
  "headingSize",
  "bodySize",
  "headingLetterSpacing",
];

/** Lifts the typography props out so the rest can go on to the frame untouched. */
export function splitTypographyProps<T extends PageTypographyProps>(
  props: T,
): [PageTypographyProps, Omit<T, keyof PageTypographyProps>] {
  const type: PageTypographyProps = {};
  const rest: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(props)) {
    if (TYPOGRAPHY_KEYS.includes(key as keyof PageTypographyProps)) {
      (type as Record<string, unknown>)[key] = value;
    } else rest[key] = value;
  }
  return [type, rest as Omit<T, keyof PageTypographyProps>];
}

/**
 * The headings the document sizes together. Each ratio is the packaged clamp's own ceiling
 * over the recipe's heading size, so the authored proportions hold at any value.
 */
const HEADINGS: [selector: string, min: string, fluid: string, ratio: number, tighten: number][] = [
  [".selection__title", "2rem", "3.4vw", 1, 0],
  [".detail-title", "3.5rem", "6.3vw", 1.787, 0.01],
  [".fallback__header h2", "2.5rem", "7vw", 1.653, 0.015],
];

export function usePageTypography(
  recipe: PageTypographyProps,
  overrides: PageTypographyProps,
): LandingPageCustomization {
  const merged: PageTypographyProps = { ...recipe };
  for (const key of TYPOGRAPHY_KEYS) {
    const value = overrides[key];
    if (value !== undefined) (merged as Record<string, unknown>)[key] = value;
  }

  const heading = family(merged.headingFont);
  const body = family(merged.bodyFont);
  const size = merged.headingSize ?? 60;
  const track = merged.headingLetterSpacing ?? -0.055;

  const rules = [
    ":root {",
    heading ? `  --serif: ${heading.stack};` : "",
    body ? `  --mono: ${body.stack};` : "",
    merged.primaryColor ? `  --accent: ${merged.primaryColor};` : "",
    "}",
    `.selection__title, .detail-title, .fallback__header h2, .editorial-identity strong, .page-status strong, .fallback-book strong { font-weight: ${merged.headingWeight ?? "400"}; }`,
    `body { font-weight: ${merged.bodyWeight ?? "400"}; }`,
    ...HEADINGS.map(
      ([selector, min, fluid, ratio, tighten]) =>
        `${selector} { font-size: clamp(${min}, ${fluid}, ${(size * ratio).toFixed(2)}px); letter-spacing: ${(track - tighten).toFixed(4)}em; }`,
    ),
    `.selection__note { font-size: ${merged.bodySize ?? 12}px; }`,
  ];

  return { ...merged, css: rules.filter(Boolean).join("\n") };
}

/** Appends the block to a same-origin frame's own head, replacing any previous one. */
export function applyPageCustomization(
  frame: HTMLIFrameElement | null,
  customization?: LandingPageCustomization,
) {
  let doc: Document | null | undefined;
  try {
    doc = frame?.contentDocument;
  } catch {
    return; // an opaque sandbox origin; the postMessage seam covers that case
  }
  if (!doc) return;

  doc.getElementById(STYLE_ID)?.remove();
  if (!customization) return;

  const needed = family(customization.headingFont)?.webfont;
  const bodyNeeded = family(customization.bodyFont)?.webfont;
  for (const spec of [needed, bodyNeeded]) {
    if (!spec) continue;
    const href = `https://fonts.googleapis.com/css2?family=${spec}&display=swap`;
    if (doc.querySelector(`link[href="${href}"]`)) continue;
    const link = doc.createElement("link");
    link.rel = "stylesheet";
    link.href = href;
    doc.head.appendChild(link);
  }

  const style = doc.createElement("style");
  style.id = STYLE_ID;
  style.textContent = customization.css;
  doc.head.appendChild(style);
}

/** The same payload for a frame whose origin cannot be reached directly. */
export function postPageCustomization(
  frame: HTMLIFrameElement | null,
  customization?: LandingPageCustomization,
) {
  if (!frame || !customization) return;
  frame.contentWindow?.postMessage({ type: "threeui-page-customization", css: customization.css }, "*");
}
