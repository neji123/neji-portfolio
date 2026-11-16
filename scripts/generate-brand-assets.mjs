// Renders the Open Graph images (one per locale) and the app icons from the running production
// build, so they use the site's own fonts, colours and globe. A real browser draws them:
// next/og (Satori) cannot shape Arabic. Run after `npm run build`:
//
//   npm run start -- --port 3100      (in another terminal)
//   node scripts/generate-brand-assets.mjs http://localhost:3100
//
// Writes public/og/og-{locale}.png, public/icons/*.png, src/app/icon.png,
// src/app/apple-icon.png and src/app/favicon.ico. Commit the results.
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { chromium } from "@playwright/test";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const BASE = (process.argv[2] ?? "http://localhost:3100").replace(/\/+$/, "");
const LOCALES = ["en", "fr", "ar"];
const OG = { width: 1200, height: 630 };

/** The Night Route tokens the assets use (src/styles/globals.css). */
const NIGHT = {
  ground: "#0c1a2c",
  deep: "#07111e",
  ink: "#eef0ea",
  muted: "#a9b4c2",
  route: "#f0609e",
};

async function save(path, data) {
  const target = join(ROOT, path);
  await mkdir(dirname(target), { recursive: true });
  await writeFile(target, data);
  console.warn(`wrote ${path} (${Math.round(data.length / 1024)} KB)`);
}

/** Waits for the page's fonts, then gives the layout a frame to settle. */
async function settle(page) {
  await page.evaluate(async () => {
    await document.fonts.ready;
    await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
  });
}

/**
 * The share card: the hero's words at the reading start, the route globe rising from the
 * reading end, on the night sky. Built inside the real page, so its @font-face rules apply.
 */
async function openGraph(page, locale) {
  await page.goto(`${BASE}/${locale}`, { waitUntil: "networkidle" });
  await settle(page);
  await page.evaluate(
    ({ night, size }) => {
      const rtl = document.documentElement.dir === "rtl";
      const arabic = document.documentElement.lang === "ar";
      const globe = document.querySelector(".globe-frame svg")?.cloneNode(true);
      const name = document.querySelector("#hero-title")?.textContent?.trim() ?? "";
      const [title, , place] = Array.from(document.querySelectorAll("#top p")).map(
        (node) => node.textContent?.trim() ?? "",
      );
      const card = document.createElement("div");
      card.style.cssText = `position:fixed;inset:0;z-index:2147483647;width:${size.width}px;height:${size.height}px;overflow:hidden;
        background:radial-gradient(120% 90% at 50% 110%, ${night.ground} 30%, ${night.deep} 100%);color:${night.ink};`;
      if (globe instanceof SVGElement) {
        globe.removeAttribute("class");
        globe.querySelectorAll(".globe-pulse").forEach((ring) => ring.removeAttribute("class"));
        globe.style.cssText = `position:absolute;width:880px;height:880px;top:118px;${rtl ? "left" : "right"}:-250px;`;
        card.append(globe);
      }
      const vignette = document.createElement("div");
      vignette.style.cssText =
        "position:absolute;inset:0;background:radial-gradient(130% 100% at 50% 45%, transparent 55%, rgb(7 17 30 / 0.6) 100%);";
      card.append(vignette);
      const text = document.createElement("div");
      text.style.cssText = `position:absolute;top:0;bottom:0;${rtl ? "right" : "left"}:76px;width:640px;display:flex;flex-direction:column;justify-content:center;gap:26px;`;
      text.innerHTML = `
        <div style="position:absolute;inset:120px -40px;background:rgb(12 26 44 / 0.62);filter:blur(36px);border-radius:48px;z-index:-1"></div>
        <svg width="132" height="16" viewBox="0 0 132 16" aria-hidden="true" style="${rtl ? "transform:scaleX(-1)" : ""}">
          <path d="M4 12 Q 66 -4 124 8" fill="none" stroke="${night.route}" stroke-width="3" stroke-linecap="round"/>
          <circle cx="124" cy="8" r="5" fill="${night.route}"/>
        </svg>
        <p style="margin:0;font-size:${arabic ? 70 : 82}px;line-height:${arabic ? 1.3 : 0.95};font-weight:${arabic ? 600 : 640};font-stretch:112%;letter-spacing:${arabic ? 0 : "-0.03em"};text-wrap:balance"></p>
        <p style="margin:0;font-size:${arabic ? 28 : 31}px;line-height:${arabic ? 1.7 : 1.3};font-weight:500;text-wrap:balance;max-width:20em"></p>
        <p style="margin:0;font-size:22px;line-height:1.5;color:${night.muted}"></p>`;
      const [nameNode, titleNode, placeNode] = text.querySelectorAll("p");
      nameNode.textContent = name;
      titleNode.textContent = title ?? "";
      placeNode.textContent = place ?? "";
      card.append(text);
      document.body.append(card);
    },
    { night: NIGHT, size: OG },
  );
  await settle(page);
  // Text check instead of looking at the picture: the words must sit inside the card.
  const bounds = await page.evaluate(() => {
    const block = document.querySelector("body > div:last-child > div:last-child");
    const box = block.getBoundingClientRect();
    const lines = Array.from(block.querySelectorAll("p")).map((p) => {
      const range = document.createRange();
      range.selectNodeContents(p);
      return new Set(Array.from(range.getClientRects()).map((r) => Math.round(r.top))).size;
    });
    const words = Array.from(block.querySelectorAll("p")).map((p) => p.getBoundingClientRect());
    return {
      top: Math.round(Math.min(...words.map((r) => r.top))),
      bottom: Math.round(Math.max(...words.map((r) => r.bottom))),
      left: Math.round(box.left),
      right: Math.round(box.right),
      lines,
      fonts: document.fonts.check("700 40px Archivo") || document.fonts.status,
    };
  });
  console.warn(`og-${locale}: text ${JSON.stringify(bounds)}`);
  if (bounds.top < 24 || bounds.bottom > OG.height - 24)
    throw new Error(`og-${locale}: text overflows`);
  return page.screenshot({ clip: { x: 0, y: 0, ...OG }, type: "png" });
}

/**
 * The "MNB" monogram: chart-white letters on the night, the route's magenta stop beside them.
 * `padding` keeps maskable icons inside the platform's safe zone; `radius` rounds tab icons.
 */
async function monogram(page, size, { radius = 0.22, padding = 0.14 } = {}) {
  await page.setViewportSize({ width: size, height: size });
  await page.evaluate(
    ({ night, size, radius, padding }) => {
      document.querySelector("#brand-icon")?.remove();
      // Only the icon shows, on a transparent page: rounded corners stay see-through (RGBA).
      document.documentElement.style.background = "transparent";
      document.body.style.background = "transparent";
      document.body.style.visibility = "hidden";
      const icon = document.createElement("div");
      icon.id = "brand-icon";
      const inner = size * (1 - padding * 2);
      icon.style.cssText = `position:fixed;inset:0;z-index:2147483647;width:${size}px;height:${size}px;display:grid;place-items:center;
        background:${night.ground};border-radius:${radius * size}px;visibility:visible;`;
      icon.innerHTML = `<div style="position:relative;display:flex;align-items:baseline;justify-content:center;width:${inner}px;
        font-family:var(--font-archivo),sans-serif;font-weight:700;font-stretch:100%;letter-spacing:-0.045em;line-height:1;
        font-size:${inner * 0.43}px;color:${night.ink}">MNB<span style="display:block;width:${inner * 0.1}px;height:${inner * 0.1}px;
        margin-inline-start:${inner * 0.04}px;border-radius:50%;background:${night.route}"></span></div>`;
      document.body.append(icon);
      // Scale the letters (and the stop) down until the group fits the inner box.
      const group = icon.firstElementChild;
      group.style.width = "auto";
      const fit = Math.min(1, inner / group.getBoundingClientRect().width);
      group.style.fontSize = `${inner * 0.43 * fit}px`;
      const stop = group.lastElementChild;
      stop.style.width = stop.style.height = `${inner * 0.1 * fit}px`;
    },
    { night: NIGHT, size, radius, padding },
  );
  await settle(page);
  return page.screenshot({
    clip: { x: 0, y: 0, width: size, height: size },
    type: "png",
    omitBackground: radius > 0,
  });
}

/** A .ico holding PNG images (supported by every current browser). */
function ico(pngs) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(pngs.length, 4);
  let offset = 6 + pngs.length * 16;
  const entries = pngs.map(({ size, data }) => {
    const entry = Buffer.alloc(16);
    entry.writeUInt8(size >= 256 ? 0 : size, 0);
    entry.writeUInt8(size >= 256 ? 0 : size, 1);
    entry.writeUInt16LE(1, 4);
    entry.writeUInt16LE(32, 6);
    entry.writeUInt32LE(data.length, 8);
    entry.writeUInt32LE(offset, 12);
    offset += data.length;
    return entry;
  });
  return Buffer.concat([header, ...entries, ...pngs.map(({ data }) => data)]);
}

const browser = await chromium.launch();
try {
  const page = await browser.newPage({
    viewport: OG,
    deviceScaleFactor: 1,
    reducedMotion: "reduce",
  });
  for (const locale of LOCALES)
    await save(`public/og/og-${locale}.png`, await openGraph(page, locale));

  await page.goto(`${BASE}/en`, { waitUntil: "networkidle" });
  const favicons = [];
  for (const size of [16, 32, 48]) {
    favicons.push({ size, data: await monogram(page, size, { padding: 0.04, radius: 0.2 }) });
  }
  await save("src/app/favicon.ico", ico(favicons));
  await save("src/app/icon.png", await monogram(page, 192));
  // iOS rounds the corners itself and wants no transparency.
  await save("src/app/apple-icon.png", await monogram(page, 180, { radius: 0 }));
  await save("public/icons/icon-192.png", await monogram(page, 192));
  await save("public/icons/icon-512.png", await monogram(page, 512));
  // Maskable: full bleed, the monogram inside the central safe zone.
  await save(
    "public/icons/icon-maskable-512.png",
    await monogram(page, 512, { radius: 0, padding: 0.24 }),
  );
} finally {
  await browser.close();
}
