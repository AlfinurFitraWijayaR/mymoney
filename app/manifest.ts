import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "myMoney – Financial Management",
    short_name: "myMoney",
    description: "Multi-tenant financial tracking and management platform",
    start_url: "/",
    display: "standalone",
    background_color: "#cbd5e1",
    theme_color: "#cbd5e1",
    icons: [
      {
        src: "/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
