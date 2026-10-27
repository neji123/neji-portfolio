import { type Metadata } from "next";
import { notFound } from "next/navigation";

import { boardLocales, directionCopy, directionIds, moodboardUi } from "@/content/moodboard";
import { DeparturesBoard } from "@/features/moodboard/departures-board";
import { isBoardLocale, isDirectionId } from "@/features/moodboard/guards";
import { NightRouteBoard } from "@/features/moodboard/night-route-board";

export function generateStaticParams() {
  return directionIds.flatMap((direction) => boardLocales.map((lang) => ({ direction, lang })));
}

export async function generateMetadata({
  params,
}: PageProps<"/moodboard/[direction]/[lang]">): Promise<Metadata> {
  const { direction, lang } = await params;
  if (!isDirectionId(direction) || !isBoardLocale(lang)) return {};
  return { title: `${directionCopy[direction][lang].name} · ${moodboardUi[lang].boardLabel}` };
}

export default async function MoodboardBoardPage({
  params,
}: PageProps<"/moodboard/[direction]/[lang]">) {
  const { direction, lang } = await params;
  if (!isDirectionId(direction) || !isBoardLocale(lang)) notFound();

  return direction === "night-route" ? (
    <NightRouteBoard locale={lang} />
  ) : (
    <DeparturesBoard locale={lang} />
  );
}
