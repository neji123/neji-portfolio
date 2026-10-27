import { getTranslations } from "next-intl/server";

import { SplitReveal } from "@/components/motion/split-reveal";
import { Heading } from "@/components/ui/heading";
import { Section } from "@/components/ui/section";
import { type SectionId } from "@/content/site";
import { type Locale } from "@/i18n/locales";

// Phase 2 only: a titled anchor per section so navigation and scroll motion can be tested.
// Phase 3 replaces each one with the real section from its feature folder.
const PAPER_SECTIONS: readonly SectionId[] = ["experience", "skills", "contact"];

type SectionStubProps = {
  id: SectionId;
  locale: Locale;
};

export async function SectionStub({ id, locale }: SectionStubProps) {
  const t = await getTranslations({ locale, namespace: "Sections" });
  const headingId = `${id}-heading`;

  return (
    <Section id={id} labelledBy={headingId} field={PAPER_SECTIONS.includes(id) ? "paper" : "night"}>
      <SplitReveal>
        <Heading level={2} id={headingId} size="display">
          {t(id)}
        </Heading>
      </SplitReveal>
    </Section>
  );
}
