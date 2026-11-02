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
