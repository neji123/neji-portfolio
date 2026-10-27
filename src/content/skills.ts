import { type SkillGroup } from "@/types/skill";

export const skillGroups: readonly SkillGroup[] = [
  {
    id: "frontend",
    name: { en: "Frontend", fr: "Frontend", ar: "الواجهة الأمامية" },
    items: [
      "Angular",
      "React.js",
      "Next.js",
      "TypeScript",
      "JavaScript",
      "HTML5",
      "CSS3",
      "Tailwind CSS",
    ],
  },
  {
    id: "backend",
    name: { en: "Backend", fr: "Backend", ar: "الواجهة الخلفية" },
    items: [
      ".NET Core",
      "Node.js",
      "Express.js",
      "Django",
      "Spring Boot",
      { en: "REST APIs", fr: "API REST", ar: "واجهات REST" },
      "SignalR",
    ],
  },
  {
    id: "databases",
    name: { en: "Databases", fr: "Bases de données", ar: "قواعد البيانات" },
    items: ["MongoDB", "PostgreSQL", "MySQL", "SQL Server"],
  },
  {
    id: "devops",
    name: { en: "DevOps & Cloud", fr: "DevOps et cloud", ar: "DevOps والحوسبة السحابية" },
    items: [
      "Docker",
      "Kubernetes",
      "Jenkins",
      "CI/CD",
      "Nginx",
      "Hetzner",
      "Linux",
      "Prometheus",
      "Grafana",
    ],
  },
  {
    id: "ai-data",
    name: { en: "AI & Data", fr: "IA et données", ar: "الذكاء الاصطناعي والبيانات" },
    items: [
      { en: "Machine Learning", fr: "Machine learning", ar: "تعلّم الآلة" },
      { en: "Recommendation systems", fr: "Systèmes de recommandation", ar: "أنظمة التوصية" },
      { en: "Data Science", fr: "Data science", ar: "علم البيانات" },
    ],
  },
  {
    id: "tools",
    name: { en: "Tools", fr: "Outils", ar: "الأدوات" },
    items: ["Git", "GitHub", "Jira", "Figma", "JUnit", "TDD"],
  },
];
