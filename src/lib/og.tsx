import { getSocialBrandLogo } from "@/lib/design/logo";
import { IMAGE_THEME } from "@/lib/design/image-theme";
import { getSocialFonts } from "@/lib/design/social-fonts";
import { ImageResponse } from "next/og";

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/png";

/** Shared branded Open Graph card for project share links. */
export function ogImage({
  title,
  description,
  image,
  kind,
}: {
  title: string;
  description?: string;
  image?: string | null;
  kind?: string;
}) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 64,
          color: IMAGE_THEME.white,
          background: IMAGE_THEME.primary,
          fontFamily: "Space Grotesk",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: 28,
            fontWeight: 600,
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={getSocialBrandLogo()}
            alt="YidVibe"
            width={300}
            height={72}
          />
          {kind ? (
            <div style={{ fontSize: 20, fontWeight: 500, opacity: 0.85 }}>
              {kind}
            </div>
          ) : null}
        </div>

        {image ? (
          <div
            style={{
              display: "flex",
              flex: 1,
              margin: "32px 0",
              borderRadius: 24,
              overflow: "hidden",
              border: "1px solid rgba(255,255,255,0.18)",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={image}
              alt=""
              width={1072}
              height={360}
              style={{ width: "100%", height: "100%", objectFit: "contain" }}
            />
          </div>
        ) : null}

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div
            style={{
              fontSize: image ? 48 : 64,
              fontWeight: 600,
              lineHeight: 1.1,
            }}
          >
            {title}
          </div>
          {description ? (
            <div style={{ fontSize: 28, lineHeight: 1.3, opacity: 0.85 }}>
              {description}
            </div>
          ) : null}
        </div>
      </div>
    ),
    { ...OG_SIZE, fonts: getSocialFonts() },
  );
}
