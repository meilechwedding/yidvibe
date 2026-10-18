import { readFileSync } from "node:fs";
import { join } from "node:path";

// Static upstream faces are supported by the social-image renderer. Read once
// per server module, using explicit paths so Next can trace the font assets.
export const SOCIAL_FONTS = [
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
