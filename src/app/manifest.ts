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
        src: "/icon.png",
        type: "image/png",
        sizes: "192x192",
        purpose: "any",
      },
      {
        src: "/apple-icon.png",
        type: "image/png",
        sizes: "180x180",
      },
    ],
  };
}
