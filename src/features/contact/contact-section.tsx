import { getTranslations } from "next-intl/server";

import { Magnetic } from "@/components/motion/magnetic";
import { Reveal } from "@/components/motion/reveal";
import { ButtonLink } from "@/components/ui/button";
import { DownloadIcon, ExternalIcon } from "@/components/ui/icons";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { contact } from "@/content/contact";
import { type Locale } from "@/i18n/locales";

type ContactSectionProps = {
  locale: Locale;
};

export async function ContactSection({ locale }: ContactSectionProps) {
  const t = await getTranslations({ locale, namespace: "Contact" });

  return (
    <Section id="contact" labelledBy="contact-heading" className="pb-0">
      <div className="flex flex-col gap-12 md:gap-16">
        <SectionHeading id="contact-heading" size="head" className="max-w-[28ch]">
          {t("closing")}
        </SectionHeading>
        <Reveal className="flex flex-col items-start gap-10">
          {/* The contact action owns the accent. The address stays left to right in Arabic. */}
          <Magnetic>
            <a
              href={`mailto:${contact.email}`}
              aria-label={`${t("email")}: ${contact.email}`}
              className="inline-flex min-h-11 items-center type-lead font-semibold break-all text-accent underline decoration-2 underline-offset-[0.25em] hover:decoration-4 md:type-head"
            >
              <span dir="ltr">{contact.email}</span>
            </a>
          </Magnetic>
          <div className="flex flex-wrap gap-3">
            <ButtonLink href={contact.linkedin} target="_blank" rel="noopener noreferrer" size="lg">
              {t("linkedin")}
              <ExternalIcon />
            </ButtonLink>
            <ButtonLink href={contact.github} target="_blank" rel="noopener noreferrer" size="lg">
              {t("github")}
              <ExternalIcon />
            </ButtonLink>
            <ButtonLink href={contact.cv} download size="lg">
              <DownloadIcon />
              {t("cv")}
            </ButtonLink>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
