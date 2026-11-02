import { getTranslations } from "next-intl/server";

import { Magnetic } from "@/components/motion/magnetic";
import { Reveal } from "@/components/motion/reveal";
import { GLOBE_AVOID_ATTRIBUTE } from "@/components/three/globe-scenes";
import { ButtonLink } from "@/components/ui/button";
import { DownloadIcon, ExternalIcon } from "@/components/ui/icons";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { contact } from "@/content/contact";
import { profile } from "@/content/profile";
import { site } from "@/content/site";
import { type Locale } from "@/i18n/locales";

import { ContactForm } from "./contact-form";
import { QrDownload } from "./qr-download";
import { ShareSite } from "./share-site";
import { SiteQrCode } from "./site-qr-code";
import { WhatsAppChat } from "./whatsapp-chat";

const QR_SVG_ID = "contact-qr";

type ContactSectionProps = {
  locale: Locale;
};

export async function ContactSection({ locale }: ContactSectionProps) {
  const t = await getTranslations({ locale, namespace: "Contact" });
  // The globe's Kuwait City label steps aside from the contact actions.
  const avoid = { [GLOBE_AVOID_ATTRIBUTE]: "" };
  const person = profile[locale];
  // Only NEXT_PUBLIC_SITE_URL changes at deploy: the QR code and the share link follow it.
  const pageUrl = `${site.url}/${locale}`;

  return (
    <Section id="contact" labelledBy="contact-heading" scene="contact" className="pb-0">
      {/* The invitation and the direct ways in at the start; the letter at the end. */}
      <div className="grid gap-16 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:gap-20 xl:gap-28">
        <div className="veil @container flex flex-col gap-12 md:gap-16">
          <SectionHeading id="contact-heading" size="head" className="*:type-head-fit">
            {t("closing")}
          </SectionHeading>
          <Reveal className="flex flex-col items-start gap-10">
            {/*
             * The contact action owns the accent. The address stays left to right in Arabic and
             * on one line: its size follows the column's width (container units), not the viewport.
             */}
            <div className="@container w-full">
              <Magnetic>
                <a
                  {...avoid}
                  href={`mailto:${contact.email}`}
                  aria-label={`${t("email")}: ${contact.email}`}
                  className="inline-flex min-h-11 items-center text-[clamp(0.9375rem,5.6cqi,2.25rem)] leading-tight font-semibold whitespace-nowrap text-accent"
                >
                  {/* The line draws in from the address's own start: it is always left to right. */}
                  <span dir="ltr" data-contact-email className="link-line [--line-weight:3px]">
                    {contact.email}
                  </span>
                </a>
              </Magnetic>
            </div>
            <WhatsAppChat label={t("whatsapp.label")} message={t("whatsapp.message")} />
            <div {...avoid} className="flex w-fit flex-wrap gap-3">
              <ButtonLink
                href={contact.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                size="lg"
              >
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
            {/* Desktop: a QR code to carry the site to a phone. On a phone: share it instead. */}
            <div className="hidden items-center gap-6 md:flex">
              <SiteQrCode
                url={pageUrl}
                id={QR_SVG_ID}
                label={t("qr.label", { url: pageUrl })}
                className="size-32 shrink-0"
              />
              <div className="flex flex-col items-start gap-3">
                <p className="max-w-[24ch] type-small text-muted">{t("qr.caption")}</p>
                <QrDownload
                  svgId={QR_SVG_ID}
                  fileName={`qr-mohamed-neji-benzarti-${locale}`}
                  labels={{ svg: t("qr.downloadSvg"), png: t("qr.downloadPng") }}
                />
              </div>
            </div>
            <div className="md:hidden">
              <ShareSite
                url={pageUrl}
                title={`${person.name} · ${person.title}`}
                labels={{
                  share: t("qr.share"),
                  copied: t("qr.copied"),
                  copyFailed: t("qr.copyFailed"),
                }}
              />
            </div>
          </Reveal>
        </div>
        <Reveal className="lg:pt-2">
          <ContactForm recipient={person.name} />
        </Reveal>
      </div>
    </Section>
  );
}
