import { Alexandria, Archivo } from "next/font/google";

/** Latin voice (EN, FR): variable width, widened for display. */
export const archivo = Archivo({
  subsets: ["latin", "latin-ext"],
  axes: ["wdth"],
  variable: "--font-archivo",
  display: "swap",
});

/** Arabic voice: a geometric sans whose structure matches Archivo. */
export const alexandria = Alexandria({
  subsets: ["arabic"],
  variable: "--font-alexandria",
  display: "swap",
});
