import { ImageResponse } from "next/og";
import { SITE_NAME, SITE_TAGLINE, SITE_DESCRIPTION } from "@/lib/site";

// Default social share card. As a root file, this becomes the Open Graph /
// Twitter image for every route that doesn't define its own.
export const alt = `${SITE_NAME} — ${SITE_TAGLINE}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// The YidVibe brand star (4-point rounded sparkle), drawn in a 0..134 box.
const STAR_PATH =
  "M 68.503906 1.90625 L 76.96875 47.625 C 77.875 52.511719 81.695312 56.332031 86.582031 57.238281 L 132.300781 65.703125 C 133.027344 65.839844 133.550781 66.46875 133.550781 67.207031 C 133.550781 67.941406 133.027344 68.574219 132.300781 68.707031 L 86.582031 77.175781 C 81.695312 78.082031 77.875 81.902344 76.96875 86.789062 L 68.503906 132.507812 C 68.367188 133.234375 67.738281 133.757812 67 133.757812 C 66.261719 133.757812 65.632812 133.234375 65.496094 132.507812 L 57.03125 86.789062 C 56.125 81.902344 52.304688 78.082031 47.417969 77.175781 L 1.699219 68.707031 C 0.972656 68.574219 0.449219 67.941406 0.449219 67.207031 C 0.449219 66.46875 0.972656 65.839844 1.699219 65.703125 L 47.417969 57.238281 C 52.304688 56.332031 56.125 52.511719 57.03125 47.625 L 65.496094 1.90625 C 65.632812 1.179688 66.261719 0.65625 67 0.65625 C 67.738281 0.65625 68.367188 1.179688 68.503906 1.90625 Z";

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
          background: "linear-gradient(135deg, #0c2e2a 0%, #155952 100%)",
          color: "#ffffff",
          fontFamily: "sans-serif",
          padding: "0 80px",
          textAlign: "center",
        }}
      >
        <svg width="132" height="132" viewBox="0 0 134 134" fill="none">
          <path d={STAR_PATH} fill="#e0a12e" />
        </svg>
        <div
          style={{
            display: "flex",
            fontSize: 132,
            fontWeight: 700,
            letterSpacing: "-0.02em",
            marginTop: 28,
          }}
        >
          {SITE_NAME}
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 44,
            color: "#c2d6d1",
            marginTop: 8,
          }}
        >
          {SITE_TAGLINE}
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 28,
            color: "#9fbbb5",
            marginTop: 28,
            maxWidth: 760,
          }}
        >
          {SITE_DESCRIPTION}
        </div>
      </div>
    ),
    { ...size },
  );
}
