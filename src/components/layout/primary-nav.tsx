"use client";

import { useRef } from "react";

import { useIsomorphicLayoutEffect } from "@/hooks/use-isomorphic-layout-effect";
import { cn } from "@/lib/cn";

import { useActiveSection } from "./active-section";
import { type NavItem } from "./mobile-menu";

/** The indicator is this wide at scale 1; transform scales it to the active link's width. */
const INDICATOR_BASE_WIDTH = 100;

type PrimaryNavProps = {
  items: readonly NavItem[];
  label: string;
  className?: string;
};

/**
 * The header's section links. One shared accent line slides under the link of the section
 * being read (transform only: translate and scaleX, so nothing reflows). Physical offsets
 * work unchanged in RTL. Reduced motion switches without the slide.
 */
export function PrimaryNav({ items, label, className }: PrimaryNavProps) {
  const active = useActiveSection();
  const list = useRef<HTMLUListElement>(null);
  const indicator = useRef<HTMLSpanElement>(null);
  const placed = useRef(false);

  useIsomorphicLayoutEffect(() => {
    const line = indicator.current;
    const container = list.current;
    if (!line || !container) return;
    const place = () => {
      const link = active
        ? container.querySelector<HTMLAnchorElement>(`a[href="#${active}"]`)
        : null;
      if (!link) {
        line.dataset.visible = "false";
        placed.current = false;
        return;
      }
      // The first placement (and every resize) snaps; only a change of section slides.
      const snap = !placed.current;
      if (snap) line.style.transition = "none";
      line.style.transform = `translateX(${link.offsetLeft}px) scaleX(${link.offsetWidth / INDICATOR_BASE_WIDTH})`;
      line.dataset.visible = "true";
      if (snap) {
        void line.offsetWidth;
        line.style.transition = "";
      }
      placed.current = true;
    };
    place();
    const observer = new ResizeObserver(() => {
      placed.current = false;
      place();
    });
    observer.observe(container);
    return () => observer.disconnect();
  }, [active]);

  return (
    <nav aria-label={label} className={className}>
      <ul ref={list} className="relative flex gap-7">
        {items.map((item) => {
          const current = item.href === `#${active}`;
          return (
            <li key={item.href}>
              <a
                href={item.href}
                aria-current={current ? "location" : undefined}
                className={cn(
                  "inline-flex min-h-11 items-center type-small transition-colors duration-(--duration-fast) ease-(--ease-smooth-out)",
                  current ? "text-ink" : "text-muted hover:text-ink",
                )}
              >
                {item.label}
              </a>
            </li>
          );
        })}
        <span
          ref={indicator}
          aria-hidden="true"
          data-visible="false"
          style={{ width: INDICATOR_BASE_WIDTH }}
          className="pointer-events-none absolute bottom-1.5 left-0 h-0.5 origin-left rounded-full bg-accent transition-[transform,opacity] duration-(--duration-medium) ease-(--ease-smooth-out) data-[visible=false]:opacity-0 motion-reduce:transition-none"
        />
      </ul>
    </nav>
  );
}
