import { useTranslations } from "next-intl";

import { buttonVariants } from "@/components/ui/button";
import { ArrowIcon } from "@/components/ui/icons";
import { Link } from "@/i18n/navigation";

export default function LocaleNotFound() {
  const t = useTranslations("NotFound");

  return (
    <main
      id="main"
      className="flex min-h-[70svh] flex-col justify-center gap-6 px-gutter py-section"
    >
      <h1 className="type-display text-balance">{t("title")}</h1>
      <p className="max-w-[40ch] type-lead">{t("body")}</p>
      <div>
        <Link href="/" className={buttonVariants({ variant: "primary", size: "lg" })}>
          {t("home")}
          <ArrowIcon />
        </Link>
      </div>
    </main>
  );
}
