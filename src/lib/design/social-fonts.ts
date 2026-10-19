import { readFileSync } from "node:fs";
import { join } from "node:path";

// Next imports image modules to discover page metadata. Page function bundles
// do not contain these assets, so read them only when rendering an image.
// Explicit paths keep the font files traceable in the image route bundles.
function loadSocialFonts() {
  return [
  {
    name: "Space Grotesk",
    data: Uint8Array.from(readFileSync(join(process.cwd(), "public/fonts/SpaceGrotesk-Regular.ttf"))).buffer,
    weight: 400 as const,
    style: "normal" as const,
  },
  {
    name: "Space Grotesk",
    data: Uint8Array.from(readFileSync(join(process.cwd(), "public/fonts/SpaceGrotesk-Medium.ttf"))).buffer,
    weight: 500 as const,
    style: "normal" as const,
  },
  {
    name: "Space Grotesk",
    data: Uint8Array.from(readFileSync(join(process.cwd(), "public/fonts/SpaceGrotesk-SemiBold.ttf"))).buffer,
    weight: 600 as const,
    style: "normal" as const,
  },
  ];
}

let fonts: ReturnType<typeof loadSocialFonts> | undefined;

/** Cache the original font bytes after the first image render in this process. */
export function getSocialFonts() {
  return fonts ??= loadSocialFonts();
}
