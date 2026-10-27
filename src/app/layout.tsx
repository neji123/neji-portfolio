import { type Metadata } from "next";

import { siteMeta, uiStrings } from "@/content/site";

import "@/styles/globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteMeta.url),
  title: siteMeta.title,
  description: siteMeta.description,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang={siteMeta.locale} className="h-full">
      <body className="flex min-h-full flex-col">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:bg-ink focus:px-4 focus:py-2 focus:text-ground"
        >
          {uiStrings.skipToContent}
        </a>
        {children}
      </body>
    </html>
  );
}
