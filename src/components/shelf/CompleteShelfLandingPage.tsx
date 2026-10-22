'use client';
// The CompleteShelfLandingPage entry from src/shaders/landing-pages/LandingPages.tsx, kept as
// authored. The title is this collection's rather than the packaged one's, because the document
// it loads is the shelf holding Prakyat's own volumes.
import {
  splitTypographyProps,
  usePageTypography,
  COMPLETE_SHELF_TYPOGRAPHY,
  type PageTypographyProps,
} from './pageTypography';
import { LandingPageFrame, type LandingPageProps } from './LandingPageFrame';

export { LandingPageFrame, applyBackgroundPresentation } from './LandingPageFrame';
export type { LandingPageFrameProps, LandingPageProps } from './LandingPageFrame';

export function CompleteShelfLandingPage(props: LandingPageProps & PageTypographyProps) {
  const [type, frame] = splitTypographyProps(props);
  const customization = usePageTypography(COMPLETE_SHELF_TYPOGRAPHY, type);
  return (
    <LandingPageFrame
      {...frame}
      customization={customization}
      title="Prakyat Prakash — Selected work"
      sourceUrl="/landing-pages/complete-shelf-v2.html"
    />
  );
}
