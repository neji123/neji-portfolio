import { getTranslations } from "next-intl/server";

import { ButtonLink } from "@/components/ui/button";
import { contact } from "@/content/contact";
import { profile } from "@/content/profile";
import { sectionIds } from "@/content/site";
import { type Locale } from "@/i18n/locales";

import { LanguageSwitcher } from "./language-switcher";
import { MobileMenu, type NavItem } from "./mobile-menu";

type HeaderProps = {
  locale: Locale;
};

/** A plain bar: wordmark, the section links, the language switcher, one action. */
export async function Header({ locale }: HeaderProps) {
  const tNav = await getTranslations({ locale, namespace: "Nav" });
  const tHeader = await getTranslations({ locale, namespace: "Header" });
  const name = profile[locale].name;
  const items: NavItem[] = sectionIds.map((id) => ({ href: `#${id}`, label: tNav(id) }));

  return (
    <header className="sticky top-0 z-40 bg-ground/80 backdrop-blur-md">
      <div className="flex h-header items-center justify-between gap-6 px-gutter">
        <a
          href="#top"
          aria-label={tHeader("homeLabel", { name })}
          className="inline-flex min-h-11 items-center type-small font-semibold"
        >
          {name}
        </a>
        <nav aria-label={tHeader("primaryNav")} className="hidden lg:block">
          <ul className="flex gap-7">
            {items.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="inline-flex min-h-11 items-center type-small decoration-route decoration-2 underline-offset-8 hover:underline"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex items-center gap-2">
          <LanguageSwitcher className="hidden lg:block" />
          <ButtonLink href={contact.cv} download className="hidden sm:inline-flex">
            {tNav("downloadCv")}
          </ButtonLink>
          <MobileMenu
            items={items}
            menuLabel={tHeader("primaryNav")}
            openLabel={tHeader("openMenu")}
            closeLabel={tHeader("closeMenu")}
            cvHref={contact.cv}
            cvLabel={tNav("downloadCv")}
          />
        </div>
      </div>
    </header>
  );
}
