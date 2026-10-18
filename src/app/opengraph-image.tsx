import { IMAGE_THEME } from "@/lib/design/image-theme";
import { SOCIAL_FONTS } from "@/lib/design/social-fonts";
import { BRAND_STAR_PATH as STAR_PATH } from "@/lib/design/logo";
import { ImageResponse } from "next/og";
import { SITE_NAME, SITE_TAGLINE, SITE_DESCRIPTION } from "@/config/site";

// Default social share card. As a root file, this becomes the Open Graph /
// Twitter image for every route that doesn't define its own.
export const alt = `${SITE_NAME} — ${SITE_TAGLINE}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// The YidVibe brand star (4-point rounded sparkle), drawn in a 0..134 box.


export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: IMAGE_THEME.primary,
          color: IMAGE_THEME.white,
          fontFamily: "Space Grotesk",
          padding: "0 80px",
          textAlign: "center",
        }}
      >
        <svg width="132" height="132" viewBox="0 0 134 134" fill="none">
          <path d={STAR_PATH} fill={IMAGE_THEME.gold} />
        </svg>
        <div
          style={{
            display: "flex",
            fontSize: 72,
            fontWeight: 600,
            letterSpacing: "-0.02em",
            marginTop: 32,
          }}
        >
          {SITE_NAME}
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 36,
            color: IMAGE_THEME.tealSoft,
            marginTop: 8,
          }}
        >
          {SITE_TAGLINE}
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 28,
            color: IMAGE_THEME.mutedText,
            marginTop: 32,
            maxWidth: 760,
          }}
        >
          {SITE_DESCRIPTION}
        </div>
      </div>
    ),
    { ...size, fonts: SOCIAL_FONTS },
  );
}
