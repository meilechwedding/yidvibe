import palette from "@/styles/palette.json";

/** Serialized image/manifest values come from the same source as CSS tokens. */
export const IMAGE_THEME = {
  canvas: palette.colors.canvas,
  white: palette.colors.surface,
  primary: palette.colors.petrol,
  tealDark: palette.colors.petrol,
  tealStrong: palette.colors.petrol,
  tealSoft: palette.colors.mist,
  gold: palette.colors.citron,
  mutedText: palette.colors.mist,
  // Compatibility names for image renderers; v8 uses a solid petrol surface.
  shareGradient: palette.colors.petrol,
  socialGradient: palette.colors.petrol,
  iconGradient: palette.colors.petrol,
} as const;
