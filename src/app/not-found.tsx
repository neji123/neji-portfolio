import Link from "next/link";

import messages from "../../messages/en.json";

import "@/styles/globals.css";

// Reached only outside a locale (the proxy routes every page path into one), so English is right here.
export default function RootNotFound() {
  return (
    <html lang="en" dir="ltr">
      <body className="min-h-svh">
        <main className="flex min-h-svh flex-col justify-center gap-6 px-gutter py-section">
          <h1 className="type-display text-balance">{messages.NotFound.title}</h1>
          <p className="max-w-[40ch] type-lead">{messages.NotFound.body}</p>
          <Link href="/" className="type-body underline underline-offset-8">
            {messages.NotFound.home}
          </Link>
        </main>
      </body>
    </html>
  );
}
