import { RichText } from "@/components/ui/RichText";

/** Body copy blocks: a string is a paragraph, a string[] is a bullet list. Used by legal and answer pages. */
export function Prose({ blocks }: { blocks: (string | string[])[] }) {
  return (
    <div className="space-y-4 text-body text-slate">
      {blocks.map((block, j) =>
        Array.isArray(block) ? (
          <ul key={j} className="list-disc space-y-2 pl-5 marker:text-border">
            {block.map((item) => (
              <li key={item} className="pl-1">
                <RichText text={item} />
              </li>
            ))}
          </ul>
        ) : (
          <p key={j}>
            <RichText text={block} />
          </p>
        ),
      )}
    </div>
  );
}
