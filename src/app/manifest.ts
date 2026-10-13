import { IMAGE_THEME } from "@/lib/design/image-theme";
import type { MetadataRoute } from "next";
import { SITE_NAME, SITE_DESCRIPTION } from "@/config/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE_NAME,
    short_name: SITE_NAME,
    description: SITE_DESCRIPTION,
    start_url: "/",
    display: "standalone",
    background_color: IMAGE_THEME.canvas,
    theme_color: IMAGE_THEME.primary,
    icons: [
      {
        src: "/icon.svg",
        type: "image/svg+xml",
        sizes: "any",
        purpose: "any",
      },
      {
        src: "/apple-icon",
        type: "image/png",
        sizes: "180x180",
      },
    ],
  };
}
