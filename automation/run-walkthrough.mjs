import { execFileSync } from "node:child_process";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { chromium } from "playwright";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const demoDir = path.resolve(__dirname, "../demo");
const framesDir = path.join(demoDir, "frames");
const baseUrl = process.env.BASE_URL ?? "http://127.0.0.1:3000";

const viewport = {
  width: 1600,
  height: 900,
};

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function resetOutputDirs() {
  await fs.mkdir(demoDir, { recursive: true });
  await fs.rm(framesDir, { recursive: true, force: true });
  await fs.mkdir(framesDir, { recursive: true });
}

async function captureFrame(page, index, label) {
  const safeLabel = label.replace(/[^a-z0-9]+/gi, "-").toLowerCase();
  const framePath = path.join(
    framesDir,
    `${String(index).padStart(2, "0")}-${safeLabel}.png`,
  );
  await page.screenshot({
    path: framePath,
    fullPage: false,
  });
}

async function smoothScroll(page, distance, steps = 8, delay = 260) {
  const increment = distance / steps;
  for (let index = 0; index < steps; index += 1) {
    await page.mouse.wheel(0, increment);
    await wait(delay);
  }
}

async function clickTab(page, name) {
  await page.getByRole("button", { name }).click();
  await wait(1100);
}

async function clickSidebarFilter(page, name) {
  await page
    .locator("aside")
    .getByRole("button", { name, exact: true })
    .click();
  await wait(900);
}

async function main() {
  await resetOutputDirs();

  const browser = await chromium.launch({
    headless: true,
  });

  const context = await browser.newContext({
    viewport,
    screen: viewport,
    recordVideo: {
      dir: demoDir,
      size: viewport,
    },
    colorScheme: "light",
  });

  const page = await context.newPage();
  const video = page.video();

  try {
    await page.goto(baseUrl, {
      waitUntil: "networkidle",
    });
    await wait(4200);
    await captureFrame(page, 1, "overview");
    await wait(1800);

    await clickTab(page, "Weekly Updates");
    await page.getByPlaceholder("Search model, workflow, or business value").fill(
      "Excel",
    );
    await wait(2200);
    await captureFrame(page, 2, "updates-search");
    await wait(1600);

    await page
      .getByRole("button", {
        name: /Introducing ChatGPT for Excel/i,
      })
      .click();
    await wait(4200);
    await captureFrame(page, 3, "excel-card");
    await wait(1400);

    await clickSidebarFilter(page, "Workflow Integration");
    await page.getByPlaceholder("Search model, workflow, or business value").fill(
      "",
    );
    await wait(1400);
    await clickSidebarFilter(page, "Chatgpt Rollout");
    await page
      .getByRole("button", {
        name: /GPT-5\.4 Thinking in ChatGPT/i,
      })
      .click();
    await wait(4200);
    await captureFrame(page, 4, "chatgpt-rollout-card");
    await wait(1400);

    await clickSidebarFilter(page, "All");
    await page
      .getByRole("button", {
        name: /Codex app on Windows/i,
      })
      .click();
    await wait(4200);
    await captureFrame(page, 5, "windows-card");
    await wait(1600);

    await clickTab(page, "Business Implications");
    await smoothScroll(page, 980, 12, 300);
    await wait(2200);
    await captureFrame(page, 6, "implications");
    await wait(1600);

    await clickTab(page, "Use Cases");
    await smoothScroll(page, 760, 10, 280);
    await wait(2200);
    await captureFrame(page, 7, "use-cases");
    await wait(1600);

    await clickTab(page, "About");
    await wait(3200);
    await captureFrame(page, 8, "about");
    await wait(1600);

    await clickTab(page, "Overview");
    await wait(5000);
    await captureFrame(page, 9, "return-overview");
  } finally {
    await context.close();
    await browser.close();
  }

  const videoPath = await video.path();
  const mp4Path = path.join(demoDir, "ai_weekly_brief_demo.mp4");
  const webmPath = path.join(demoDir, "ai_weekly_brief_demo.webm");

  await fs.copyFile(videoPath, webmPath);

  execFileSync("ffmpeg", [
    "-y",
    "-i",
    webmPath,
    "-vf",
    "scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2,fps=30",
    "-c:v",
    "libx264",
    "-preset",
    "medium",
    "-pix_fmt",
    "yuv420p",
    "-movflags",
    "+faststart",
    "-an",
    mp4Path,
  ]);

  console.log(
    JSON.stringify(
      {
        baseUrl,
        video: mp4Path,
        video_webm: webmPath,
        frames: framesDir,
      },
      null,
      2,
    ),
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
