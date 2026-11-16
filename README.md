# Mohamed Neji Benzarti · Portfolio

Personal portfolio: Next.js 16 (App Router), TypeScript strict, Tailwind CSS v4, next-intl (EN / FR / AR with RTL), GSAP + Lenis, React Three Fiber. Frontend only, no backend.

## Getting started

Requires Node 20 (see `.nvmrc`).

```bash
npm install
cp .env.example .env.local   # then fill in the values
npm run dev
```

## Environment variables

Put them in `.env.local` at the project root (not in `public/`, which is served to everyone). Both are `NEXT_PUBLIC_` values, inlined into the client bundle at build time, so rebuild after changing them.

| Variable                    | Used for                                                                                                                                                                                                        |
| --------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_WEB3FORMS_KEY` | Access key of the [Web3Forms](https://web3forms.com) form that delivers the contact form to the inbox. If it is missing, the form shows a `mailto:` link pre-filled with the visitor's message instead.         |
| `NEXT_PUBLIC_SITE_URL`      | Public origin of the site, without a trailing slash (e.g. `https://example.com`). Used for canonical URLs, Open Graph, the sitemap and the QR code in the Contact section. Defaults to `http://localhost:3000`. |

Spam protection: honeypot, a 10-second time trap, a 10-minute cooldown after a send, and an invisible hCaptcha (Web3Forms' free shared sitekey, nothing to configure). The form posts `FormData`, with the token in `h-captcha-response`.

> **hCaptcha cannot be tested on localhost; enable hCaptcha + Strict in the Web3Forms dashboard after deployment and test on the live domain.**
>
> On the dev server (`npm run dev` on localhost / 127.0.0.1) hCaptcha is not loaded and the form sends without a token. With hCaptcha + Strict on, Web3Forms rejects those local sends: test locally with hCaptcha off, or with a second access key kept for development. A production build (`npm run build`) always loads and requires hCaptcha.

On Vercel, set both in Project Settings → Environment Variables. When deploying, only `NEXT_PUBLIC_SITE_URL` needs to change.

## Scripts

| Command                           | What it does                                                                          |
| --------------------------------- | ------------------------------------------------------------------------------------- |
| `npm run dev`                     | Development server                                                                    |
| `npm run build` / `npm run start` | Production build and server                                                           |
| `npm run lint`                    | ESLint                                                                                |
| `npm run typecheck`               | Route types + `tsc` (also checks that FR and AR have every key of `messages/en.json`) |
| `npm run test:e2e`                | Playwright against the production build                                               |

## Testing

`npm run build` first: the suite runs against the production build on port 3100 (Playwright starts it), plus `next dev` on 3101 for the one dev-only contact test.

- **One worker**, one browser at a time, so the machine stays cool.
- Every test runs with **reduced motion and WebGL off** (`--disable-3d-apis`): the static globe stays and there are no fades to wait for. A single test, `tests/e2e/globe.webgl.ts` (project `globe`), loads the real 3D globe and fails on any console error.
- Every page test runs in EN, FR and AR, on desktop (1440×900) and mobile (Pixel 7). Any console error fails a test; the mail service and WhatsApp are never reached and hCaptcha is a stand-in.
- Run only what you are working on, without booting `next dev`:

```bash
E2E_DEV_SERVER=0 npx playwright test tests/e2e/certificates.spec.ts
```

## The 3D globe

One fixed WebGL canvas behind the page, lazy-loaded (`next/dynamic`, `ssr: false`) over a server-rendered SVG globe.

- **Desktop:** it starts once the page is idle after load.
- **Phones** (narrow or coarse pointer): on the first touch, scroll or key, or 2.5 s after load, then at the next idle moment. Its first frame sits where the static globe is drawn and glides to the section in view, under a cross-fade. With reduced motion, phones keep the static globe.
- Not loaded at all without WebGL, on Save-Data, or on devices with ≤ 2 cores or ≤ 2 GB of memory.

## Social images and icons

`scripts/generate-brand-assets.mjs` renders the Open Graph images (`public/og/og-{en,fr,ar}.png`, 1200×630) and the app icons from the running production build, in a real browser (so the Arabic is shaped correctly). Rerun it after changing the name, title or palette:

```bash
npm run build && npm run start -- --port 3100   # in another terminal
node scripts/generate-brand-assets.mjs http://localhost:3100
```
