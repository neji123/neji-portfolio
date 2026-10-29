"use client";

import { useEffect, useSyncExternalStore } from "react";

import { type SectionId } from "@/content/site";
import { ScrollTrigger, useGSAP } from "@/lib/gsap";

/** The line of the viewport (from the top) a section must cross to become the one being read. */
const READING_LINE = 0.4;

let active: SectionId | null = null;
const listeners = new Set<() => void>();

function setActive(next: SectionId | null) {
  if (next === active) return;
  active = next;
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** Top of an element in the document, ignoring transforms (sections enter with a 3D tilt). */
function documentTop(element: HTMLElement): number {
  let top = 0;
  let node: Element | null = element;
  while (node instanceof HTMLElement) {
    top += node.offsetTop;
    node = node.offsetParent;
  }
  return top;
}

/** The menu section being read, or null above the first one. Shared by the header and the mobile menu. */
export function useActiveSection(): SectionId | null {
  return useSyncExternalStore(
    subscribe,
    () => active,
    () => null,
  );
}

/**
 * The menu item to underline: the last menu section whose top has crossed the reading line.
 * Sections outside the menu (Education, Languages) keep the previous item; the hero, above
 * the first one, has none; at the very bottom the last item wins even if it is short. Driven by ScrollTrigger, which Lenis updates.
 */
export function useScrollSpy(ids: readonly SectionId[]) {
  useGSAP(
    () => {
      const sections = ids.flatMap((id) => {
        const element = document.getElementById(id);
        return element ? [{ id, element }] : [];
      });
      let tops: number[] = [];
      const update = () => {
        const line = window.scrollY + window.innerHeight * READING_LINE;
        let current: SectionId | null = null;
        sections.forEach(({ id }, i) => {
          if ((tops[i] ?? Infinity) <= line) current = id;
        });
        const atBottom =
          window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2;
        if (atBottom) current = sections.at(-1)?.id ?? current;
        setActive(current);
      };
      ScrollTrigger.create({
        start: 0,
        end: "max",
        onRefresh: () => {
          tops = sections.map(({ element }) => documentTop(element));
          update();
        },
        onUpdate: update,
      });
    },
    { dependencies: [ids] },
  );
  // A new page (another locale) starts from what is on screen, not the last page's section.
  useEffect(() => () => setActive(null), []);
}

/** Mounted once by the page: keeps the active section in step with the scroll. */
export function ScrollSpy({ ids }: { ids: readonly SectionId[] }) {
  useScrollSpy(ids);
  return null;
}
