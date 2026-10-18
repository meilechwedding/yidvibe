import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";

const palettePath = new URL("../src/styles/palette.json", import.meta.url);
const output = fileURLToPath(new URL("../src/styles/palette.css", import.meta.url));
const { colors, aliases = {} } = JSON.parse(readFileSync(palettePath, "utf8"));
for (const [name, color] of Object.entries(colors)) {
  if (!/^[a-z][a-z0-9-]*$/.test(name) || !/^#[\da-f]{6}$/i.test(color)) throw new Error(`Invalid palette token: ${name}`);
}
for (const [name, target] of Object.entries(aliases)) {
  if (!/^[a-z][a-z0-9-]*$/.test(name) || Object.hasOwn(colors, name) || !Object.hasOwn(colors, target)) throw new Error(`Invalid palette alias: ${name}`);
}
const declarations = [
  ...Object.entries(colors).map(([name, color]) => `  --color-${name}: ${color};`),
  ...Object.entries(aliases).map(([name, target]) => `  --color-${name}: var(--color-${target});`),
];
const css = `/* Generated from palette.json. Run npm run theme:sync after editing colors. */\n@theme {\n${declarations.join("\n")}\n}\n`;
if (process.argv.includes("--check")) {
  if (!existsSync(output) || readFileSync(output, "utf8") !== css) throw new Error("Palette CSS is out of date. Run npm run theme:sync.");
  process.stdout.write("Theme palette is synchronized.\n");
} else {
  writeFileSync(output, css, "utf8");
  process.stdout.write("Generated src/styles/palette.css.\n");
}
