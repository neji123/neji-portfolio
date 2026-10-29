import { getTranslations } from "next-intl/server";

import { contact } from "@/content/contact";
import { profile } from "@/content/profile";
import { type Locale } from "@/i18n/locales";

type FooterProps = {
  locale: Locale;
};

/** A designed close: the name returns at full width, then the ways to reach him. */
export async function Footer({ locale }: FooterProps) {
  const t = await getTranslations({ locale, namespace: "Footer" });
  const tContact = await getTranslations({ locale, namespace: "Contact" });
  const name = profile[locale].name;
  const year = new Date().getFullYear();

  const links = [
    { href: `mailto:${contact.email}`, label: tContact("email") },
    { href: contact.linkedin, label: tContact("linkedin"), external: true },
    { href: contact.github, label: tContact("github"), external: true },
    { href: contact.cv, label: tContact("cv"), download: true },
  ];

  return (
    <footer className="relative z-10 px-gutter pt-section pb-10 text-ink">
      <p className="type-display text-balance">{name}</p>
      <div className="mt-16 flex flex-wrap items-end justify-between gap-x-12 gap-y-6">
        <ul className="flex flex-wrap gap-x-8 gap-y-2">
          {links.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                {...(link.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                {...(link.download ? { download: true } : {})}
                className="inline-flex min-h-11 items-center type-body"
              >
                <span className="link-line">{link.label}</span>
              </a>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-8 type-small text-muted">
          <p>{t("copyright", { year, name })}</p>
          <a
            href="#top"
            className="inline-flex min-h-11 items-center transition-colors duration-(--duration-fast) ease-(--ease-smooth-out) hover:text-ink"
          >
            {t("backToTop")}
          </a>
        </div>
      </div>
    </footer>
  );
}
