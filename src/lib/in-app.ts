/**
 * Public reference pages that also live inside the dashboard. Signed-in people reading
 * them in the app stay in the app: links to these pages are rewritten to the dashboard copy.
 * The public pages stay the canonical (indexed) versions.
 */
const IN_APP: [publicPath: string, appPath: string][] = [
  ["/status-explained", "/dashboard/statuses"],
  ["/processing-times", "/dashboard/processing-times"],
  ["/answers", "/dashboard/answers"],
  ["/help", "/dashboard/help"],
];

/** "/answers/x#y" → "/dashboard/answers/x#y"; anything else is returned unchanged. */
export function inAppHref(href: string): string {
  for (const [pub, app] of IN_APP) {
    if (href === pub || href.startsWith(`${pub}/`) || href.startsWith(`${pub}#`) || href.startsWith(`${pub}?`)) {
      return app + href.slice(pub.length);
    }
  }
  return href;
}
