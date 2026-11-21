/**
 * Every photograph on the site: 3840px originals from Unsplash (free Unsplash License),
 * served responsive (AVIF/WebP) by next/image. Alt text describes what is visible.
 * Source ids are listed so each photo can be traced or replaced.
 */

import type { PhotoAsset } from "@/components/ui/Photo";

import about from "@/assets/photos/about.jpg"; // unsplash ymczKuCuf84, vitaly-gariev
import formI129 from "@/assets/photos/form-i-129.jpg"; // 5V6KbvRcnV8, vitaly-gariev
import formI130 from "@/assets/photos/form-i-130.jpg"; // PoeK9eWJhF4, jamie-trinh
import formI131 from "@/assets/photos/form-i-131.jpg"; // rUXh5USKfUQ (wall exit sign retouched to a plain panel, shadows lifted)
import formI140 from "@/assets/photos/form-i-140.jpg"; // 6NMcUDG37Yc, national-cancer-institute
import formI485 from "@/assets/photos/form-i-485.jpg"; // QHf9BnrBvtU, julio-lopez
import formI751 from "@/assets/photos/form-i-751.jpg"; // ce5ShWF9tAY, allgo
import formI765 from "@/assets/photos/form-i-765.jpg"; // X_bbCAYzlTs, nathan-dumlao (register logo and screen text retouched out)
import formI90 from "@/assets/photos/form-i-90.jpg"; // CFHsasTZQsY, vitaly-gariev
import formN400 from "@/assets/photos/form-n-400.jpg"; // PAGBeJrLiDA, dario-valenzuela
import guideActivelyReviewed from "@/assets/photos/guide-actively-reviewed.jpg"; // C3V88BOoRoM, bench-accounting
import guideAfterBiometrics from "@/assets/photos/guide-after-biometrics.jpg"; // SRFG7iwktDk, george-prentzas
import guideI485Time from "@/assets/photos/guide-i485-time.jpg"; // _BK4gpog-G4, renel-wackett
import homeHowItWorks from "@/assets/photos/home-how-it-works.jpg"; // 3EnlBPEgIxM, surface
import homeLawyers from "@/assets/photos/home-lawyers.jpg"; // 4Rvy2Nz6RyE, md-ishak-rahman
import lawyersPage from "@/assets/photos/lawyers-page.jpg"; // M5k978V3qBc, vitaly-gariev
import processingTimes from "@/assets/photos/processing-times.jpg"; // ZQ_htZAk8xY, swello
import statusExplained from "@/assets/photos/status-explained.jpg"; // uGcDWKN91Fs, joanna-kosinska

export const PHOTOS = {
  homeHowItWorks: {
    src: homeHowItWorks,
    alt: "Two women smiling at a laptop on a sunlit dining table",
    focus: "45% 45%",
  },
  homeLawyers: {
    src: homeLawyers,
    alt: "An advisor goes over a document with a client across a desk in a bright office",
    focus: "50% 45%",
  },
  processingTimes: {
    src: processingTimes,
    alt: "A hand writes in a monthly planner beside a cup of coffee",
    focus: "60% 45%",
  },
  lawyersPage: {
    src: lawyersPage,
    alt: "An advisor reviews papers with a client at a table by a bright window",
    focus: "40% 40%",
  },
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
  formI130: {
    src: formI130,
    alt: "Three generations of a family smiling together at their front door",
    focus: "62% 45%",
  },
  formI485: {
    src: formI485,
    alt: "A smiling couple on the floor by a sunny window, looking at a laptop together",
    focus: "45% 15%",
  },
  formI765: {
    src: formI765,
    alt: "A café worker in an apron using the register behind a wooden counter",
    focus: "70% 40%",
  },
  formI131: {
    src: formI131,
    alt: "Travelers with suitcases walking through a sunlit airport terminal",
    focus: "60% 62%",
  },
  formN400: {
    src: formN400,
    alt: "Two women laughing together on a park bench in warm evening light",
    focus: "60% 55%",
  },
  formI129: {
    src: formI129,
    alt: "A diverse group of colleagues talking over coffee in a bright office",
    focus: "50% 45%",
  },
  formI140: {
    src: formI140,
    alt: "Three scientists in lab coats studying a tablet together in a laboratory",
    focus: "50% 15%",
  },
  formI751: {
    src: formI751,
    alt: "A couple smiling at each other while cooking together at home",
    focus: "50% 45%",
  },
  formI90: {
    src: formI90,
    alt: "A young woman taking notes beside her open laptop at a desk",
    focus: "55% 40%",
  },
} satisfies Record<string, PhotoAsset>;

export const FORM_PHOTOS: Record<string, PhotoAsset> = {
  "i-130": PHOTOS.formI130,
  "i-485": PHOTOS.formI485,
  "i-765": PHOTOS.formI765,
  "i-131": PHOTOS.formI131,
  "n-400": PHOTOS.formN400,
  "i-129": PHOTOS.formI129,
  "i-140": PHOTOS.formI140,
  "i-751": PHOTOS.formI751,
  "i-90": PHOTOS.formI90,
};

export const GUIDE_PHOTOS: Record<string, PhotoAsset> = {
  "case-is-being-actively-reviewed": PHOTOS.guideActivelyReviewed,
  "what-happens-after-biometrics": PHOTOS.guideAfterBiometrics,
  "how-long-does-i-485-take": PHOTOS.guideI485Time,
};

/** Text pages that carry a banner. The rest (legal, sign-in, contact) stay text-only on purpose. */
export const TEXT_PAGE_PHOTOS: Record<string, PhotoAsset | undefined> = {
  about: PHOTOS.about,
};
