import { chromium } from "@playwright/test";
import fs from "node:fs/promises";

const baseUrl = process.env.SITE_URL || "http://127.0.0.1:4173";
const outputDir = "screenshots";

await fs.mkdir(outputDir, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });

await page.goto(baseUrl, { waitUntil: "networkidle" });
await page.screenshot({ path: `${outputDir}/home.png`, fullPage: true });

await page.goto(`${baseUrl}/#/tag/taste`, { waitUntil: "networkidle" });
await page.screenshot({ path: `${outputDir}/tag-taste.png`, fullPage: true });

await page.goto(`${baseUrl}/#/p/build-better-taste-step-1`, { waitUntil: "networkidle" });
await page.screenshot({ path: `${outputDir}/build-better-taste-step-1.png`, fullPage: true });

await page.getByRole("link", { name: "Good Taste Widens My Enjoyment Bandwidth" }).click();
await page.waitForURL("**/#/p/good-taste-widens-my-enjoyment-bandwidth");
await page.getByRole("heading", { name: "Good Taste Widens My Enjoyment Bandwidth" }).waitFor();
await page.screenshot({ path: `${outputDir}/good-taste-widens-my-enjoyment-bandwidth.png`, fullPage: true });

await page.getByRole("link", { name: "Build Better Taste, Step 1" }).click();
await page.waitForURL("**/#/p/build-better-taste-step-1");
await page.getByRole("heading", { name: "Build Better Taste, Step 1" }).waitFor();
await page.screenshot({ path: `${outputDir}/taste-crosslink-back.png`, fullPage: true });

await browser.close();
