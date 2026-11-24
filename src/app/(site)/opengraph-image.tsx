/**
 * The homepage's share card. The root opengraph-image covers pages with no card of their own,
 * but a page that sets its own Open Graph tags (as the homepage does) drops an image inherited
 * from a parent segment, so the homepage needs the file beside it.
 */
export { default, alt, contentType, size } from "../opengraph-image";
