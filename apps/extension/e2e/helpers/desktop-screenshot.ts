import { execFile } from "child_process";
import { mkdir, readFile } from "fs/promises";
import path from "path";
import { promisify } from "util";
import type { TestInfo } from "@playwright/test";

const execFileAsync = promisify(execFile);
const APPLE_SCRIPT_TIMEOUT = 3_000;
const SCREENSHOT_TIMEOUT = 10_000;

interface DesktopScreenshotOptions {
  name: string;
  appName?: string;
  required?: boolean;
}

interface WindowBounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

export function desktopScreenshotTestEnabled(): boolean {
  return (
    process.env.HEADED === "1" && process.env.E2E_DESKTOP_SCREENSHOT === "1"
  );
}

export function desktopScreenshotStrictEnabled(): boolean {
  return process.env.E2E_DESKTOP_SCREENSHOT_REQUIRED === "1";
}

export async function attachDesktopScreenshot(
  testInfo: TestInfo,
  options: DesktopScreenshotOptions,
): Promise<string | null> {
  if (!desktopScreenshotTestEnabled()) {
    if (options.required) {
      throw new Error(
        "整窗截图需要设置 HEADED=1 E2E_DESKTOP_SCREENSHOT=1。",
      );
    }
    return null;
  }

  if (process.platform !== "darwin") {
    if (options.required) {
      throw new Error("整窗截图 helper 当前仅支持 macOS screencapture。");
    }
    return null;
  }

  const appName = options.appName ?? process.env.E2E_DESKTOP_APP_NAME;
  const outputDir = testInfo.outputPath("desktop-screenshots");
  await mkdir(outputDir, { recursive: true });

  const outputPath = path.join(
    outputDir,
    `${sanitizeFileName(options.name)}.png`,
  );

  try {
    await wait(500);

    const bounds = appName
      ? await focusAndGetFrontWindowBounds(appName).catch(() => null)
      : null;
    if (bounds) {
      await captureRegion(outputPath, bounds);
    } else {
      await captureScreen(outputPath);
    }

    await testInfo.attach(options.name, {
      body: await readFile(outputPath),
      contentType: "image/png",
    });

    return outputPath;
  } catch (error) {
    await attachDiagnostic(
      testInfo,
      options.name,
      `整窗截图失败：${formatError(error)}`,
    );
    if (options.required) {
      throw new Error(`整窗截图失败：${formatError(error)}`);
    }
    return null;
  }
}

function sanitizeFileName(value: string): string {
  return value.replace(/[^\w.-]+/g, "-").replace(/^-+|-+$/g, "") || "desktop";
}

async function focusApplication(appName: string): Promise<void> {
  await execFileAsync(
    "osascript",
    [
      "-e",
      `tell application "${escapeAppleScriptString(appName)}" to activate`,
    ],
    { timeout: APPLE_SCRIPT_TIMEOUT },
  );
}

async function focusAndGetFrontWindowBounds(
  appName: string,
): Promise<WindowBounds> {
  await focusApplication(appName);
  await wait(500);
  return getFrontWindowBounds(appName);
}

async function getFrontWindowBounds(appName: string): Promise<WindowBounds> {
  const processName = escapeAppleScriptString(appName);
  const script = `
tell application "System Events"
  tell process "${processName}"
    if not (exists window 1) then error "No browser window found"
    set frontmost to true
    set windowPosition to position of window 1
    set windowSize to size of window 1
    return (item 1 of windowPosition as integer) & "," & (item 2 of windowPosition as integer) & "," & (item 1 of windowSize as integer) & "," & (item 2 of windowSize as integer)
  end tell
end tell
`;

  const { stdout } = await execFileAsync("osascript", ["-e", script], {
    timeout: APPLE_SCRIPT_TIMEOUT,
  });
  const [x, y, width, height] = stdout.trim().split(",").map(Number);
  if ([x, y, width, height].some(Number.isNaN) || width <= 0 || height <= 0) {
    throw new Error(`Invalid ${appName} window bounds: ${stdout.trim()}`);
  }
  return { x, y, width, height };
}

async function captureRegion(
  outputPath: string,
  bounds: WindowBounds,
): Promise<void> {
  await execFileAsync(
    "screencapture",
    [
      "-x",
      "-R",
      `${bounds.x},${bounds.y},${bounds.width},${bounds.height}`,
      outputPath,
    ],
    { timeout: SCREENSHOT_TIMEOUT },
  );
}

async function captureScreen(outputPath: string): Promise<void> {
  await execFileAsync("screencapture", ["-x", outputPath], {
    timeout: SCREENSHOT_TIMEOUT,
  });
}

function escapeAppleScriptString(value: string): string {
  return value.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

function formatError(error: unknown): string {
  if (error instanceof Error) return error.message;
  return String(error);
}

async function attachDiagnostic(
  testInfo: TestInfo,
  name: string,
  message: string,
): Promise<void> {
  await testInfo.attach(`${name}-diagnostic`, {
    body: message,
    contentType: "text/plain",
  });
}

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
