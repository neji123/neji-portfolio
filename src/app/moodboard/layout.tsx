import { type Metadata } from "next";

import { alexandria, archivo, readexPro } from "@/features/moodboard/fonts";

import "@/features/moodboard/moodboard.css";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function MoodboardLayout({ children }: LayoutProps<"/moodboard">) {
  return (
    <div className={`${archivo.variable} ${alexandria.variable} ${readexPro.variable} flex-1`}>
      {children}
    </div>
  );
}
