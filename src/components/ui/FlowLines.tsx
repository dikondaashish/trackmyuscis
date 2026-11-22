/**
 * Decoration: three calm "journey" lines that draw in, with stops along the main one and a
 * small dot travelling it (received → in progress → decided). Purely visual, hidden from
 * screen readers, and still when motion is reduced. `dark` for midnight panels, `light` for
 * cloud and white sections.
 */
const MAIN = "M-20 440 C 110 440 160 350 260 335 C 360 320 400 250 470 222 C 540 194 585 128 680 96";
const LINES = [
  { d: "M-20 470 C 130 470 190 390 290 372 C 400 352 440 290 510 262 C 580 234 610 180 680 150", w: 1.5, o: 0.5 },
  { d: "M-20 405 C 90 405 140 318 236 302 C 330 286 370 214 438 184 C 506 154 560 84 680 46", w: 1.5, o: 0.35 },
];
const STOPS = [
  { x: 260, y: 335, delay: 1300 },
  { x: 470, y: 222, delay: 1900 },
];

export function FlowLines({ tone = "dark", className = "" }: { tone?: "dark" | "light"; className?: string }) {
  const line = tone === "dark" ? "var(--brand-ice)" : "var(--brand-blue)";
  const strength = tone === "dark" ? 0.22 : 0.14;
  return (
    <svg
      aria-hidden
      focusable="false"
      viewBox="0 0 640 480"
      preserveAspectRatio="xMaxYMax slice"
      className={`pointer-events-none ${className}`}
      fill="none"
    >
      {LINES.map((l, i) => (
        <path
          key={i}
          d={l.d}
          pathLength={1}
          stroke={line}
          strokeOpacity={strength * l.o}
          strokeWidth={l.w}
          strokeLinecap="round"
          className="draw"
          style={{ "--len": 1, animationDelay: `${300 + i * 200}ms` } as React.CSSProperties}
        />
      ))}
      <path
        id={`flow-main-${tone}`}
        d={MAIN}
        pathLength={1}
        stroke={line}
        strokeOpacity={strength}
        strokeWidth={2}
        strokeLinecap="round"
        className="draw"
        style={{ "--len": 1 } as React.CSSProperties}
      />
      {STOPS.map((s) => (
        <g key={s.x} className="pop" style={{ animationDelay: `${s.delay}ms`, transformOrigin: `${s.x}px ${s.y}px`, transformBox: "view-box" }}>
          <circle cx={s.x} cy={s.y} r={9} fill={line} fillOpacity={strength * 0.5} />
          <circle cx={s.x} cy={s.y} r={4} fill={line} fillOpacity={strength * 2.2} />
        </g>
      ))}
      {/* Hidden until it starts moving, so it never sits at the corner. */}
      <circle r={4.5} fill="var(--brand-teal)" opacity={0} className="travel-dot">
        <set attributeName="opacity" to="1" begin="2.4s" />
        <animateMotion dur="9s" begin="2.4s" repeatCount="indefinite" rotate="auto">
          <mpath href={`#flow-main-${tone}`} />
        </animateMotion>
      </circle>
    </svg>
  );
}
