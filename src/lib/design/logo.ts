import { readFileSync } from "node:fs";
import { join } from "node:path";

/** Load only inside an image handler, never during a page's module import. */
export function getSocialBrandLogo() {
  return `data:image/png;base64,${readFileSync(join(process.cwd(), "public/brand/v8/source/yidvibe-horizontal-reversed-on-petrol.png")).toString("base64")}`;
}
