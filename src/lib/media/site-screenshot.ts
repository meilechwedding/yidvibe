export function siteScreenshotUrl(
  url: string,
  { w = 1200, h = 900 }: { w?: number; h?: number } = {},
): string {
  return `https://s.wordpress.com/mshots/v1/${encodeURIComponent(url)}?w=${w}&h=${h}`;
}
