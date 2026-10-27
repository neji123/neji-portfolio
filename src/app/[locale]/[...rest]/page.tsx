import { notFound } from "next/navigation";

// Any unknown path under a locale renders that locale's translated not-found page.
export default function CatchAllPage() {
  notFound();
}
