import { type Experience } from "@/types/experience";

// Most recent first, as the timeline reads.
export const experiences: readonly Experience[] = [
  {
    id: "takween",
    company: "Takween",
    role: {
      en: "Full Stack Developer",
      fr: "Développeur Full Stack",
      ar: "مطوّر ويب متكامل",
    },
    location: {
      en: "Kuwait City, Kuwait",
      fr: "Koweït City, Koweït",
      ar: "مدينة الكويت، الكويت",
    },
    period: { start: "2026-06", end: null },
    summary: {
      en: "Corporate website for an HSSE training provider, and Mustawfi, a bilingual SaaS audit platform.",
      fr: "Site corporate d'un organisme de formation HSSE, et Mustawfi, une plateforme SaaS d'audit bilingue.",
      ar: "موقع مؤسسي لمزوّد تدريب في مجال الصحة والسلامة والأمن والبيئة (HSSE)، وMustawfi، منصة SaaS ثنائية اللغة للتدقيق الرقمي.",
    },
    stack: ["React.js", "Next.js", "Express", "MongoDB", "Docker"],
    stop: "kuwait-city",
  },
  {
    id: "itec-etudes",
    company: "ITEC Études",
    role: {
      en: "Full Stack Developer (6-month mission)",
      fr: "Développeur Full Stack (mission de 6 mois)",
      ar: "مطوّر ويب متكامل (مهمة لمدة 6 أشهر)",
    },
    location: {
      en: "France (Remote)",
      fr: "France (à distance)",
      ar: "فرنسا (عن بُعد)",
    },
    period: { start: "2025-11", end: "2026-04" },
    summary: {
      en: "Parking management web platform.",
      fr: "Plateforme web de gestion de parkings.",
      ar: "منصة ويب لإدارة مواقف السيارات.",
    },
    stack: ["Django", "Angular", "PostgreSQL"],
    stop: "france",
  },
  {
    id: "freelance",
    company: { en: "Freelance", fr: "Freelance", ar: "عمل حر" },
    role: {
      en: "Full Stack Developer",
      fr: "Développeur Full Stack",
      ar: "مطوّر ويب متكامل",
    },
    location: {
      en: "Remote",
      fr: "À distance",
      ar: "عن بُعد",
    },
    period: { start: "2026", end: "2026" },
    summary: {
      en: "E-commerce platform for a French artisanal products company.",
      fr: "Plateforme e-commerce pour une entreprise française de produits artisanaux.",
      ar: "منصة تجارة إلكترونية لشركة فرنسية متخصصة في المنتجات الحرفية.",
    },
    stack: ["Angular", "Django", "Docker", "Hetzner"],
    stop: "france",
  },
  {
    id: "ey",
    company: "EY (Ernst & Young)",
    role: {
      en: "Full Stack Developer Intern",
      fr: "Stagiaire développeur Full Stack",
      ar: "متدرّب مطوّر ويب متكامل",
    },
    location: {
      en: "Tunis, Tunisia",
      fr: "Tunis, Tunisie",
      ar: "تونس، تونس",
    },
    period: { start: "2025-02", end: "2025-08" },
    summary: {
      en: "Intern management application with AI recommendations.",
      fr: "Application de gestion des stagiaires avec recommandations par IA.",
      ar: "تطبيق لإدارة المتدرّبين مع توصيات قائمة على الذكاء الاصطناعي.",
    },
    stack: [".NET Core", "Angular", "SignalR"],
    stop: "tunis",
  },
  {
    id: "ipact",
    company: "IPACT Consult Inc.",
    role: {
      en: "Full Stack Developer Intern",
      fr: "Stagiaire développeur Full Stack",
      ar: "متدرّب مطوّر ويب متكامل",
    },
    location: {
      en: "Montréal, Canada (Remote)",
      fr: "Montréal, Canada (à distance)",
      ar: "مونتريال، كندا (عن بُعد)",
    },
    period: { start: "2024-06", end: "2024-08" },
    summary: {
      en: "Agile management platform built with TDD.",
      fr: "Plateforme de gestion agile développée en TDD.",
      ar: "منصة لإدارة المشاريع بمنهجية Agile، مطوّرة وفق منهج التطوير الموجّه بالاختبارات (TDD).",
    },
    stack: ["Spring Boot", "Angular", "JUnit"],
    stop: "montreal",
  },
];
