import { type Localized } from "@/types/localized";

export type SectionId =
  "about" | "experience" | "projects" | "skills" | "certifications" | "contact";

export const site = {
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
} as const;

/** Page sections in reading order; the nav and the page both follow it. */
export const sectionIds: readonly SectionId[] = [
  "about",
  "experience",
  "projects",
  "skills",
  "certifications",
  "contact",
];

export const siteDescription: Localized<string> = {
  en: "Software engineer based in Kuwait. Modern, scalable web applications built end to end, with experience across Kuwait, France, Canada and Tunisia, including EY.",
  fr: "Ingénieur logiciel basé au Koweït. Des applications web modernes et évolutives, conçues de bout en bout, avec une expérience au Koweït, en France, au Canada et en Tunisie, notamment chez EY.",
  ar: "مهندس برمجيات مقيم في الكويت. تطبيقات ويب حديثة وقابلة للتوسّع تُبنى من البداية إلى النهاية، مع خبرة في الكويت وفرنسا وكندا وتونس، من بينها EY.",
};
