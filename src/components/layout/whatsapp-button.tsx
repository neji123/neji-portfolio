"use client";

import { useEffect, useRef, useState } from "react";

import { WhatsAppIcon } from "@/components/ui/icons";

/** Marks the controls the floating WhatsApp button must never cover (the form's send button). */
export const FAB_AVOID_ATTRIBUTE = "data-fab-avoid";
/** Breathing room kept between the button and an avoided control, in pixels. */
const AVOID_MARGIN = 12;

type WhatsAppButtonProps = {
  href: string;
  /** "Chat on WhatsApp": the accessible name and the tooltip. */
  label: string;
};

function overlaps(a: DOMRect, b: DOMRect, margin: number): boolean {
  return (
    a.left - margin < b.right &&
    a.right + margin > b.left &&
    a.top - margin < b.bottom &&
    a.bottom + margin > b.top
  );
}

/**
 * Floating chat button, bottom right in every language. It steps away while it would cover a
 * control marked `data-fab-avoid`, and (CSS) while a modal dialog is open.
 */
export function WhatsAppButton({ href, label }: WhatsAppButtonProps) {
  // The fixed anchor never moves, so its box is where the button sits even while hidden.
  const anchorRef = useRef<HTMLDivElement>(null);
  const [covering, setCovering] = useState(false);

  useEffect(() => {
    const anchor = anchorRef.current;
    if (!anchor) return;
    let frame = 0;
    const check = () => {
      frame = 0;
      const box = anchor.getBoundingClientRect();
      const avoided = document.querySelectorAll(`[${FAB_AVOID_ATTRIBUTE}]`);
      setCovering(
        Array.from(avoided).some((element) =>
          overlaps(box, element.getBoundingClientRect(), AVOID_MARGIN),
        ),
      );
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(check);
    };
    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);

  return (
    <div ref={anchorRef} className="whatsapp-fab" data-covering={covering ? "" : undefined}>
      <span aria-hidden="true" className="whatsapp-tooltip">
        {label}
      </span>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={label}
        className="whatsapp-button"
      >
        <WhatsAppIcon className="size-7" />
      </a>
    </div>
  );
}
