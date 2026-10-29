# PORTFOLIO_BRIEF.md — Mohamed Neji Benzarti

> Single source of truth for building my personal portfolio.
> Read this file completely before writing any code. Follow the phases in order and stop at each checkpoint for my review.

---

## 1. Goal

Build a **frontend-only**, fast, accessible and memorable personal portfolio that makes recruiters and clients in Kuwait, the Gulf, and Europe want to contact me.

- **Audience:** tech recruiters, engineering managers, potential freelance clients.
- **First impression (5 seconds):** "Senior-quality software engineer, international experience, ships real products."
- **Primary action:** contact me (email / LinkedIn / download CV).
- **Languages:** trilingual, **English (default) / French / Arabic**, with a true RTL experience for Arabic (see section 7, *Internationalization*).

---

## 2. Tech stack (fixed)

| Area | Choice |
|---|---|
| Framework | **Next.js (latest stable, App Router)**, React Server Components by default |
| Runtime | **Node.js 20.20** (`"engines": { "node": ">=20.9" }`, `.nvmrc` = `20`). Never add a dependency or tool that requires Node 22+ |
| Language | **TypeScript, `strict: true`**, no `any` |
| Styling | **Tailwind CSS** + CSS variables for design tokens |
| UI primitives | shadcn/ui (only what is needed) |
| 3D | **React Three Fiber + @react-three/drei** (Three.js) |
| Animation | **GSAP** (+ ScrollTrigger, `@gsap/react` `useGSAP`) for scroll/timeline; CSS transitions for micro-interactions |
| Smooth scroll | **Lenis** (`lenis/react`), synced with GSAP ScrollTrigger |
| Components inspiration | React Bits, 21st.dev (copy, then adapt to our tokens; never paste blindly) |
| i18n | **next-intl** with locale routing: `/en` (default), `/fr`, `/ar`; browser-language detection on first visit, choice remembered in a cookie |
| Fonts | `next/font` (self-hosted, no layout shift): one Latin family for EN/FR + one dedicated high-quality Arabic family (e.g. IBM Plex Sans Arabic or Noto Kufi Arabic) matched to the art direction |
| Images | `next/image`, AVIF/WebP |
| Quality | ESLint (next + typescript), Prettier, Husky + lint-staged, Conventional Commits |
| Testing | Playwright (E2E + visual screenshots + accessibility with `@axe-core/playwright`) |
| Deploy | Vercel (static where possible) |

No backend, no database. Contact = `mailto:` + links (optionally a form service like Formspree later).

---

## 3. Skills to install and how to use them

Install at project level, then **read each SKILL.md before using it**. If an install command fails, find the official repo and install manually. Do not invent skills.

> **Node 20 constraint:** use the skills installer pinned at `npx skills@1.5.26` (1.6+ requires Node 22). taste-skill's `draw.mjs`, `inspect.mjs` and `scenes.mjs` require Node 22 and are **not used**: apply its rules manually and verify with Playwright screenshots. Before running any taste-skill script, state in one line what it does.

```bash
npx skills add https://github.com/Leonxlnx/taste-skill --skill "design-taste-frontend"
npx skills add vercel-labs/agent-skills --skill web-design-guidelines
npx skills add pbakaus/impeccable
npx skills add https://github.com/greensock/gsap-skills
npx skills add jakubkrehel/make-interfaces-feel-better
```

Also find and install or reference (verify the official source first): **awesome-design**, **image-to-code**, **Playwright CLI** (Microsoft), **transitions.dev**, **Lenis** (github.com/darkroomengineering/lenis), **React Bits** (reactbits.dev), **21st.dev**, **styles.refero.design** (visual references).

**Role of each skill (avoid conflicts):**

| Skill | Use it for |
|---|---|
| taste-skill + impeccable | Overall art direction, typography, spacing, anti-generic design. **These lead the visual decisions.** |
| web-design-guidelines | Audit pass: accessibility, forms, focus, semantics, performance rules |
| make-interfaces-feel-better | Polish pass: micro-details, hover/press states, easing, shadows, optical alignment |
| gsap-skills | All GSAP code (correct `useGSAP`, cleanup, ScrollTrigger, `matchMedia`) |
| transitions.dev | Page/section transitions and easing curves |
| Lenis | Smooth scrolling only, never fight native scroll on mobile/reduced motion |
| React Bits / 21st.dev | Ideas and starting points for individual components (text effects, cards, backgrounds) |
| refero / awesome-design | Visual references before designing a section |
| image-to-code | Only if I send a reference screenshot to reproduce a layout |
| Playwright CLI | Verify every phase: screenshots desktop + mobile, E2E, a11y |

---

## 4. Signature 3D concept (unique to me)

**"The Journey Globe"**, an interactive 3D globe in the hero (or right after it):

- A stylized dark globe (dots/points style, not a realistic Earth texture) slowly rotating.
- Glowing **arcs** connect the places of my career: **Tunis, Tunisia → Montréal, Canada → France → Kuwait City, Kuwait** (current location pulses).
- On scroll (GSAP ScrollTrigger), the camera travels along the arcs; each stop reveals the matching experience card.
- Hover / tap on a point shows a small label (company + years).
- Subtle mouse parallax on desktop.

**Technical constraints for the 3D:**
- Lazy-load with `next/dynamic` (`ssr: false`) and a lightweight static fallback (SVG/image) while loading.
- Respect `prefers-reduced-motion` (static globe, no camera travel).
- Mobile: lower point count / DPR capped (`dpr={[1, 1.5]}`), or a 2D fallback on low-end devices.
- Pause rendering when off-screen (`frameloop="demand"` or IntersectionObserver).
- Must not hurt LCP: hero text renders first, globe after.

If you have a better and still unique 3D idea that fits a Full Stack Developer, propose it at Checkpoint 1 **before** building.

---

## 4b. Chosen art direction: Night Route (Phase 1 decision)

- **World:** the career is a night flight seen from altitude. The globe is the ground the first screen stands on, not a widget beside the copy.
- **One space, one canvas (Phase 4b rework):** the whole site is a single dark field with no section backgrounds and no hard horizontal edges. One persistent WebGL canvas is fixed behind the page; the same globe moves, scales, dims and turns from section to section (see Progress).
- **Palette:** night ground `#0C1A2C`, raised surface `#14263D`, chart-white ink `#EEF0EA`, muted `#A9B4C2`; route magenta `#F0609E` is used **only** for the route and the contact action; deep night `#07111E` for the sky's edges. **Single dark theme:** the daylight "chart paper" field was removed. Text that crosses the globe sits on a soft blurred veil (`.veil`), never a box.
- **Type:** Archivo (widened for display, normal width for text) for EN/FR; Alexandria for Arabic. Arabic is never letter-spaced and gets taller line heights.
- **The experience must be original and immersive 3D, not a static page (top requirement):** the React Three Fiber globe is the backbone. Route arcs draw themselves on scroll, the camera travels Tunis → Montréal → France → Kuwait City, and each stop reveals its experience. Lenis smooth scroll everywhere, synced with GSAP ScrollTrigger. Purposeful motion in every section: split line/word text reveals, pinned scroll sequences, parallax depth, magnetic buttons, project-card 3D tilt or spotlight, animated counters, section/page transitions, an animated language switch.
- **Component sources (inspiration, adapted to our tokens and TypeScript strict, never pasted blindly):** reactbits.dev, ui.aceternity.com, animata.design, hover.dev, 21st.dev.
- **Constraints on all motion:** lazy-load the 3D, cap DPR on mobile, pause rendering off-screen, give every animation a calm `prefers-reduced-motion` alternative, and make all of it work in RTL.

## 5. Architecture & clean code rules

### Folder structure

```
messages/
  en.json                 # all UI strings (nav, labels, buttons, aria-labels, metadata, 404)
  fr.json
  ar.json
src/
  i18n/
    routing.ts            # next-intl defineRouting: locales, defaultLocale, cookie
    request.ts            # getRequestConfig: loads messages for the locale
    navigation.ts         # locale-aware Link, redirect, usePathname, useRouter
  proxy.ts                # next-intl middleware (Next 16 "proxy" convention): detection + cookie
  app/
    [locale]/
      layout.tsx          # <html lang dir>, fonts per script, metadata, providers (Lenis), skip link
      page.tsx            # composes sections only, no logic
      not-found.tsx
      opengraph-image.tsx # localized OG image
    sitemap.ts            # localized URLs + hreflang alternates
    robots.ts
  components/
    ui/                   # generic, reusable, stateless (Button, Badge, Card, Section, Heading)
    layout/               # Header, Footer, Nav, MobileMenu, LanguageSwitcher
    flags/                # SVG flags: UnitedKingdom, France, Tunisia
    motion/               # Reveal, SplitText, MagneticButton, PageTransition (GSAP wrappers)
    three/                # JourneyGlobe, GlobeArcs, GlobeFallback
  features/               # one folder per page section
    hero/
    about/
    experience/
    projects/
    skills/
    certifications/       # includes CertificateLightbox (accessible modal)
    contact/
  content/                # ALL text and data as typed objects, per locale (no hard-coded text in components)
    profile.ts            # each file is typed per locale (Record<Locale, T> or locale-keyed fields)
    experience.ts
    projects.ts
    skills.ts
    certifications.ts
    education.ts
  lib/                    # pure helpers (cn, formatDate, constants)
  hooks/                  # useReducedMotion, useMediaQuery, useIsomorphicLayoutEffect
  types/                  # shared TypeScript types (Experience, Project, Skill…)
  styles/
    globals.css           # tokens (colors, radius, spacing), base styles
public/
  images/  cv/  og/
tests/
  e2e/
```

### Rules
- **SOLID applied to React:**
  - *Single responsibility*: one component = one job; sections only compose; data lives in `content/`.
  - *Open/closed*: extend components through props and variants (e.g., `cva`), don't edit them for each new case.
  - *Liskov*: variants of a component accept the same base props and behave consistently.
  - *Interface segregation*: small, focused props types; no "god props" objects.
  - *Dependency inversion*: sections depend on typed data (`Project[]`), not on where the data comes from.
- Server Components by default; `"use client"` only for interactivity, 3D and animation (keep client islands small).
- Named exports, `PascalCase` components, `camelCase` functions, `kebab-case` files for non-components, descriptive names, no magic numbers (put them in constants/tokens).
- No duplicated code (DRY), but no premature abstraction.
- Every GSAP animation inside `useGSAP` with proper scope and cleanup; all animations disabled or simplified for `prefers-reduced-motion`.
- Semantic HTML (`header`, `main`, `section` with `aria-labelledby`, `footer`), one `h1`, logical heading order.
- No console errors, no hydration warnings, no unused dependencies.

### Internationalization rules
- UI strings live only in `messages/{en,fr,ar}.json`; content lives in `src/content/` typed per locale.
- **A missing translation key must fail the build:** `messages/en.json` is the source of truth; next-intl's `AppConfig` augmentation types every `useTranslations` key, and a type-level check asserts that `fr.json` and `ar.json` have exactly the same key shape as `en.json` (enforced by `npm run typecheck` and `npm run build`). Content objects use `Record<Locale, T>`, so a missing locale is a type error.
- **RTL everywhere:** `<html lang dir>` per locale; Tailwind logical utilities only (`ms-/me-/ps-/pe-`, `start-/end-`, `text-start/end`, `border-s/e`, `rounded-s/e`), never `left/right`, `ml/mr` or `pl/pr`. Directional icons (arrows, chevrons) are mirrored in RTL; non-directional icons and logos are not.
- **Motion in RTL:** GSAP slide directions read the document direction (`useDirection()` hook) and invert x offsets in RTL; Lenis and ScrollTrigger are tested in RTL.
- Company names, product names and technologies stay in their original form in every locale (Next.js, Angular, Takween, Mustawfi, EY…).

---

## 6. Quality targets (definition of done)

- **Lighthouse ≥ 95** on Performance, Accessibility, Best Practices, SEO (mobile and desktop).
- Core Web Vitals: LCP < 2.5s, CLS < 0.1, INP < 200ms.
- **WCAG 2.2 AA**: contrast, keyboard navigation, visible focus, skip link, alt texts, zero axe violations.
- Responsive and tested at **360, 768, 1024, 1440, 1920 px**; no horizontal scroll.
- SEO: metadata, Open Graph image, JSON-LD `Person` schema, sitemap, robots, canonical URL.
- Playwright: E2E for navigation, CV download and contact links; screenshot for each section on mobile and desktop.
- **i18n:** every Playwright test runs for **all 3 locales** (en, fr, ar) on desktop and mobile; a test switches the language through the header switcher and asserts `lang="ar"` and `dir="rtl"` on `/ar`; checkpoint screenshots are taken for each locale.
- **SEO per locale:** translated metadata and Open Graph, `hreflang` alternates (`en`, `fr`, `ar`, `x-default`), localized sitemap, canonical URL per locale.
- Certificate lightbox: focus trap, `Esc` closes, focus returns to the trigger, zero axe violations while open.
- `npm run lint`, `npm run typecheck`, `npm run build` and `npm run test:e2e` all pass.

---

## 7. Sections & content

### Navigation
About · Experience · Projects · Skills · Certifications · Contact · **[Download CV]** button · **Language switcher**

### Language switcher
- Three SVG flags (no emoji): **United Kingdom (EN)**, **France (FR)**, **Tunisia (AR)**, each with a short visible label (EN / FR / AR) and an `aria-label` ("English", "Français", "العربية").
- In the header on desktop and inside the mobile menu on mobile; fully keyboard operable; the current locale is marked with `aria-current`.
- Switching keeps the visitor on the same page and stores the choice in a cookie.

### Hero
- **Name:** Mohamed Neji Benzarti · Arabic: **محمد الناجي البنزرتي** (this exact spelling everywhere in Arabic, metadata and JSON-LD included)
- **Title:**
  - EN: Software Engineer, Web Development
  - FR: Ingénieur logiciel spécialisé en développement web
  - AR: مهندس برمجيات متخصص في إنشاء المواقع الإلكترونية (long: the hero sets it on 1–2 balanced lines at a readable size, never shrunk)
- **Tagline:** I build modern, scalable web applications that turn ideas into reliable products.
- **Location badge:** Based in Kuwait · Open to opportunities
- **CTAs:** View my work · Download CV
- 3D Journey Globe (see section 4)

### About
I build modern, scalable web applications that turn ideas into reliable products, from clean user interfaces to solid backend architecture.

Currently based in Kuwait, I've had the opportunity to work with teams and clients across Kuwait, France, Canada and Tunisia, including EY. This international experience taught me to adapt quickly, communicate clearly and deliver with quality.

I'm passionate about clean code, continuous learning and creating digital solutions that make a real impact.

Key figures (animated counters): **4 countries** · **5+ production projects** · **Engineer, ESPRIT**

### Experience (timeline, linked to the globe)
1. **Takween**, Full Stack Developer · Kuwait City, Kuwait · Jun 2026 to Present
   Corporate website for an HSSE training provider (React.js) and Mustawfi, a bilingual SaaS audit platform (Next.js, Express, MongoDB, Docker).
2. **ITEC Études**, Full Stack Developer (6-month mission) · France (Remote) · Nov 2025 to Apr 2026
   Parking management web platform (Django, Angular, PostgreSQL).
3. **Freelance**, Full Stack Developer · Remote · 2026
   E-commerce platform for a French artisanal products company (Angular, Django, Docker, Hetzner).
4. **EY (Ernst & Young)**, Full Stack Developer Intern · Tunis, Tunisia · Feb 2025 to Aug 2025
   Intern management application with AI recommendations (.NET Core, Angular, SignalR).
5. **IPACT Consult Inc.**, Full Stack Developer Intern · Montréal, Canada (Remote) · Jun 2024 to Aug 2024
   Agile management platform with TDD (Spring Boot, Angular, JUnit).

### Projects (cards with screenshot, stack tags, live link)
| Project | Description | Stack | Link |
|---|---|---|---|
| **Mustawfi** (featured) | Bilingual (AR/EN) SaaS platform for digital audits, checklists, reporting and online payment, with multi-role access and live dashboards | Next.js, Express, MongoDB, Docker | https://www.mustawfi.com |
| **Takween** | Corporate website for an HSSE training & compliance provider in Kuwait | React.js | https://www.takween.com.kw |
| **Plage Discount** | E-commerce platform for artisanal products: catalog, cart, orders, admin back-office | Angular, Django, Docker, Hetzner | https://plagediscount.com |
| **Smart Parking Platform** | Parking management with real-time availability and client reporting portal | Django, Angular, PostgreSQL | (private, no link) |
| **Intern Management (EY)** | Enterprise app with AI-based intern/mentor matching and real-time notifications | .NET Core, Angular, SignalR | (private, no link) |
| **DevOps & Microservices** | CI/CD pipeline with monitoring and SSO | Jenkins, Docker, Kubernetes, SonarQube, Prometheus, Grafana, Keycloak | GitHub if public |

### Skills (grouped, with icons; no percentage bars)
- **Frontend:** Angular, React.js, Next.js, TypeScript, JavaScript, HTML5, CSS3, Tailwind CSS
- **Backend:** .NET Core, Node.js, Express.js, Django, Spring Boot, REST APIs, SignalR
- **Databases:** MongoDB, PostgreSQL, MySQL, SQL Server
- **DevOps & Cloud:** Docker, Kubernetes, Jenkins, CI/CD, Nginx, Hetzner, Linux, Prometheus, Grafana
- **AI & Data:** Machine Learning, recommendation systems, Data Science
- **Tools:** Git, GitHub, Jira, Figma, JUnit, TDD

### Education
- **Engineering Degree in Computer Science**, ESPRIT · Tunis · 2020 to 2025
- **Professional Training in Artificial Intelligence**, Optimus Training (state-approved, ANETI) · Jan 2026 to Jun 2026

### Certifications
- **Professional Training Certificate in Artificial Intelligence**, Optimus Training · Jun 2026 · image: `images/certificates/certificate-ai-optimus.webp`
- **TCF Tout Public, Level B2 (CEFR)**, France Éducation International · Jan 2026 · image: `images/certificates/tcf-b2.png`
- **Cisco CCNA: Switching, Routing, and Wireless Essentials**: https://www.credly.com/badges/312e7aad-e46d-46f1-8cb4-97831eddbc35

Each certificate is a card with a thumbnail (optimized with `next/image`). For the two certificate images, clicking the card opens an **accessible lightbox/modal** with the full image: focus trap, `Esc` closes, focus returns to the card, descriptive translated alt text. The CCNA card keeps its Credly link.

### Languages
Arabic (Native) · English (Professional) · French (B2)

### Contact
- **Email:** benzartimedneji@gmail.com
- **LinkedIn:** https://www.linkedin.com/in/mohamed-neji-benzarti-3951aa1bb/
- **GitHub:** https://github.com/neji123
- **CV:** `/cv/CV_Mohamed_Neji_Benzarti.pdf`
- Closing line: *"Have a project or an opportunity in mind? Let's talk."*

### Internationalization
Every piece of text is translated into **English, French and Arabic**: navigation, hero, about, experience, projects, skills, certifications, contact, the 3D globe labels, metadata, Open Graph and the 404 page. Translations are faithful and professional (professional French, Modern Standard Arabic). Company names, product names and technologies are not translated.

### Privacy rules (mandatory)
Never publish: national ID (CIN) number, date of birth, home address.

**Authorized exception:** the owner explicitly authorizes publishing the two certificate images listed under *Certifications* (`certificate-ai-optimus.webp`, `tcf-b2.png`); the owner has already hidden the ID number on them. Do not publish any other certificate scan.

The CV PDF in `public/cv/` is provided by the owner and is never edited by the agent. The WhatsApp number in it is intentional.

---

## 8. Assets I provide (in `public/`)

| File | Use |
|---|---|
| `images/profile-transparent.png` | **Main portrait** (transparent background), integrated into the hero/about design with a subtle glow or gradient behind it. This overrides taste-skill's no-glow rule at the owner's explicit request |
| `images/profile.jpg`, `images/profile-square.*` | Fallbacks / OG image source |
| `images/certificates/certificate-ai-optimus.webp` | Certifications card + lightbox (AI training, Optimus Training) |
| `images/certificates/tcf-b2.png` | Certifications card + lightbox (TCF B2) |
| `cv/CV_Mohamed_Neji_Benzarti.pdf` | Download CV button (owner-provided, never edited by the agent; one CV for all locales unless the owner adds localized versions) |
| `images/projects/mustawfi.png`, `takween.png`, `plagediscount.png` | Project cards (if missing: capture them with Playwright at 1440×900) |
| `images/logos/` (optional) | Company logos: Takween, EY, ITEC Études, IPACT, ESPRIT |

---

## 9. Phases & checkpoints

| Phase | Work | Checkpoint (stop and show me) |
|---|---|---|
| **0. Setup** | Install skills, read SKILL.md files, create the Next.js project, tooling (ESLint, Prettier, Husky, Playwright), folder structure | Summary of installed skills and the structure |
| **1. Design direction** ✅ | Use refero/awesome-design + taste/impeccable: propose **2 art directions** (palette, Latin + Arabic typography, mood, 3D style) as a moodboard built as pages in the project, each shown in **EN and AR** | **I choose one** |
| **2. Foundations** | Design tokens, fonts (Latin + Arabic), next-intl routing + messages + missing-key check, layout, header/footer + language switcher, Lenis + GSAP setup (RTL-aware), `content/` typed per locale, base `ui/` components | Screenshots desktop + mobile × 3 locales |
| **3. Sections** | Hero, About, Experience, Projects, Skills, Certifications, Contact (static first, no animation yet) | Screenshots of each section |
| **4. 3D Journey Globe** | Build, lazy-load, fallback, performance | Video/GIF + performance numbers |
| **5. Motion & polish** | GSAP scroll animations, transitions, micro-interactions (make-interfaces-feel-better), reduced-motion | Screen recording |
| **6. Audit & tests** | web-design-guidelines audit, axe, Lighthouse, Playwright E2E + visual tests, SEO | Report with scores |
| **7. Deploy** | Vercel deployment, OG image check, final README | Live URL |

Commit at the end of each phase with a Conventional Commit message.

---

## 10. Progress (resume here)

| Phase | Status | Notes |
|---|---|---|
| 0. Setup | ✅ Done | Skills installed (pinned `skills@1.5.26`, Node 20), tooling, folder structure |
| 1. Design direction | ✅ Done | **Night Route** chosen (section 4b) |
| 2. Foundations | ✅ Done | Tokens, fonts, next-intl EN/FR/AR + missing-key check, layout, header/footer, language switcher, Lenis + GSAP (RTL-aware) |
| 3. Sections | ✅ Done | All sections built in 3 locales. Owner review: menu keeps the 6 links (no Education/Languages); project cards keep the 3D tilt, no spotlight |
| 4. 3D Journey Globe | ✅ Done | See below |
| 4b. 3D rework | ✅ Done | One persistent canvas, continuous dark page (see below) |
| 5. Motion & polish | ⏭ Next | |
| 6. Audit & tests | ⏳ | Playwright/axe/Lighthouse not run yet (owner rule: only lint + typecheck + build until asked) |
| 7. Deploy | ⏳ | Repo: github.com/neji123/neji-portfolio (`main`) |

**Phase 4b in short** (supersedes the two-instance Phase 4 layout):
- One fixed canvas behind the page: `globe-backdrop.tsx` (rendered once by `features/journey/journey-backdrop.tsx`) holds the server-rendered SVG fallback at the hero placement, lazy-loads `journey-globe.tsx` (`next/dynamic`, `ssr: false`) after load + idle, and stops rendering while the tab is hidden. DPR `[1, 1.5]`; phones get fewer dots and stars.
- Choreography table: `components/three/globe-scenes.ts`. Every section declares a scene (`data-globe-scene`); the globe blends between scenes as each section's top travels from the viewport bottom to 40%. Placement is a camera view offset (never a cropped box); `x` is measured from the inline-start edge, so Arabic mirrors.
- Scenes: hero (large planet rising from the end edge) → about (behind the portrait, dim, slow turn) → experience (end-side companion; camera flies stop to stop, reversed arcs draw with the timeline) → projects/skills/education/certifications (small, dark, turning) → contact (foreground, Kuwait City pulsing towards the CTA).
- City labels: one DOM layer above the content (z-30), offered in hero, experience (wide only) and contact; cards size to content and are kept inside the viewport.
- Sections enter in CSS perspective (`Depth`); star field in the same canvas for depth. Reduced motion: one calm static placement, no travel, no scrubbing.
- Regression note: between ea54759 and 7ddeea1 the layout classes did not change; the fix added a per-locale remount (`key={locale}`) and an `overflow-hidden` label layer (which truncated labels). Both containers are gone now; all locales share one choreography.

**Phase 4 in short** (historical) (`src/components/three/`):
- `globe-stage.tsx` holds the static SVG `globe-fallback.tsx` (server-rendered, LCP-safe) and lazy-loads `journey-globe.tsx` with `next/dynamic` (`ssr: false`) only after page load + idle, when near the viewport, with WebGL available and not on Save-Data / ≤2 cores / ≤2 GB devices. The 3D globe rises in and fades the SVG out after its first frame.
- Two instances share the same chunk: **hero** (planet rising from the end edge; slow drift, mouse parallax on desktop, camera drifts along the route as the hero scrolls away) and **journey** (sticky night window beside the Experience timeline, a sticky band on phones; the camera flies to the stop of the role at the reading line, the route leg and the city label of that role light up, and the timeline marker grows).
- Arcs draw themselves leg by leg (Tunis → Montréal → France → Kuwait City); Kuwait City pulses. Arc geometry is shared with the SVG via `src/lib/route-arc.ts`.
- City labels are real DOM buttons (drei `Html`): hover/focus/tap shows city + company + years in the current locale (built server-side in `src/lib/journey-stops.ts`); click (second tap on touch) scrolls to the role in Experience and focuses it.
- Performance: mobile/coarse pointer → DPR `[1, 1.5]`, ~2.3k dots instead of ~9k, no antialiasing; desktop DPR `[1, 1.75]`; `frameloop="never"` off-screen. The 3D chunk is ~262 KB gzip and is not in the initial bundle.
- Reduced motion: no drift, parallax, pulse or camera travel; the journey globe stays on the whole-route overview and renders on demand.
- The timeline reads most recent first, so the journey camera flies the route backwards (Kuwait City → France → Tunis → Montréal).
