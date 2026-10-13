import { IMAGE_THEME } from "@/lib/design/image-theme";
import { BRAND_STAR_PATH as STAR_PATH } from "@/lib/design/logo";
import { ImageResponse } from "next/og";

// Apple touch icon — a teal rounded square with the brand gold star.
export const size = { width: 180, height: 180 };
export const contentType = "image/png";



export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: IMAGE_THEME.iconGradient,
        }}
      >
        <svg width="108" height="108" viewBox="0 0 134 134" fill="none">
          <path d={STAR_PATH} fill={IMAGE_THEME.gold} />
        </svg>
      </div>
    ),
    { ...size },
  );
}
