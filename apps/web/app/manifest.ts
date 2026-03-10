import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "AutoCancel",
    short_name: "AutoCancel",
    description: "Never forget to cancel a free trial again.",
    start_url: "/",
    display: "standalone",
    background_color: "#f8fcfe",
    theme_color: "#0c7d8d",
    icons: [
      {
        src: "/icon.svg",
        sizes: "192x192",
        type: "image/svg+xml",
      },
    ],
  };
}
