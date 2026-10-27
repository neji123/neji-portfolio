import { type Project } from "@/types/project";

export const projects: readonly Project[] = [
  {
    id: "mustawfi",
    name: "Mustawfi",
    description: {
      en: "Bilingual (AR/EN) SaaS platform for digital audits, checklists, reporting and online payment, with multi-role access and live dashboards.",
      fr: "Plateforme SaaS bilingue (AR/EN) d'audits numériques, de checklists, de reporting et de paiement en ligne, avec accès multi-rôles et tableaux de bord en temps réel.",
      ar: "منصة SaaS ثنائية اللغة (عربي/إنجليزي) للتدقيق الرقمي وقوائم التحقق والتقارير والدفع الإلكتروني، مع صلاحيات متعددة الأدوار ولوحات بيانات مباشرة.",
    },
    stack: ["Next.js", "Express", "MongoDB", "Docker"],
    link: { kind: "live", url: "https://www.mustawfi.com" },
    image: { src: "/images/projects/mustawfi.webp", width: 1440, height: 900 },
    featured: true,
  },
  {
    id: "takween",
    name: "Takween",
    description: {
      en: "Corporate website for an HSSE training and compliance provider in Kuwait.",
      fr: "Site corporate d'un organisme de formation et de conformité HSSE au Koweït.",
      ar: "موقع مؤسسي لمزوّد تدريب وامتثال في مجال الصحة والسلامة والأمن والبيئة (HSSE) في الكويت.",
    },
    stack: ["React.js"],
    link: { kind: "live", url: "https://www.takween.com.kw" },
    image: { src: "/images/projects/takween.webp", width: 1440, height: 900 },
    featured: false,
  },
  {
    id: "plage-discount",
    name: "Plage Discount",
    description: {
      en: "E-commerce platform for artisanal products: catalog, cart, orders and an admin back-office.",
      fr: "Plateforme e-commerce de produits artisanaux : catalogue, panier, commandes et back-office d'administration.",
      ar: "منصة تجارة إلكترونية للمنتجات الحرفية: كتالوج وسلة مشتريات وإدارة طلبات ولوحة تحكم إدارية.",
    },
    stack: ["Angular", "Django", "Docker", "Hetzner"],
    link: { kind: "live", url: "https://plagediscount.com" },
    image: { src: "/images/projects/plagediscount.webp", width: 1440, height: 900 },
    featured: false,
  },
  {
    id: "smart-parking",
    name: {
      en: "Smart Parking Platform",
      fr: "Plateforme de stationnement intelligent",
      ar: "منصة المواقف الذكية",
    },
    description: {
      en: "Parking management with real-time availability and a client reporting portal.",
      fr: "Gestion de parkings avec disponibilité en temps réel et portail de reporting client.",
      ar: "إدارة مواقف السيارات مع عرض التوفّر في الوقت الفعلي وبوابة تقارير للعملاء.",
    },
    stack: ["Django", "Angular", "PostgreSQL"],
    link: { kind: "private" },
    featured: false,
  },
  {
    id: "ey-intern-management",
    name: {
      en: "Intern Management (EY)",
      fr: "Gestion des stagiaires (EY)",
      ar: "إدارة المتدرّبين (EY)",
    },
    description: {
      en: "Enterprise app with AI-based intern and mentor matching and real-time notifications.",
      fr: "Application d'entreprise avec mise en relation stagiaires–mentors par IA et notifications en temps réel.",
      ar: "تطبيق مؤسسي يطابق بين المتدرّبين والمرشدين بالذكاء الاصطناعي مع إشعارات فورية.",
    },
    stack: [".NET Core", "Angular", "SignalR"],
    link: { kind: "private" },
    featured: false,
  },
  {
    id: "devops-microservices",
    name: {
      en: "DevOps & Microservices",
      fr: "DevOps et microservices",
      ar: "DevOps والخدمات المصغّرة",
    },
    description: {
      en: "CI/CD pipeline with monitoring and SSO.",
      fr: "Pipeline CI/CD avec supervision et SSO.",
      ar: "خط CI/CD مع المراقبة وتسجيل الدخول الموحّد (SSO).",
    },
    stack: ["Jenkins", "Docker", "Kubernetes", "SonarQube", "Prometheus", "Grafana", "Keycloak"],
    link: { kind: "private" },
    featured: false,
  },
];
