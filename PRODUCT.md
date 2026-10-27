# Product

<!-- impeccable:product-schema 1 -->

Source: every fact below comes from the owner's `PORTFOLIO_BRIEF.md` and the owner's messages, which serve as the confirmed answers to the init interview.

## Platform

web

## Users

- **Tech recruiters** in Kuwait, the Gulf and Europe, screening candidates fast (first impression in about 5 seconds), often on a phone between other tabs.
- **Engineering managers** checking whether the candidate ships real, production-grade work and writes clean code.
- **Potential freelance clients** (businesses in Kuwait, the Gulf and France) looking for someone who can build a whole product end to end.

The job in every case: decide quickly whether to contact Mohamed Neji Benzarti, then do so (email, LinkedIn, or downloading the CV).

## Product Purpose

The personal portfolio of Mohamed Neji Benzarti, software engineer (web development) based in Kuwait. It exists to make the right people reach out. Success means a visitor leaves within seconds believing "senior-quality software engineer, international experience, ships real products", then contacts him.

## Positioning

A path no neighbouring developer shares: **Tunis → Montréal → France → Kuwait City**. That covers four countries, EY, live production SaaS (Mustawfi, bilingual AR/EN), a corporate site (Takween) and an e-commerce platform (Plage Discount), all built end to end from UI to database to Docker/Hetzner deployment. He works natively across Arabic, French and English, and the site itself is trilingual with true RTL.

## Operating Context

- Visitors arrive from LinkedIn, a CV link or a job application, in English, French or Arabic.
- The CV PDF (`/cv/CV_Mohamed_Neji_Benzarti.pdf`) is the artefact recruiters forward internally.
- Live products can be visited: mustawfi.com, takween.com.kw, plagediscount.com. Smart Parking and EY Intern Management are private (no link).

## Capabilities and Constraints

- Frontend-only static site: Next.js 16 App Router, TypeScript strict, Tailwind v4, deployed on Vercel. No backend; contact is `mailto:` plus links.
- Trilingual with next-intl: `/en` (default), `/fr`, `/ar` (RTL). Every string is translated; company, product and technology names stay in their original form.
- Signature feature: the 3D "Journey Globe" (React Three Fiber), showing career arcs Tunis → Montréal → France → Kuwait City. It is lazy-loaded, has a static fallback, and respects reduced motion.
- Node 20.20 runtime; no tooling that requires Node 22+.
- Quality bar: Lighthouse ≥ 95 in every category, WCAG 2.2 AA, zero axe violations, CLS < 0.1, LCP < 2.5s.

## Brand Commitments

- Name: **Mohamed Neji Benzarti**; in Arabic exactly **محمد الناجي البنزرتي**.
- Title: EN **Software Engineer, Web Development** · FR **Ingénieur logiciel spécialisé en développement web** · AR **مهندس برمجيات متخصص في إنشاء المواقع الإلكترونية**.
- Tagline: "I build modern, scalable web applications that turn ideas into reliable products."
- Location badge: "Based in Kuwait · Open to opportunities".
- Main portrait: `public/images/profile-transparent.png` (transparent background), integrated into the hero/about with a subtle glow or gradient behind it. This is an explicit owner requirement.
- Language switcher with SVG flags: United Kingdom (EN), France (FR), Tunisia (AR).
- The design must look unique and premium, not like a template.

## Evidence on Hand

- Portrait photos: `public/images/profile-transparent.png`, `profile.jpg`, `profile-square.*`.
- CV: `public/cv/CV_Mohamed_Neji_Benzarti.pdf` (owner-provided, never edited).
- Certificates (publication authorized): `public/images/certificates/certificate-ai-optimus.png`, `tcf-b2.png`, still to be added by the owner. CCNA via Credly.
- Live sites for project screenshots: mustawfi.com, takween.com.kw, plagediscount.com.
- Key figures: 4 countries · 5+ production projects · Engineer, ESPRIT.
- **Absent, never to be fabricated:** testimonials, client logos beyond the named employers, metrics, user counts, revenue or performance numbers, awards.

## Product Principles

1. Prove, don't claim: show the real products and the real path.
2. Five-second clarity: name, role and location before anything else.
3. Every language is first-class: Arabic is a designed RTL experience, not a mirrored afterthought.
4. Performance is part of the pitch: a full stack developer's own site must be fast and accessible.
5. Contact is always one step away.

## Accessibility & Inclusion

WCAG 2.2 AA: contrast, keyboard navigation, visible focus, skip link, alt text, `prefers-reduced-motion` respected everywhere (3D included), true RTL for Arabic readers.
