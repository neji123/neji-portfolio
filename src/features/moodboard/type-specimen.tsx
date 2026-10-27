type TypeSpecimenProps = {
  lang: "en" | "ar";
  dir: "ltr" | "rtl";
  faceLabel: string;
  display: string;
  text: string;
};

/** One script's voice: display size above, running text below, in that script's own direction. */
export function TypeSpecimen({ lang, dir, faceLabel, display, text }: TypeSpecimenProps) {
  return (
    <figure lang={lang} dir={dir} className="flex flex-col gap-4">
      <p className="mb-step-head">{display}</p>
      <p className="mb-step-body max-w-[60ch]">{text}</p>
      <figcaption className="mb-step-small text-(--mb-muted)">{faceLabel}</figcaption>
    </figure>
  );
}
