import { type MetadataRoute } from "next";

import { profile } from "@/content/profile";
import { siteDescription } from "@/content/site";
import { routing } from "@/i18n/routing";

/** Night colours, matching the viewport's theme colour and the page's ground. */
const NIGHT = "#0c1a2c";

export default function manifest(): MetadataRoute.Manifest {
  const person = profile[routing.defaultLocale];
  return {
    name: `${person.name} · ${person.title}`,
    short_name: "MNB",
    description: siteDescription[routing.defaultLocale],
    // The root negotiates the visitor's language.
    start_url: "/",
    display: "browser",
    background_color: NIGHT,
    theme_color: NIGHT,
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      {
        src: "/icons/icon-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
