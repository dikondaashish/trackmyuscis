/**
 * Shared class names: one button pair, one card, one link look, one heading scale.
 * Simplicity rule: if a new style is needed, extend these instead of inventing one.
 */

export const focusRing =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue";

/** Page width and equal left/right gutters. */
export const container = "mx-auto w-full max-w-7xl px-5 sm:px-8";

/**
 * Centred reading widths for text-only pages, so the page is balanced instead of
 * leaving the right side empty. docContainer: contents list + article (legal pages);
 * readContainer: one column of text or a list (hubs).
 */
export const docContainer = "mx-auto w-full max-w-5xl px-5 sm:px-8";
export const readContainer = "mx-auto w-full max-w-3xl px-5 sm:px-8";

/** Vertical rhythm for every section: 80px phone, 112px from 640px. */
export const section = "py-20 sm:py-28";

export const btnPrimary = `inline-flex min-h-12 cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-[10px] bg-blue px-6 text-body font-semibold text-white transition-[background-color,transform] duration-200 hover:bg-midnight active:scale-[0.98] motion-reduce:active:scale-100 ${focusRing}`;

export const btnSecondary = `inline-flex min-h-12 cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-[10px] border border-border bg-white px-6 text-body font-semibold text-midnight transition-[border-color,transform] duration-200 hover:border-blue active:scale-[0.98] motion-reduce:active:scale-100 ${focusRing}`;

/** Inline text link: underline draws in on hover. */
export const textLink = `link-draw inline-flex min-h-11 items-center gap-1.5 rounded font-semibold text-blue ${focusRing}`;

/** The one card style. Linked cards lift 2px on hover. */
export const card = "rounded-2xl border border-border bg-white";
export const cardLink = `${card} group block transition-[transform,border-color,box-shadow] duration-200 hover:-translate-y-0.5 hover:border-blue/40 hover:shadow-[0_12px_32px_-18px_rgba(16,34,61,0.35)] motion-reduce:hover:translate-y-0 ${focusRing}`;

export const display = "text-display text-midnight";
export const h1 = "text-h1 text-midnight";
export const h2 = "text-h2 text-midnight";
export const lead = "text-lead text-slate";

export const fieldLabel = "block text-small font-semibold text-midnight";
export const field =
  "h-12 w-full min-w-0 rounded-[10px] border border-border bg-white px-4 text-body text-midnight transition-[border-color,box-shadow] duration-200 placeholder:text-slate/70 focus:border-blue focus:outline-none focus:ring-4 focus:ring-blue/15";
