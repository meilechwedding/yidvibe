import { ImageResponse } from "next/og";
import { getSocialFonts } from "@/lib/design/social-fonts";
import { getSocialBrandLogo } from "@/lib/design/logo";
import { IMAGE_THEME } from "@/lib/design/image-theme";

export const alt = "YidVibe. Good work starts a conversation.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

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
          padding: "40px 80px",
          textAlign: "center",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={getSocialBrandLogo()} alt="" width={800} height={191} />
        <div
          style={{
            display: "flex",
            fontSize: 58,
            fontWeight: 600,
            letterSpacing: "-.03em",
            marginTop: 36,
            color: IMAGE_THEME.gold,
          }}
        >
          Good work starts a conversation.
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 28,
            marginTop: 28,
            color: IMAGE_THEME.tealSoft,
          }}
        >
          Discover AI projects. Meet the people behind them.
        </div>
      </div>
    ),
    { ...size, fonts: getSocialFonts() },
  );
}
