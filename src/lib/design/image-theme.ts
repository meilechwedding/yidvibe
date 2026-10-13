import palette from "@/styles/palette.json";

/** Serialized image/manifest values come from the same source as CSS tokens. */
export const IMAGE_THEME = {
  canvas: palette.colors.canvas,
  white: palette.colors.surface,
  primary: palette.colors["teal-600"],
  tealDark: palette.colors["teal-900"],
  tealStrong: palette.colors["teal-700"],
  tealSoft: palette.colors["teal-100"],
  gold: palette.colors["amber-500"],
  mutedText: palette.images.mutedText,
  shareGradient: `linear-gradient(135deg, ${palette.images.shareStart} 0%, ${palette.images.shareEnd} 100%)`,
  socialGradient: `linear-gradient(135deg, ${palette.colors["teal-900"]} 0%, ${palette.colors["teal-700"]} 100%)`,
  iconGradient: `linear-gradient(135deg, ${palette.colors["teal-700"]} 0%, ${palette.colors["teal-900"]} 100%)`,
} as const;
