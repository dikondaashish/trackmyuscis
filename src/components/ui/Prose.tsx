import { RichText } from "@/components/ui/RichText";

/**
 * Body copy blocks: a string is a paragraph, a string[] is a bullet list. Used by legal and
 * answer pages. `inApp` is the dashboard version: smaller type, links kept in the app.
 */
export function Prose({ blocks, inApp = false }: { blocks: (string | string[])[]; inApp?: boolean }) {
  return (
    <div className={inApp ? "space-y-3 text-small text-slate" : "space-y-4 text-body text-slate"}>
      {blocks.map((block, j) =>
        Array.isArray(block) ? (
          <ul key={j} className="list-disc space-y-2 pl-5 marker:text-border">
            {block.map((item) => (
              <li key={item} className="pl-1">
                <RichText text={item} inApp={inApp} />
              </li>
            ))}
          </ul>
        ) : (
          <p key={j}>
            <RichText text={block} inApp={inApp} />
          </p>
        ),
      )}
    </div>
  );
}
