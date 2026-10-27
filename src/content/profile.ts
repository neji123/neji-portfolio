import { type Localized } from "@/types/localized";
import { type Profile } from "@/types/profile";

export const profile: Localized<Profile> = {
  en: {
    name: "Mohamed Neji Benzarti",
    title: "Software Engineer, Web Development",
    tagline: "I build modern, scalable web applications that turn ideas into reliable products.",
    location: "Based in Kuwait",
    availability: "Open to opportunities",
    about: [
      "I build modern, scalable web applications that turn ideas into reliable products, from clean user interfaces to solid backend architecture.",
      "Currently based in Kuwait, I've had the opportunity to work with teams and clients across Kuwait, France, Canada and Tunisia, including EY. This international experience taught me to adapt quickly, communicate clearly and deliver with quality.",
      "I'm passionate about clean code, continuous learning and creating digital solutions that make a real impact.",
    ],
    figures: [
      { kind: "count", value: 4, label: "countries" },
      { kind: "count", value: 5, after: "+", label: "production projects" },
      { kind: "text", label: "Engineer, ESPRIT" },
    ],
  },
  fr: {
    name: "Mohamed Neji Benzarti",
    title: "Ingénieur logiciel spécialisé en développement web",
    tagline:
      "Je conçois des applications web modernes et évolutives qui transforment les idées en produits fiables.",
    location: "Basé au Koweït",
    availability: "Ouvert aux opportunités",
    about: [
      "Je conçois des applications web modernes et évolutives qui transforment les idées en produits fiables, des interfaces soignées jusqu'à une architecture backend solide.",
      "Actuellement basé au Koweït, j'ai eu l'occasion de travailler avec des équipes et des clients au Koweït, en France, au Canada et en Tunisie, notamment EY. Cette expérience internationale m'a appris à m'adapter rapidement, à communiquer clairement et à livrer un travail de qualité.",
      "Je suis passionné par le code propre, l'apprentissage continu et la création de solutions numériques qui ont un impact réel.",
    ],
    figures: [
      { kind: "count", value: 4, label: "pays" },
      { kind: "count", value: 5, after: "+", label: "projets en production" },
      { kind: "text", label: "Ingénieur, ESPRIT" },
    ],
  },
  ar: {
    name: "محمد الناجي البنزرتي",
    title: "مهندس برمجيات متخصص في إنشاء المواقع الإلكترونية",
    tagline: "أبني تطبيقات ويب حديثة وقابلة للتوسّع تحوّل الأفكار إلى منتجات موثوقة.",
    location: "مقيم في الكويت",
    availability: "منفتح على الفرص",
    about: [
      "أبني تطبيقات ويب حديثة وقابلة للتوسّع تحوّل الأفكار إلى منتجات موثوقة، من واجهات مستخدم أنيقة إلى بنية خلفية متينة.",
      "أقيم حاليًا في الكويت، وقد أُتيحت لي فرصة العمل مع فرق وعملاء في الكويت وفرنسا وكندا وتونس، من بينهم EY. علّمتني هذه التجربة الدولية أن أتكيّف بسرعة، وأتواصل بوضوح، وأسلّم عملًا عالي الجودة.",
      "أنا شغوف بالكود النظيف والتعلّم المستمر وابتكار حلول رقمية تُحدث أثرًا حقيقيًا.",
    ],
    figures: [
      { kind: "count", value: 4, label: "دول" },
      { kind: "count", value: 5, before: "أكثر من", label: "مشاريع إنتاجية" },
      { kind: "text", label: "مهندس، ESPRIT" },
    ],
  },
};
