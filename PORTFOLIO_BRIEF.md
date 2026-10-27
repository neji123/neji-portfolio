# PORTFOLIO_BRIEF.md — Mohamed Neji Benzarti

> Single source of truth for building my personal portfolio.
> Read this file completely before writing any code. Follow the phases in order and stop at each checkpoint for my review.

---

## 1. Goal

Build a **frontend-only**, fast, accessible and memorable personal portfolio that makes recruiters and clients in Kuwait, the Gulf, and Europe want to contact me.

- **Audience:** tech recruiters, engineering managers, potential freelance clients.
- **First impression (5 seconds):** "Senior-quality Full Stack Developer, international experience, ships real products."
- **Primary action:** contact me (email / LinkedIn / download CV).
- **Language:** English (structure must be i18n-ready so French/Arabic can be added later, including RTL).

---

## 2. Tech stack (fixed)

| Area | Choice |
|---|---|
| Framework | **Next.js (latest stable, App Router)**, React Server Components by default |
| Language | **TypeScript, `strict: true`**, no `any` |
| Styling | **Tailwind CSS** + CSS variables for design tokens |
| UI primitives | shadcn/ui (only what is needed) |
| 3D | **React Three Fiber + @react-three/drei** (Three.js) |
| Animation | **GSAP** (+ ScrollTrigger, `@gsap/react` `useGSAP`) for scroll/timeline; CSS transitions for micro-interactions |
| Smooth scroll | **Lenis** (`lenis/react`), synced with GSAP ScrollTrigger |
| Components inspiration | React Bits, 21st.dev (copy, then adapt to our tokens; never paste blindly) |
| Fonts | `next/font` (self-hosted, no layout shift) |
| Images | `next/image`, AVIF/WebP |
| Quality | ESLint (next + typescript), Prettier, Husky + lint-staged, Conventional Commits |
| Testing | Playwright (E2E + visual screenshots + accessibility with `@axe-core/playwright`) |
| Deploy | Vercel (static where possible) |

No backend, no database. Contact = `mailto:` + links (optionally a form service like Formspree later).

---

## 3. Skills to install and how to use them

Install at project level, then **read each SKILL.md before using it**. If an install command fails, find the official repo and install manually. Do not invent skills.

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

## 5. Architecture & clean code rules

### Folder structure

```
src/
  app/
    layout.tsx            # fonts, metadata, providers (Lenis), skip link
    page.tsx              # composes sections only, no logic
    not-found.tsx
    opengraph-image.tsx
    sitemap.ts
    robots.ts
  components/
    ui/                   # generic, reusable, stateless (Button, Badge, Card, Section, Heading)
    layout/               # Header, Footer, Nav, MobileMenu
    motion/               # Reveal, SplitText, MagneticButton, PageTransition (GSAP wrappers)
    three/                # JourneyGlobe, GlobeArcs, GlobeFallback
  features/               # one folder per page section
    hero/
    about/
    experience/
    projects/
    skills/
    certifications/
    contact/
  content/                # ALL text and data as typed objects (no hard-coded text in components)
    profile.ts
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

---

## 6. Quality targets (definition of done)

- **Lighthouse ≥ 95** on Performance, Accessibility, Best Practices, SEO (mobile and desktop).
- Core Web Vitals: LCP < 2.5s, CLS < 0.1, INP < 200ms.
- **WCAG 2.2 AA**: contrast, keyboard navigation, visible focus, skip link, alt texts, zero axe violations.
- Responsive and tested at **360, 768, 1024, 1440, 1920 px**; no horizontal scroll.
- SEO: metadata, Open Graph image, JSON-LD `Person` schema, sitemap, robots, canonical URL.
- Playwright: E2E for navigation, CV download and contact links; screenshot for each section on mobile and desktop.
- `npm run lint`, `npm run typecheck`, `npm run build` and `npm run test:e2e` all pass.

---

## 7. Sections & content

### Navigation
About · Experience · Projects · Skills · Certifications · Contact · **[Download CV]** button

### Hero
- **Name:** Mohamed Neji Benzarti
- **Title:** Full Stack Developer
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
- **Professional Training Certificate in Artificial Intelligence**, Optimus Training · Jun 2026
- **TCF Tout Public, Level B2 (CEFR)**, France Éducation International · Jan 2026
- **Cisco CCNA: Switching, Routing, and Wireless Essentials**: https://www.credly.com/badges/312e7aad-e46d-46f1-8cb4-97831eddbc35

### Languages
Arabic (Native) · English (Professional) · French (B2)

### Contact
- **Email:** benzartimedneji@gmail.com
- **LinkedIn:** https://www.linkedin.com/in/mohamed-neji-benzarti-3951aa1bb/
- **GitHub:** https://github.com/neji123
- **CV:** `/cv/CV_Mohamed_Neji_Benzarti.pdf`
- Closing line: *"Have a project or an opportunity in mind? Let's talk."*

### Privacy rules (mandatory)
Never publish: national ID (CIN) number, date of birth, candidate numbers, full certificate scans containing personal data, home address.

---

## 8. Assets I provide (in `public/`)

| File | Use |
|---|---|
| `images/profile.jpg` | About section / hero (circular or masked shape) |
| `cv/CV_Mohamed_Neji_Benzarti.pdf` | Download CV button |
| `images/projects/mustawfi.png`, `takween.png`, `plagediscount.png` | Project cards (if missing: capture them with Playwright at 1440×900) |
| `images/logos/` (optional) | Company logos: Takween, EY, ITEC Études, IPACT, ESPRIT |

---

## 9. Phases & checkpoints

| Phase | Work | Checkpoint (stop and show me) |
|---|---|---|
| **0. Setup** | Install skills, read SKILL.md files, create the Next.js project, tooling (ESLint, Prettier, Husky, Playwright), folder structure | Summary of installed skills and the structure |
| **1. Design direction** | Use refero/awesome-design + taste/impeccable: propose **2 art directions** (palette, typography, mood, 3D style) as a short visual moodboard | **I choose one** |
| **2. Foundations** | Design tokens, fonts, layout, header/footer, Lenis + GSAP setup, `content/` typed data, base `ui/` components | Screenshots desktop + mobile |
| **3. Sections** | Hero, About, Experience, Projects, Skills, Certifications, Contact (static first, no animation yet) | Screenshots of each section |
| **4. 3D Journey Globe** | Build, lazy-load, fallback, performance | Video/GIF + performance numbers |
| **5. Motion & polish** | GSAP scroll animations, transitions, micro-interactions (make-interfaces-feel-better), reduced-motion | Screen recording |
| **6. Audit & tests** | web-design-guidelines audit, axe, Lighthouse, Playwright E2E + visual tests, SEO | Report with scores |
| **7. Deploy** | Vercel deployment, OG image check, final README | Live URL |

Commit at the end of each phase with a Conventional Commit message.
