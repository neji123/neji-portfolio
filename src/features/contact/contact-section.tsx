import { getTranslations } from "next-intl/server";

import { Magnetic } from "@/components/motion/magnetic";
import { Reveal } from "@/components/motion/reveal";
import { GLOBE_AVOID_ATTRIBUTE } from "@/components/three/globe-scenes";
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
  // The globe's Kuwait City label steps aside from the contact actions.
  const avoid = { [GLOBE_AVOID_ATTRIBUTE]: "" };

  return (
    <Section id="contact" labelledBy="contact-heading" scene="contact" className="pb-0">
      <div className="veil flex flex-col gap-12 md:gap-16 lg:max-w-[58%]">
        <SectionHeading id="contact-heading" size="head" className="max-w-[28ch]">
          {t("closing")}
        </SectionHeading>
        <Reveal className="flex flex-col items-start gap-10">
          {/* The contact action owns the accent. The address stays left to right in Arabic. */}
          <Magnetic>
            <a
              {...avoid}
              href={`mailto:${contact.email}`}
              aria-label={`${t("email")}: ${contact.email}`}
              className="inline-flex min-h-11 items-center type-lead font-semibold break-all text-accent md:type-head"
            >
              {/* The line draws in from the address's own start: it is always left to right. */}
              <span dir="ltr" className="link-line [--line-weight:3px]">
                {contact.email}
              </span>
            </a>
          </Magnetic>
          <div {...avoid} className="flex w-fit flex-wrap gap-3">
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
