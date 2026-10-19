import { expect, it, vi } from "vitest";

const readFileSync = vi.hoisted(() => vi.fn(() => { throw new Error("Font absent from page bundle"); }));
vi.mock("node:fs", () => ({ readFileSync }));

it("imports page image metadata without reading image-only font assets, then caches fonts on demand", async () => {
  await expect(import("@/app/opengraph-image")).resolves.toMatchObject({
    size: { width: 1200, height: 630 }, contentType: "image/png",
  });
  await expect(import("@/lib/og")).resolves.toHaveProperty("ogImage");
  expect(readFileSync).not.toHaveBeenCalled();

  readFileSync.mockImplementation(() => Buffer.from([0, 1, 2, 3]) as never);
  const { getSocialFonts } = await import("@/lib/design/social-fonts");
  const fonts = getSocialFonts();
  expect(fonts.map(font => font.weight)).toEqual([400, 500, 600]);
  expect(fonts.every(font => font.data.byteLength === 4)).toBe(true);
  expect(getSocialFonts()).toBe(fonts);
  expect(readFileSync).toHaveBeenCalledTimes(3);
});
