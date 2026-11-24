import { Info, Lightbulb, TriangleAlert } from "lucide-react";
import { RichText } from "@/components/ui/RichText";
import type { Block } from "@/lib/blog";

const CALLOUT = {
  info: { icon: Info, box: "border-blue/20 bg-ice", tint: "text-blue" },
  warning: { icon: TriangleAlert, box: "border-amber/25 bg-amber/5", tint: "text-amber" },
  tip: { icon: Lightbulb, box: "border-teal/25 bg-teal/5", tint: "text-teal" },
} as const;

/** One section's body: paragraphs, bullets, numbered steps, tables and callouts. Long-form reading size. */
export function BlogBlocks({ blocks }: { blocks: Block[] }) {
  return (
    <div className="space-y-5 text-lead text-slate">
      {blocks.map((b, i) => {
        if (typeof b === "string") {
          return (
            <p key={i}>
              <RichText text={b} />
            </p>
          );
        }
        if (Array.isArray(b)) {
          return (
            <ul key={i} className="list-disc space-y-2.5 pl-6 marker:text-blue/50">
              {b.map((item) => (
                <li key={item} className="pl-1">
                  <RichText text={item} />
                </li>
              ))}
            </ul>
          );
        }
        if (b.kind === "steps") {
          return (
            <ol key={i} className="space-y-4">
              {b.items.map((s, n) => (
                <li key={s.title} className="flex gap-4">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-ice text-small font-semibold text-blue tabular-nums">
                    {n + 1}
                  </span>
                  <div className="min-w-0 pt-0.5">
                    <p className="text-body font-semibold text-midnight">{s.title}</p>
                    <p className="mt-1 text-body text-slate">
                      <RichText text={s.text} />
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          );
        }
        if (b.kind === "table") {
          return (
            <figure key={i}>
              <div className="overflow-x-auto rounded-xl border border-border bg-white">
                <table className="w-full min-w-[32rem] border-collapse text-left text-small">
                  <caption className="border-b border-border bg-cloud px-4 py-3 text-left text-small font-semibold text-midnight">
                    {b.caption}
                  </caption>
                  <thead>
                    <tr className="border-b border-border">
                      {b.head.map((h) => (
                        <th key={h} scope="col" className="px-4 py-2.5 font-semibold whitespace-nowrap text-midnight">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="tabular-nums">
                    {b.rows.map((r) => (
                      <tr key={r.join("|")} className="border-b border-border last:border-0 even:bg-cloud/50">
                        {r.map((c, j) =>
                          j === 0 ? (
                            <th key={j} scope="row" className="px-4 py-2.5 font-semibold whitespace-nowrap text-midnight">
                              {c}
                            </th>
                          ) : (
                            <td key={j} className={`px-4 py-2.5 whitespace-nowrap ${c === "C" ? "font-semibold text-teal" : "text-slate"}`}>
                              {c === "C" ? "Current" : c}
                            </td>
                          ),
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {b.note && (
                <figcaption className="mt-2 text-small text-slate">
                  <RichText text={b.note} />
                </figcaption>
              )}
            </figure>
          );
        }
        const c = CALLOUT[b.tone];
        return (
          <aside key={i} className={`flex gap-3 rounded-xl border p-4 sm:p-5 ${c.box}`}>
            <c.icon aria-hidden className={`mt-0.5 size-5 shrink-0 ${c.tint}`} />
            <div className="min-w-0">
              <p className="text-body font-semibold text-midnight">{b.title}</p>
              <p className="mt-1 text-body text-slate">
                <RichText text={b.text} />
              </p>
            </div>
          </aside>
        );
      })}
    </div>
  );
}
