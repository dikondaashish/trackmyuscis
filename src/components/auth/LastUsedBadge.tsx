/** Small tag on the corner of the sign-in option used last on this device. */
export function LastUsedBadge() {
  return (
    <span className="pop pointer-events-none absolute -top-2.5 -right-2 z-10 rounded-md bg-blue px-2 ring-2 ring-white text-caption leading-5 font-semibold text-white shadow-[0_4px_10px_-4px_rgb(16_34_61/0.4)]">
      Last used
    </span>
  );
}
