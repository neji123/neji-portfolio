"use client";

import { useLocale, useTranslations } from "next-intl";
import { type MouseEvent } from "react";

import { type Locale, localeMeta, locales } from "@/i18n/locales";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { cn } from "@/lib/cn";

import { localeFlags } from "./locale-flags";

type LanguageSwitcherProps = {
  className?: string;
  /** Called before navigating, e.g. so the mobile menu can close. */
  onNavigate?: () => void;
};

/** Real links (they work without JS); with JS the switch keeps the section the visitor is reading. */
export function LanguageSwitcher({ className, onNavigate }: LanguageSwitcherProps) {
  const t = useTranslations("LanguageSwitcher");
  const currentLocale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  function handleClick(event: MouseEvent<HTMLAnchorElement>, target: Locale) {
    event.preventDefault();
    if (target === currentLocale) return;
    onNavigate?.();
    router.replace(`${pathname}${window.location.hash}`, { locale: target, scroll: false });
  }

  return (
    <nav aria-label={t("label")} className={className}>
      <ul className="flex gap-1">
        {locales.map((code) => {
          const Flag = localeFlags[code];
          const meta = localeMeta[code];
          const isCurrent = code === currentLocale;
          return (
            <li key={code}>
              <Link
                href={pathname}
                locale={code}
                hrefLang={code}
                lang={code}
                aria-label={meta.nativeName}
                aria-current={isCurrent ? "true" : undefined}
                onClick={(event) => handleClick(event, code)}
                className={cn(
                  "inline-flex min-h-11 items-center gap-2 rounded-full px-3 type-small font-medium",
                  "transition-colors duration-(--duration-quick) ease-smooth-out",
                  isCurrent ? "bg-ink text-ground" : "hover:bg-surface",
                )}
              >
                <Flag className="h-3.5 w-auto rounded-[2px]" />
                <span>{meta.code}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
