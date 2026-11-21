/**
 * Every photograph on the site: 3840px originals from Unsplash (free Unsplash License),
 * served responsive (AVIF/WebP) by next/image. Alt text describes what is visible.
 * Source ids are listed so each photo can be traced or replaced.
 *
 * Share-card crops in src/assets/og with no banner photo here (Unsplash ids):
 * form-i-129 5V6KbvRcnV8 · form-i-130 PoeK9eWJhF4 · form-i-131 rUXh5USKfUQ · form-i-140 6NMcUDG37Yc ·
 * form-i-485 QHf9BnrBvtU · form-i-751 ce5ShWF9tAY · form-i-765 X_bbCAYzlTs · form-i-90 CFHsasTZQsY ·
 * form-n-400 PAGBeJrLiDA · lawyers-page M5k978V3qBc · processing-times ZQ_htZAk8xY
 */

import type { PhotoAsset } from "@/components/ui/Photo";

import about from "@/assets/photos/about.jpg"; // unsplash ymczKuCuf84, vitaly-gariev
import guideActivelyReviewed from "@/assets/photos/guide-actively-reviewed.jpg"; // C3V88BOoRoM, bench-accounting
import guideAfterBiometrics from "@/assets/photos/guide-after-biometrics.jpg"; // SRFG7iwktDk, george-prentzas
import guideI485Time from "@/assets/photos/guide-i485-time.jpg"; // _BK4gpog-G4, renel-wackett
import statusExplained from "@/assets/photos/status-explained.jpg"; // uGcDWKN91Fs, joanna-kosinska

export const PHOTOS = {
  statusExplained: {
    src: statusExplained,
    alt: "Blank white and cream envelopes laid out on a table",
    focus: "50% 50%",
  },
  about: {
    src: about,
    alt: "Four friends of different backgrounds walking and talking in an autumn park",
    focus: "50% 45%",
  },
  guideActivelyReviewed: {
    src: guideActivelyReviewed,
    alt: "A man reading on his laptop at a wooden table by a window",
    focus: "65% 45%",
  },
  guideAfterBiometrics: {
    src: guideAfterBiometrics,
    alt: "A glowing fingerprint on a round biometric scanner",
    focus: "50% 50%",
  },
  guideI485Time: {
    src: guideI485Time,
    alt: "A wall clock in a patch of warm sunlight on a soft blue wall",
    focus: "45% 50%",
  },
} satisfies Record<string, PhotoAsset>;

export const GUIDE_PHOTOS: Record<string, PhotoAsset> = {
  "case-is-being-actively-reviewed": PHOTOS.guideActivelyReviewed,
  "what-happens-after-biometrics": PHOTOS.guideAfterBiometrics,
  "how-long-does-i-485-take": PHOTOS.guideI485Time,
};

/** Text pages that carry a banner. The rest (legal, sign-in, contact) stay text-only on purpose. */
export const TEXT_PAGE_PHOTOS: Record<string, PhotoAsset | undefined> = {
  about: PHOTOS.about,
};
