import { contact } from "@/content/contact";
import { education } from "@/content/education";
import { profile } from "@/content/profile";
import { site } from "@/content/site";
import { type Locale, localeMeta, locales } from "@/i18n/locales";

/** schema.org Person for the current locale. No address, birth date or ID, by design. */
export function personJsonLd(locale: Locale) {
  const person = profile[locale];
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: person.name,
    jobTitle: person.title,
    description: person.tagline,
    url: `${site.url}/${locale}`,
    image: `${site.url}/images/profile.jpg`,
    email: `mailto:${contact.email}`,
    sameAs: [contact.linkedin, contact.github],
    worksFor: { "@type": "Organization", name: "Takween" },
    alumniOf: education.map((item) => ({ "@type": "EducationalOrganization", name: item.school })),
    knowsLanguage: locales.map((code) => localeMeta[code].intl.slice(0, 2)),
  };
}

/** Serialises JSON-LD safely for an inline script (no closing-tag injection). */
export function serializeJsonLd(data: object): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
