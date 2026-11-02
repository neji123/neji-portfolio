"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { ShareIcon } from "@/components/ui/icons";
import { DURATION } from "@/lib/motion";

const MS_PER_SECOND = 1000;
/** How long the "Link copied" note stays, in milliseconds (the pulse length: time to read it). */
const NOTE_MS = DURATION.pulse * MS_PER_SECOND;

type ShareSiteProps = {
  url: string;
  title: string;
  labels: { share: string; copied: string; copyFailed: string };
};

type Note = "copied" | "copyFailed" | null;

/**
 * On a phone the QR code is pointless (the visitor is already there): the system share sheet
 * instead, or copying the link where there is none.
 */
export function ShareSite({ url, title, labels }: ShareSiteProps) {
  const [note, setNote] = useState<Note>(null);

  useEffect(() => {
    if (!note) return;
    const timer = window.setTimeout(() => setNote(null), NOTE_MS);
    return () => window.clearTimeout(timer);
  }, [note]);

  async function share() {
    if (typeof navigator.share === "function") {
      try {
        await navigator.share({ title, url });
        return;
      } catch (error) {
        // Closing the share sheet is a choice, not a failure.
        if (error instanceof DOMException && error.name === "AbortError") return;
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      setNote("copied");
    } catch {
      setNote("copyFailed");
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-4">
      <Button size="lg" onClick={share}>
        <ShareIcon />
        {labels.share}
      </Button>
      <p role="status" aria-live="polite" className="type-small">
        {note ? (
          <span
            key={note}
            className="state-swap inline-flex min-h-8 items-center rounded-full bg-ink px-3 text-ground"
          >
            {labels[note]}
          </span>
        ) : null}
      </p>
    </div>
  );
}
