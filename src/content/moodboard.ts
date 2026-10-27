// Phase 1 moodboard copy. Temporary: removed once an art direction is chosen and real messages land.
import {
  type BoardLocale,
  type DirectionCopy,
  type DirectionId,
  type MoodboardIndexCopy,
  type MoodboardUi,
  type SiteCopy,
} from "@/types/moodboard";

export const boardLocales: readonly BoardLocale[] = ["en", "ar"];

export const directionIds: readonly DirectionId[] = ["night-route", "departures"];

export const moodboardIndex: MoodboardIndexCopy = {
  title: "Two art directions",
  intro:
    "Each direction is shown as its own first screen and system, in English and in Arabic (right to left). Choose one to carry into Phase 2.",
  directionsHeading: "Directions",
};

export const portraitImage = {
  src: "/images/profile-transparent.png",
  width: 864,
  height: 1184,
} as const;

export const moodboardUi: Record<BoardLocale, MoodboardUi> = {
  en: {
    boardLabel: "Phase 1 moodboard",
    siteNavLabel: "Site navigation preview",
    directionsNavLabel: "Art directions",
    languageNavLabel: "Language",
    sections: {
      idea: "The idea",
      firstViewport: "First screen",
      liveThing: "The live interaction",
      palette: "Palette",
      type: "Typography",
      interface: "Interface",
      stop: "An experience stop",
      motion: "Motion",
      risk: "Honest risk",
      raises: "Disciplines borrowed from the rejected concepts",
    },
    specimenDisplay: "Tunis to Kuwait City",
    specimenText:
      "I build modern, scalable web applications that turn ideas into reliable products, from clean user interfaces to solid backend architecture.",
    switcherCaption: "Language switcher specimen: SVG flags with a visible code",
    languages: [
      { code: "EN", label: "EN", ariaLabel: "English" },
      { code: "FR", label: "FR", ariaLabel: "Français" },
      { code: "AR", label: "AR", ariaLabel: "العربية" },
    ],
    localeName: { en: "English", ar: "العربية" },
  },
  ar: {
    boardLabel: "لوحة الإلهام، المرحلة الأولى",
    siteNavLabel: "معاينة تنقّل الموقع",
    directionsNavLabel: "الاتجاهات الفنية",
    languageNavLabel: "اللغة",
    sections: {
      idea: "الفكرة",
      firstViewport: "الشاشة الأولى",
      liveThing: "التفاعل الحي",
      palette: "الألوان",
      type: "الخطوط",
      interface: "عناصر الواجهة",
      stop: "محطة من الخبرات",
      motion: "الحركة",
      risk: "المخاطرة بصراحة",
      raises: "انضباطات مستعارة من المفاهيم المستبعدة",
    },
    specimenDisplay: "من تونس إلى مدينة الكويت",
    specimenText:
      "أبني تطبيقات ويب حديثة وقابلة للتوسّع تحوّل الأفكار إلى منتجات موثوقة، من واجهات مستخدم أنيقة إلى بنية خلفية متينة.",
    switcherCaption: "نموذج مبدّل اللغة: أعلام بصيغة SVG مع رمز ظاهر",
    languages: [
      { code: "EN", label: "EN", ariaLabel: "English" },
      { code: "FR", label: "FR", ariaLabel: "Français" },
      { code: "AR", label: "AR", ariaLabel: "العربية" },
    ],
    localeName: { en: "English", ar: "العربية" },
  },
};

export const siteCopy: Record<BoardLocale, SiteCopy> = {
  en: {
    nav: {
      links: ["About", "Experience", "Projects", "Skills", "Certifications", "Contact"],
      downloadCv: "Download CV",
    },
    hero: {
      name: "Mohamed Neji Benzarti",
      title: "Full Stack Developer",
      tagline: "I build modern, scalable web applications that turn ideas into reliable products.",
      location: "Based in Kuwait · Open to opportunities",
      primaryCta: "View my work",
      secondaryCta: "Download CV",
      portraitAlt: "Portrait of Mohamed Neji Benzarti in a navy suit and tie",
    },
    about: {
      heading: "About",
      paragraphs: [
        "I build modern, scalable web applications that turn ideas into reliable products, from clean user interfaces to solid backend architecture.",
        "Currently based in Kuwait, I've had the opportunity to work with teams and clients across Kuwait, France, Canada and Tunisia, including EY. This international experience taught me to adapt quickly, communicate clearly and deliver with quality.",
        "I'm passionate about clean code, continuous learning and creating digital solutions that make a real impact.",
      ],
      figures: ["4 countries", "5+ production projects", "Engineer, ESPRIT"],
    },
    columns: {
      code: "Code",
      destination: "Destination",
      company: "Company",
      role: "Role",
      dates: "Dates",
      status: "Status",
      now: "Now",
    },
    stops: [
      {
        id: "takween",
        code: "KWT",
        place: "Kuwait City, Kuwait",
        company: "Takween",
        role: "Full Stack Developer",
        dates: "Jun 2026 – Present",
        summary:
          "Corporate website for an HSSE training provider (React.js) and Mustawfi, a bilingual SaaS audit platform (Next.js, Express, MongoDB, Docker).",
        current: true,
      },
      {
        id: "itec",
        code: "FRA",
        place: "France (Remote)",
        company: "ITEC Études",
        role: "Full Stack Developer, 6-month mission",
        dates: "Nov 2025 – Apr 2026",
        summary: "Parking management web platform (Django, Angular, PostgreSQL).",
        current: false,
      },
      {
        id: "freelance",
        code: "FRA",
        place: "Remote, client in France",
        company: "Freelance",
        role: "Full Stack Developer",
        dates: "2026",
        summary:
          "E-commerce platform for a French artisanal products company (Angular, Django, Docker, Hetzner).",
        current: false,
      },
      {
        id: "ey",
        code: "TUN",
        place: "Tunis, Tunisia",
        company: "EY (Ernst & Young)",
        role: "Full Stack Developer Intern",
        dates: "Feb 2025 – Aug 2025",
        summary:
          "Intern management application with AI recommendations (.NET Core, Angular, SignalR).",
        current: false,
      },
      {
        id: "ipact",
        code: "CAN",
        place: "Montréal, Canada (Remote)",
        company: "IPACT Consult Inc.",
        role: "Full Stack Developer Intern",
        dates: "Jun 2024 – Aug 2024",
        summary: "Agile management platform built with TDD (Spring Boot, Angular, JUnit).",
        current: false,
      },
    ],
    cities: {
      tunis: "Tunis",
      montreal: "Montréal",
      france: "France",
      "kuwait-city": "Kuwait City",
    },
    globeLabel: "Globe showing the career route: Tunis, Montréal, France, then Kuwait City",
  },
  ar: {
    nav: {
      links: ["نبذة عني", "الخبرات", "المشاريع", "المهارات", "الشهادات", "تواصل"],
      downloadCv: "تحميل السيرة الذاتية",
    },
    hero: {
      name: "محمد ناجي بنزرتي",
      title: "مطوّر ويب متكامل",
      tagline: "أبني تطبيقات ويب حديثة وقابلة للتوسّع تحوّل الأفكار إلى منتجات موثوقة.",
      location: "مقيم في الكويت · منفتح على الفرص",
      primaryCta: "استعرض أعمالي",
      secondaryCta: "تحميل السيرة الذاتية",
      portraitAlt: "صورة شخصية لمحمد ناجي بنزرتي ببدلة كحلية وربطة عنق",
    },
    about: {
      heading: "نبذة عني",
      paragraphs: [
        "أبني تطبيقات ويب حديثة وقابلة للتوسّع تحوّل الأفكار إلى منتجات موثوقة، من واجهات مستخدم أنيقة إلى بنية خلفية متينة.",
        "أقيم حاليًا في الكويت، وقد أُتيحت لي فرصة العمل مع فرق وعملاء في الكويت وفرنسا وكندا وتونس، من بينهم EY. علّمتني هذه التجربة الدولية أن أتكيّف بسرعة، وأتواصل بوضوح، وأسلّم عملًا عالي الجودة.",
        "أنا شغوف بالكود النظيف والتعلّم المستمر وابتكار حلول رقمية تُحدث أثرًا حقيقيًا.",
      ],
      figures: ["4 دول", "أكثر من 5 مشاريع إنتاجية", "مهندس، ESPRIT"],
    },
    columns: {
      code: "الرمز",
      destination: "الوجهة",
      company: "الشركة",
      role: "الدور",
      dates: "الفترة",
      status: "الحالة",
      now: "الآن",
    },
    stops: [
      {
        id: "takween",
        code: "KWT",
        place: "مدينة الكويت، الكويت",
        company: "Takween",
        role: "مطوّر ويب متكامل",
        dates: "يونيو 2026 – حتى الآن",
        summary:
          "موقع مؤسسي لمزوّد تدريب في مجال الصحة والسلامة والأمن والبيئة (React.js)، وMustawfi، منصة SaaS ثنائية اللغة للتدقيق (Next.js وExpress وMongoDB وDocker).",
        current: true,
      },
      {
        id: "itec",
        code: "FRA",
        place: "فرنسا (عن بُعد)",
        company: "ITEC Études",
        role: "مطوّر ويب متكامل، مهمة لمدة 6 أشهر",
        dates: "نوفمبر 2025 – أبريل 2026",
        summary: "منصة ويب لإدارة مواقف السيارات (Django وAngular وPostgreSQL).",
        current: false,
      },
      {
        id: "freelance",
        code: "FRA",
        place: "عن بُعد، عميل في فرنسا",
        company: "عمل حر",
        role: "مطوّر ويب متكامل",
        dates: "2026",
        summary:
          "منصة تجارة إلكترونية لشركة فرنسية للمنتجات الحرفية (Angular وDjango وDocker وHetzner).",
        current: false,
      },
      {
        id: "ey",
        code: "TUN",
        place: "تونس، تونس",
        company: "EY (Ernst & Young)",
        role: "متدرّب مطوّر ويب متكامل",
        dates: "فبراير 2025 – أغسطس 2025",
        summary:
          "تطبيق لإدارة المتدرّبين مع توصيات بالذكاء الاصطناعي (.NET Core وAngular وSignalR).",
        current: false,
      },
      {
        id: "ipact",
        code: "CAN",
        place: "مونتريال، كندا (عن بُعد)",
        company: "IPACT Consult Inc.",
        role: "متدرّب مطوّر ويب متكامل",
        dates: "يونيو 2024 – أغسطس 2024",
        summary:
          "منصة لإدارة المشاريع بمنهجية Agile وفق التطوير الموجّه بالاختبارات (Spring Boot وAngular وJUnit).",
        current: false,
      },
    ],
    cities: {
      tunis: "تونس",
      montreal: "مونتريال",
      france: "فرنسا",
      "kuwait-city": "مدينة الكويت",
    },
    globeLabel: "كرة أرضية تعرض المسار المهني: تونس، ثم مونتريال، ثم فرنسا، ثم مدينة الكويت",
  },
};

const nightRouteSwatchValues = {
  ground: "#0C1A2C",
  surface: "#14263D",
  ink: "#EEF0EA",
  muted: "#A9B4C2",
  route: "#F0609E",
  paper: "#EEF0EA",
  paperRoute: "#B4246B",
} as const;

const departuresSwatchValues = {
  ground: "#E9EBEC",
  ink: "#16191D",
  muted: "#4D545C",
  sign: "#1F2328",
  signMuted: "#B7BCC2",
  yellow: "#FFD100",
} as const;

export const directionCopy: Record<DirectionId, Record<BoardLocale, DirectionCopy>> = {
  "night-route": {
    en: {
      name: "Night Route",
      thesis:
        "The career is a night flight seen from altitude. The globe is not a widget beside the copy: it is the ground the whole first screen stands on, with the route Tunis → Montréal → France → Kuwait City drawn across it in chart magenta.",
      idea: "On this page, the route between four countries becomes the flight chart the visitor travels along.",
      firstViewport:
        "Name and role set large at the start edge. The globe's horizon fills the lower half, its dots shaded by depth. The portrait stands on the horizon at the end edge, lit by the planet's own atmosphere.",
      liveThing:
        "Scrolling moves the camera along the arcs and each landing opens the matching experience. Hover or tap a city for company and years.",
      typeLatin: "Archivo, widened for display, normal width for text",
      typeArabic: "Alexandria, a geometric Arabic sans whose structure matches Archivo",
      typeNote:
        "One voice per script. Arabic is never letter-spaced and gets a taller line height.",
      motion:
        "One signature move: the camera flight between stops. Everything else is one entrance per section, transform and opacity only. With reduced motion: a still globe with every arc drawn.",
      risk: "A dark ground with one bright accent sits close to the usual developer portfolio. It stays distinct only if magenta is kept to the route and the contact action, and the daylight chart field carries the reading sections.",
      raises: [
        "From the seven-segment display: absence is drawn as deliberately as light. Land the route never reached is a designed ghost layer, the current stop pulses, past stops hold steady.",
        "From the creator-hardware bench: one accent reserved for the action that matters. Magenta marks the route and the contact button, nothing else.",
        "From the brine calendar: every item carries the same metadata band (place, company, years, role) in the same order.",
        "From the window-box toy shelf: the front is the summary and opening it is the detail. Project and certificate cards open in place.",
        "From the ebru marbling bath: one surface, one pass. The globe and the page are one continuous ground, never a 3D widget in a box.",
      ],
      swatches: [
        {
          token: "ground",
          value: nightRouteSwatchValues.ground,
          name: "Night ground",
          use: "Most of the first screen",
        },
        {
          token: "surface",
          value: nightRouteSwatchValues.surface,
          name: "Raised surface",
          use: "Panels and the menu",
        },
        {
          token: "ink",
          value: nightRouteSwatchValues.ink,
          name: "Chart white",
          use: "Text and land dots",
        },
        {
          token: "muted",
          value: nightRouteSwatchValues.muted,
          name: "Muted ink",
          use: "Secondary text",
        },
        {
          token: "route",
          value: nightRouteSwatchValues.route,
          name: "Route magenta",
          use: "The route and the contact action only",
        },
        {
          token: "paper",
          value: nightRouteSwatchValues.paper,
          name: "Chart paper",
          use: "The daylight field for reading sections",
        },
        {
          token: "paper-route",
          value: nightRouteSwatchValues.paperRoute,
          name: "Route on paper",
          use: "Magenta on the daylight field",
        },
      ],
    },
    ar: {
      name: "مسار الليل",
      thesis:
        "المسيرة المهنية رحلة ليلية تُرى من الأعلى. الكرة الأرضية ليست عنصرًا جانبيًا بجوار النص، بل هي الأرض التي تقوم عليها الشاشة الأولى كلها، ويُرسم عليها المسار تونس ← مونتريال ← فرنسا ← مدينة الكويت بلون أرجواني مستوحى من خرائط الطيران.",
      idea: "في هذه الصفحة، يصبح المسار بين أربع دول خريطةَ الطيران التي يسافر عبرها الزائر.",
      firstViewport:
        "الاسم والمسمّى الوظيفي بخط كبير عند بداية السطر. يملأ أفق الكرة الأرضية النصف السفلي، ونقاطها مظلّلة حسب العمق. وتقف الصورة الشخصية على الأفق عند نهاية السطر، يضيئها الغلاف الجوي للكوكب.",
      liveThing:
        "يحرّك التمرير الكاميرا على امتداد الأقواس، وتفتح كل محطة الخبرة المقابلة لها. مرّر المؤشر فوق مدينة أو المسها لعرض الشركة والسنوات.",
      typeLatin: "Archivo، بعرض موسّع للعناوين وعرض عادي للنصوص",
      typeArabic: "Alexandria، خط عربي هندسي تتناغم بنيته مع Archivo",
      typeNote:
        "صوت واحد لكل نظام كتابة. لا تُباعَد حروف العربية أبدًا، وتحصل على ارتفاع سطر أكبر.",
      motion:
        "حركة مميّزة واحدة: طيران الكاميرا بين المحطات. وما عدا ذلك ظهور واحد لكل قسم، بالتحويل والشفافية فقط. عند تفضيل تقليل الحركة: كرة ثابتة وجميع الأقواس مرسومة.",
      risk: "الأرضية الداكنة مع لون بارز واحد قريبة من النمط المعتاد لملفات المطوّرين. ولا تبقى مميّزة إلا إذا اقتصر الأرجواني على المسار وزر التواصل، وحمل حقل الخريطة النهاري أقسام القراءة.",
      raises: [
        "من شاشة الأرقام السباعية: الغياب يُرسم بالعناية نفسها التي يُرسم بها الضوء. اليابسة التي لم يبلغها المسار طبقة باهتة مصمّمة، والمحطة الحالية تنبض، والمحطات السابقة ثابتة.",
        "من منضدة الأجهزة الإبداعية: لون بارز واحد مخصّص للإجراء الأهم. الأرجواني للمسار وزر التواصل فقط.",
        "من تقويم المخللات: كل عنصر يحمل شريط البيانات نفسه (المكان، والشركة، والسنوات، والدور) بالترتيب نفسه.",
        "من رفّ علب الألعاب: الواجهة هي الملخّص، وفتحها يعرض التفاصيل. بطاقات المشاريع والشهادات تُفتح في مكانها.",
        "من حوض الإبرو: سطح واحد في مرور واحد. الكرة الأرضية والصفحة أرضية واحدة متصلة، لا عنصرًا ثلاثي الأبعاد داخل صندوق.",
      ],
      swatches: [
        {
          token: "ground",
          value: nightRouteSwatchValues.ground,
          name: "أرضية الليل",
          use: "معظم الشاشة الأولى",
        },
        {
          token: "surface",
          value: nightRouteSwatchValues.surface,
          name: "السطح المرتفع",
          use: "اللوحات والقائمة",
        },
        {
          token: "ink",
          value: nightRouteSwatchValues.ink,
          name: "أبيض الخريطة",
          use: "النصوص ونقاط اليابسة",
        },
        {
          token: "muted",
          value: nightRouteSwatchValues.muted,
          name: "الحبر الثانوي",
          use: "النصوص الثانوية",
        },
        {
          token: "route",
          value: nightRouteSwatchValues.route,
          name: "أرجواني المسار",
          use: "المسار وزر التواصل فقط",
        },
        {
          token: "paper",
          value: nightRouteSwatchValues.paper,
          name: "ورق الخريطة",
          use: "الحقل النهاري لأقسام القراءة",
        },
        {
          token: "paper-route",
          value: nightRouteSwatchValues.paperRoute,
          name: "المسار على الورق",
          use: "الأرجواني فوق الحقل النهاري",
        },
      ],
    },
  },
  departures: {
    en: {
      name: "Departures",
      thesis:
        "Airport wayfinding in the Gulf is bilingual: English and Arabic set side by side as equals. The career becomes a departures board, the name becomes the sign, and the trilingual site is the board switching language.",
      idea: "On this page, the route between four countries becomes the departures board, with Arabic and Latin set as equals.",
      firstViewport:
        "A charcoal sign panel fills the first screen under a plain bar. The name is the sign's headline in wayfinding yellow; the five stops are the board's rows. The portrait stands in front of the sign, backlit.",
      liveThing:
        "Choosing a row on the board opens that stop: company, role, dates and stack. The globe sits behind the board as the route map.",
      typeLatin: "Readex Pro for both scripts",
      typeArabic: "A family drawn so Arabic and Latin share one rhythm, as on a bilingual sign",
      typeNote:
        "One family for the whole site. Arabic is never letter-spaced and gets a taller line height.",
      motion:
        "Signature move: the board rows settle into place one by one like a split-flap update, and switching language re-sets the board. With reduced motion: rows appear without travel.",
      risk: "Airport signage can tip into travel-agency costume. It stays credible only if the board carries real data and yellow stays a field, not decoration. The yellow also echoes EY's brand colour.",
      raises: [],
      swatches: [
        {
          token: "ground",
          value: departuresSwatchValues.ground,
          name: "Terminal concrete",
          use: "The page ground",
        },
        { token: "ink", value: departuresSwatchValues.ink, name: "Signage black", use: "Text" },
        {
          token: "muted",
          value: departuresSwatchValues.muted,
          name: "Muted ink",
          use: "Secondary text on concrete",
        },
        {
          token: "sign",
          value: departuresSwatchValues.sign,
          name: "Sign panel",
          use: "The board and the first-screen field",
        },
        {
          token: "sign-muted",
          value: departuresSwatchValues.signMuted,
          name: "Board muted",
          use: "Secondary text on the board",
        },
        {
          token: "yellow",
          value: departuresSwatchValues.yellow,
          name: "Wayfinding yellow",
          use: "Board text, the contact action, the current stop",
        },
      ],
    },
    ar: {
      name: "المغادرة",
      thesis:
        "لافتات الإرشاد في مطارات الخليج ثنائية اللغة: الإنجليزية والعربية جنبًا إلى جنب على قدم المساواة. تصبح المسيرة المهنية لوحةَ رحلات المغادرة، ويصبح الاسم هو اللافتة، ويصبح الموقع الثلاثي اللغات هو اللوحة حين تبدّل لغتها.",
      idea: "في هذه الصفحة، يصبح المسار بين أربع دول لوحةَ المغادرة، حيث تتجاور العربية واللاتينية على قدم المساواة.",
      firstViewport:
        "لوحة لافتات فحمية اللون تملأ الشاشة الأولى تحت شريط بسيط. الاسم هو عنوان اللافتة بأصفر الإرشاد، والمحطات الخمس هي صفوف اللوحة. وتقف الصورة الشخصية أمام اللافتة بإضاءة خلفية.",
      liveThing:
        "اختيار صفّ في اللوحة يفتح تلك المحطة: الشركة، والدور، والتواريخ، والتقنيات. وتقع الكرة الأرضية خلف اللوحة بوصفها خريطة المسار.",
      typeLatin: "Readex Pro لنظامَي الكتابة",
      typeArabic:
        "عائلة خطوط رُسمت لتتشارك العربية واللاتينية إيقاعًا واحدًا، كما على اللافتة ثنائية اللغة",
      typeNote: "عائلة واحدة للموقع كله. لا تُباعَد حروف العربية أبدًا، وتحصل على ارتفاع سطر أكبر.",
      motion:
        "الحركة المميّزة: تستقر صفوف اللوحة في مكانها واحدًا تلو الآخر كتحديث اللوحات القلّابة، وتبديل اللغة يعيد ضبط اللوحة. عند تفضيل تقليل الحركة: تظهر الصفوف دون انتقال.",
      risk: "قد تنزلق لافتات المطارات إلى مظهر وكالات السفر. ولا تبقى ذات مصداقية إلا إذا حملت اللوحة بيانات حقيقية وبقي الأصفر حقلًا لا زخرفة. كما أن الأصفر يذكّر بلون علامة EY.",
      raises: [],
      swatches: [
        {
          token: "ground",
          value: departuresSwatchValues.ground,
          name: "خرسانة الصالة",
          use: "أرضية الصفحة",
        },
        { token: "ink", value: departuresSwatchValues.ink, name: "أسود اللافتات", use: "النصوص" },
        {
          token: "muted",
          value: departuresSwatchValues.muted,
          name: "الحبر الثانوي",
          use: "النصوص الثانوية على الخرسانة",
        },
        {
          token: "sign",
          value: departuresSwatchValues.sign,
          name: "لوحة اللافتة",
          use: "اللوحة وحقل الشاشة الأولى",
        },
        {
          token: "sign-muted",
          value: departuresSwatchValues.signMuted,
          name: "ثانوي اللوحة",
          use: "النصوص الثانوية على اللوحة",
        },
        {
          token: "yellow",
          value: departuresSwatchValues.yellow,
          name: "أصفر الإرشاد",
          use: "نصوص اللوحة، وزر التواصل، والمحطة الحالية",
        },
      ],
    },
  },
};
