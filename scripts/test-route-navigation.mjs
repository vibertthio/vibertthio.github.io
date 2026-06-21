import { chromium, expect } from "@playwright/test";
import { spawn } from "node:child_process";

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

  await page.goto(`${baseUrl}/#/p/good-taste-widens-my-enjoyment-bandwidth`, { waitUntil: "networkidle" });
  const navigationPromise = page.waitForNavigation({ timeout: 1000 }).catch(() => null);
  await page.locator(".pn-card.next").click();
  const navigation = await navigationPromise;
  if (navigation) throw new Error("Post-to-post navigation should not reload the document.");
  await expect(page).toHaveURL(/#\/p\/build-better-taste-step-1$/);
  await expect(page.getByRole("heading", { name: "Build Better Taste, Step 1" })).toBeVisible();
  await expect(page.locator(".post")).not.toContainText("By adopting different aesthetics");

  await browser.close();
} finally {
  server.kill();
}
