import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { ACCENT_HERO, ACCENT_PILL, ACCENT_AVATAR, ACCENT_COVER, accentFor } from "@/lib/design/accents";

const theme = readFileSync("src/styles/theme.css", "utf8") + readFileSync("src/styles/palette.css", "utf8");
const css = readFileSync("src/app/globals.css", "utf8");
const tokens = Object.fromEntries([...theme.matchAll(/(--[\w-]+):\s*([^;]+);/g)].map((m) => [m[1], m[2].trim()]));
function color(token: string): string {
  const value = tokens[token];
  if (!value) throw new Error(`Missing theme token ${token}`);
  const alias = /^var\((--[\w-]+)\)$/.exec(value);
  return alias ? color(alias[1]) : value;
}
function luminance(hex: string): number {
  const rgb = hex.replace("#", "").match(/../g)!.map((v) => parseInt(v, 16) / 255);
  const linear = rgb.map((v) => v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
  return linear[0] * 0.2126 + linear[1] * 0.7152 + linear[2] * 0.0722;
}
function contrast(foreground: string, background: string): number {
  const a = luminance(foreground), b = luminance(background);
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}
describe("shared brand theme", () => {
  it("keeps legacy palette aliases tied to canonical theme tokens", () => {
    expect(color("--canvas")).toBe("#fbfcfd");
    expect(color("--teal-600")).toBe("#1f6e66");
    expect(color("--gold-500")).toBe("#e0a12e");
    expect(color("--orange-mid")).toBe("#d17f4a");
    expect(color("--color-gold-tint")).toBe(color("--color-amber-50"));
    expect(css).toContain('@import "../styles/theme.css"');
  });
  it("provides every accent consistently without changing stable avatar colors", () => {
    for (const accent of Object.keys(ACCENT_HERO) as (keyof typeof ACCENT_HERO)[]) {
      expect(ACCENT_PILL[accent]).toBeTruthy();
      expect(ACCENT_AVATAR[accent]).toBeTruthy();
      expect(ACCENT_COVER[accent]).toBeTruthy();
    }
    expect(accentFor("YidVibe")).toBe(accentFor("YidVibe"));
    expect(accentFor("")).toBe("teal");
  });
  it("keeps small action and medal text at WCAG AA contrast", () => {
    for (const [foreground, background] of [
      ["#ffffff", color("--orange-deep")],
      ["#ffffff", color("--sage-deep")],
      [color("--ink"), color("--gold-500")],
      [color("--gold-900"), color("--gold-50")],
      [color("--ink"), "#9aa3ab"],
      [color("--ink"), "#c08457"],
    ]) expect(contrast(foreground, background)).toBeGreaterThanOrEqual(4.5);
    expect(css).toContain('.btn-orange { background: var(--orange-deep)');
    expect(css).toContain('.pc-flag.is-live { background: var(--sage-deep)');
    expect(ACCENT_PILL.gold).toContain("text-amber-900");
  });
});
