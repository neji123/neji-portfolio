import { getTranslations } from "next-intl/server";

import { Reveal } from "@/components/motion/reveal";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { certifications } from "@/content/certifications";
import { type Locale } from "@/i18n/locales";
import { formatMonth } from "@/lib/format-date";
import { localize } from "@/lib/localize";

import { CertificateCard } from "./certificate-card";
import { CredentialCard } from "./credential-card";

type CertificationsSectionProps = {
  locale: Locale;
};

export async function CertificationsSection({ locale }: CertificationsSectionProps) {
  const tSections = await getTranslations({ locale, namespace: "Sections" });
  const t = await getTranslations({ locale, namespace: "Certifications" });

  return (
    <Section id="certifications" labelledBy="certifications-heading" field="paper">
      <div className="flex flex-col gap-16 md:gap-24">
        <SectionHeading id="certifications-heading">{tSections("certifications")}</SectionHeading>
        <Reveal stagger>
          <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {certifications.map((certification) => {
              const name = localize(certification.name, locale);
              const issuedLabel = certification.issued
                ? t("issued", { date: formatMonth(certification.issued, locale) })
                : undefined;
              const { proof } = certification;
              return (
                <li key={certification.id} data-reveal-item className="flex">
                  {proof.kind === "image" ? (
                    <CertificateCard
                      name={name}
                      issuer={certification.issuer}
                      issuedLabel={issuedLabel}
                      image={proof.image}
                      alt={proof.alt[locale]}
                      openLabel={t("openLabel", { name })}
                      viewLabel={t("view")}
                      closeLabel={t("close")}
                    />
                  ) : (
                    <CredentialCard
                      id={certification.id}
                      name={name}
                      issuer={certification.issuer}
                      mark={proof.mark}
                      url={proof.url}
                      linkLabel={t("credential")}
                    />
                  )}
                </li>
              );
            })}
          </ul>
        </Reveal>
      </div>
    </Section>
  );
}
