import { type Education, type SpokenLanguage } from "@/types/education";

export const education: readonly Education[] = [
  {
    id: "esprit",
    degree: {
      en: "Engineering Degree in Computer Science",
      fr: "Diplôme d'ingénieur en informatique",
      ar: "شهادة مهندس في علوم الحاسوب",
    },
    school: "ESPRIT",
    location: { en: "Tunis", fr: "Tunis", ar: "تونس" },
    period: { start: "2020", end: "2025" },
  },
  {
    id: "optimus",
    degree: {
      en: "Professional Training in Artificial Intelligence",
      fr: "Formation professionnelle en intelligence artificielle",
      ar: "تدريب مهني في الذكاء الاصطناعي",
    },
    school: "Optimus Training",
    note: {
      en: "State-approved (ANETI)",
      fr: "Agréée par l'État (ANETI)",
      ar: "معتمد من الدولة (ANETI)",
    },
    location: { en: "Tunisia", fr: "Tunisie", ar: "تونس" },
    period: { start: "2026-01", end: "2026-06" },
  },
];

export const spokenLanguages: readonly SpokenLanguage[] = [
  {
    id: "arabic",
    label: { en: "Arabic (Native)", fr: "Arabe (langue maternelle)", ar: "العربية (اللغة الأم)" },
  },
  {
    id: "english",
    label: {
      en: "English (Professional)",
      fr: "Anglais (professionnel)",
      ar: "الإنجليزية (مستوى مهني)",
    },
  },
  {
    id: "french",
    label: { en: "French (B2)", fr: "Français (B2)", ar: "الفرنسية (B2)" },
  },
];
