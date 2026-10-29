"use client";

import { useLenis } from "lenis/react";
import { type CSSProperties, type MouseEvent, useEffect, useId, useRef, useState } from "react";

import { HEADER_OFFSET, useScrollLock } from "@/components/motion/smooth-scroll";
import { Button, ButtonLink } from "@/components/ui/button";
import { CloseIcon, DownloadIcon, MenuIcon } from "@/components/ui/icons";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/cn";

import { useActiveSection } from "./active-section";
import { LanguageSwitcher } from "./language-switcher";

export type NavItem = {
  href: `#${string}`;
  label: string;
};

type MobileMenuProps = {
  items: readonly NavItem[];
  menuLabel: string;
  openLabel: string;
  closeLabel: string;
  cvHref: string;
  cvLabel: string;
};

/** A native modal dialog: the browser traps focus, closes on Esc and makes the page inert. */
export function MobileMenu({
  items,
  menuLabel,
  openLabel,
  closeLabel,
  cvHref,
  cvLabel,
}: MobileMenuProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);
  const dialogId = useId();
  const lenis = useLenis();
  const reducedMotion = useReducedMotion();
  const active = useActiveSection();
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

  function goTo(event: MouseEvent<HTMLAnchorElement>, href: NavItem["href"]) {
    event.preventDefault();
    close();
    // Scroll once the lock is released on the next frame.
    requestAnimationFrame(() => {
      lenis?.start();
      lenis?.scrollTo(href, { offset: HEADER_OFFSET, immediate: reducedMotion });
      history.replaceState(null, "", href);
    });
  }

  return (
    <>
      <Button
        variant="ghost"
        className="px-3 lg:hidden"
        aria-label={openLabel}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={dialogId}
        onClick={show}
      >
        <MenuIcon />
      </Button>
      <dialog
        ref={dialogRef}
        id={dialogId}
        aria-label={menuLabel}
        data-lenis-prevent
        className="menu-dialog m-0 h-dvh max-h-none w-full max-w-none bg-ground p-0 text-ink"
      >
        <div className="flex h-full flex-col gap-10 overflow-y-auto px-gutter pb-10">
          <div className="flex h-header items-center justify-end">
            <Button variant="ghost" className="px-3" aria-label={closeLabel} onClick={close}>
              <CloseIcon />
            </Button>
          </div>
          <nav aria-label={menuLabel}>
            <ul className="flex flex-col gap-2">
              {items.map((item, index) => {
                const current = item.href === `#${active}`;
                return (
                  <li
                    key={item.href}
                    className="menu-item"
                    style={{ "--menu-index": index } as CSSProperties}
                  >
                    {/* The section on screen: accent ink and the route's marker before it. */}
                    <a
                      href={item.href}
                      aria-current={current ? "location" : undefined}
                      onClick={(event) => goTo(event, item.href)}
                      className={cn(
                        "inline-flex min-h-11 items-center gap-3 py-1 type-head transition-colors duration-(--duration-fast) ease-(--ease-smooth-out)",
                        current ? "text-accent" : "text-ink",
                      )}
                    >
                      <span
                        aria-hidden="true"
                        className={cn(
                          "size-2.5 shrink-0 rounded-full bg-accent transition-[opacity,scale] duration-(--duration-fast) ease-(--ease-smooth-out)",
                          current ? "opacity-100" : "scale-50 opacity-0",
                        )}
                      />
                      {item.label}
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>
          <div className="mt-auto flex flex-col items-start gap-6">
            <LanguageSwitcher onNavigate={close} />
            <ButtonLink href={cvHref} download variant="primary" size="lg">
              <DownloadIcon />
              {cvLabel}
            </ButtonLink>
          </div>
        </div>
      </dialog>
    </>
  );
}
