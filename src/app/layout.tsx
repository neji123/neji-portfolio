import { type ReactNode } from "react";

// The real root is app/[locale]/layout.tsx, which owns <html lang dir>. This one only passes through.
export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}
