"use client";

import Image from "next/image";
import { type MouseEvent, useEffect, useId, useRef, useState } from "react";

import { useScrollLock } from "@/components/motion/smooth-scroll";
import { Button } from "@/components/ui/button";
import { ArrowIcon, CloseIcon } from "@/components/ui/icons";
import { type ImageAsset } from "@/types/localized";

type CertificateCardProps = {
  name: string;
  issuer: string;
  issuedLabel?: string;
  image: ImageAsset;
  alt: string;
  openLabel: string;
  viewLabel: string;
  closeLabel: string;
};

/**
 * The front is the summary; opening it shows the full certificate in a native modal dialog,
 * which traps focus, closes on Esc and hands focus back to the card that opened it.
 */
export function CertificateCard({
  name,
  issuer,
  issuedLabel,
  image,
  alt,
  openLabel,
  viewLabel,
  closeLabel,
}: CertificateCardProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);
  const titleId = useId();
  useScrollLock(open);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const onClose = () => setOpen(false);
    dialog.addEventListener("close", onClose);
    return () => dialog.removeEventListener("close", onClose);
  }, []);

  function show() {
    dialogRef.current?.showModal();
    setOpen(true);
  }

  function close() {
    dialogRef.current?.close();
  }

  // A click on the dark surround (not the certificate or its controls) closes it.
  function closeOnBackdrop(event: MouseEvent<HTMLElement>) {
    if (event.target === event.currentTarget) close();
  }

  return (
    <article aria-labelledby={titleId} className="card-lift flex w-full flex-col bg-surface">
      <button
        type="button"
        onClick={show}
        aria-label={openLabel}
        aria-haspopup="dialog"
        className="group block aspect-[4/3] overflow-clip bg-surface-strong p-5"
      >
        <Image
          src={image.src}
          width={image.width}
          height={image.height}
          alt=""
          sizes="(min-width: 1024px) 30vw, (min-width: 768px) 45vw, 90vw"
          className="image-outline h-full w-full object-contain transition-[scale] duration-(--duration-medium) ease-expo-out group-hover:scale-[1.03] motion-reduce:transition-none"
        />
      </button>
      <div className="flex flex-1 flex-col gap-2 p-6">
        <h3 id={titleId} className="type-lead font-semibold">
          {name}
        </h3>
        <p className="type-small text-muted">
          {issuer}
          {issuedLabel ? ` · ${issuedLabel}` : null}
        </p>
        <Button
          variant="ghost"
          onClick={show}
          aria-haspopup="dialog"
          className="-ms-5 mt-auto self-start"
        >
          {viewLabel}
          <ArrowIcon />
        </Button>
      </div>

      <dialog
        ref={dialogRef}
        aria-labelledby={`${titleId}-dialog`}
        data-lenis-prevent
        className="lightbox-dialog m-0 h-dvh max-h-none w-full max-w-none bg-transparent p-0 text-ink"
      >
        <div
          onClick={closeOnBackdrop}
          className="flex h-full w-full flex-col items-center justify-center gap-4 p-4 md:p-10"
        >
          <div className="flex w-full max-w-5xl items-center justify-between gap-6">
            <p id={`${titleId}-dialog`} className="type-body font-semibold">
              {name}
            </p>
            <Button variant="secondary" onClick={close} aria-label={closeLabel} className="px-3">
              <CloseIcon />
            </Button>
          </div>
          <Image
            src={image.src}
            width={image.width}
            height={image.height}
            alt={alt}
            sizes="(min-width: 1024px) 64rem, 95vw"
            className="h-auto max-h-[80svh] w-auto max-w-full object-contain"
          />
        </div>
      </dialog>
    </article>
  );
}
