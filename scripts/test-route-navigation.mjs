import { chromium, expect } from "@playwright/test";
import { spawn } from "node:child_process";
import fs from "node:fs/promises";

const port = 4174;
const baseUrl = `http://127.0.0.1:${port}`;

function startPreviewServer() {
  const server = spawn("npx", ["vite", "preview", "--host", "127.0.0.1", "--port", String(port)], {
    stdio: ["ignore", "pipe", "pipe"],
  });

  let output = "";
  const ready = new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      reject(new Error(`Timed out waiting for Vite preview server.\n${output}`));
    }, 15000);

    const onData = (chunk) => {
      output += chunk.toString();
      if (output.includes(`http://127.0.0.1:${port}/`)) {
        clearTimeout(timeout);
        resolve();
      }
    };

    server.stdout.on("data", onData);
    server.stderr.on("data", onData);
    server.on("exit", (code) => {
      clearTimeout(timeout);
      reject(new Error(`Vite preview exited early with code ${code}.\n${output}`));
    });
  });

  return { server, ready };
}

const { server, ready } = startPreviewServer();

try {
  await ready;

  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 900, height: 900 } });
  const unlistedSlug = "relaxation-became-another-todo";
  const unlistedLink = `a[href="#/p/${unlistedSlug}"]`;

  await page.goto(`${baseUrl}/#/p/good-taste-widens-my-enjoyment-bandwidth`, { waitUntil: "networkidle" });
  await expect(page.locator(unlistedLink)).toHaveCount(0);
  const navigationPromise = page.waitForNavigation({ timeout: 1000 }).catch(() => null);
  await page.locator(".pn-card.next").click();
  const navigation = await navigationPromise;
  if (navigation) throw new Error("Post-to-post navigation should not reload the document.");
  await expect(page).toHaveURL(/#\/p\/build-better-taste-step-1$/);
  await expect(page.getByRole("heading", { name: "Build Better Taste, Step 1" })).toBeVisible();
  await expect(page.locator(".post")).not.toContainText("By adopting different aesthetics");

  await page.goto(baseUrl, { waitUntil: "networkidle" });
  await expect(page.locator(unlistedLink)).toHaveCount(0);
  const listedCount = await page.locator(".feed .row").count();
  await expect(page.locator(".chip.all .n")).toHaveText(String(listedCount));

  await page.goto(`${baseUrl}/#/tag/post`, { waitUntil: "networkidle" });
  await expect(page.locator(unlistedLink)).toHaveCount(0);
  await expect(page.locator('.chips a[href="#/tag/post"] .n')).toHaveText(
    String(await page.locator(".feed .row").count()),
  );

  const rss = await page.request.get(`${baseUrl}/rss.xml`);
  expect(rss.ok()).toBe(true);
  const rssText = await rss.text();
  expect(rssText).not.toContain(unlistedSlug);
  expect(rssText).toContain("good-taste-widens-my-enjoyment-bandwidth");

  await page.goto(`${baseUrl}/#/p/${unlistedSlug}`, { waitUntil: "networkidle" });
  await expect(page.getByRole("heading", { name: "為了放鬆，我又多了一件待辦事項", exact: true })).toBeVisible();
  await expect(page.locator(".post-body")).toContainText("寫日記，也就是 journaling");
  await expect(page.locator(".post-body")).toContainText("自己像風一樣。");
  await expect(page.locator(".pn-card")).toHaveCount(0);
  await fs.mkdir("screenshots", { recursive: true });
  await page.screenshot({ path: "screenshots/relaxation-desktop.png", fullPage: true });

  await page.setViewportSize({ width: 390, height: 844 });
  await expect(page.getByRole("heading", { name: "為了放鬆，我又多了一件待辦事項", exact: true })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  await page.screenshot({ path: "screenshots/relaxation-mobile.png", fullPage: true });

  await browser.close();
} finally {
  server.kill();
}
