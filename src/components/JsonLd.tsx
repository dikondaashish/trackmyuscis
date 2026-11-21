/**
 * schema.org structured data for search engines and AI assistants.
 * Pass one or more schema objects; they are emitted as a single @graph.
 * `<` is escaped so content can never close the script tag.
 */
export function JsonLd({ data }: { data: object | object[] }) {
  const graph = Array.isArray(data) ? data : [data];
  const json = JSON.stringify({ "@context": "https://schema.org", "@graph": graph }).replace(/</g, "\\u003c");
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}
