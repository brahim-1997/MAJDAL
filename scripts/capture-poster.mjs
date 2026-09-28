/**
 * Captures public/land/poster.webp — the still that holds the film's stage
 * until WebGL is ready, and wherever it never is. It is the live render of
 * the first frame (the whole land, risen), so the handover is invisible.
 *
 *   npm run dev   # in another terminal
 *   node scripts/capture-poster.mjs [http://localhost:3000]
 *
 * Needs Playwright with a Chromium that can run WebGL (SwiftShader is fine).
 * It is not a project dependency: install it where you run this, or point
 * PLAYWRIGHT_MODULE at an installed copy's index.mjs.
 */
import { writeFileSync } from "node:fs";

const { chromium } = await import(process.env.PLAYWRIGHT_MODULE ?? "playwright").catch(() => {
  console.error("Playwright not found: npm i --no-save playwright, or set PLAYWRIGHT_MODULE.");
  process.exit(1);
});

const url = process.argv[2] ?? "http://localhost:3000";
const W = 1600, H = 1000;

const browser = await chromium.launch({
  args: ["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist"],
});
const page = await browser.newPage({ viewport: { width: W, height: H } });
await page.emulateMedia({ reducedMotion: "reduce" }); // risen at once
await page.goto(url, { waitUntil: "networkidle" });
await page.waitForSelector('.lf[data-status="live"]', { timeout: 90_000 });
await page.addStyleTag({ content: ".hdr, .lf__stage > :not(canvas), nextjs-portal { display: none !important; }" });
await page.waitForTimeout(1500);
const png = await page.locator(".lf__canvas").screenshot();

// PNG → WebP in the browser: no image dependency in the repo.
const b64 = await page.evaluate(async (src) => {
  const img = new Image();
  img.src = `data:image/png;base64,${src}`;
  await img.decode();
  const cv = document.createElement("canvas");
  cv.width = img.width;
  cv.height = img.height;
  cv.getContext("2d").drawImage(img, 0, 0);
  return cv.toDataURL("image/webp", 0.72).split(",")[1];
}, png.toString("base64"));
writeFileSync(new URL("../public/land/poster.webp", import.meta.url), Buffer.from(b64, "base64"));
console.log("public/land/poster.webp", Math.round((b64.length * 3) / 4 / 1024), "KB");
await browser.close();
