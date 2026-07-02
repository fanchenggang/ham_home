import { defineConfig, devices } from "@playwright/test";
import path from "path";
import { E2E_PROJECTS } from "../helpers/variants";

const SCREENSHOT_DIR = path.resolve(__dirname, "../../output/screenshots");
const TEST_RESULTS_DIR = path.resolve(
  __dirname,
  "../../output/screenshots-test-results",
);

export default defineConfig({
  testDir: ".",
  testMatch: "marketing-screenshots.spec.ts",
  globalSetup: "../global-setup.ts",
  timeout: 120_000,
  expect: { timeout: 15_000 },
  fullyParallel: false,
  workers: 1,
  retries: 0,
  reporter: [["list"]],
  outputDir: TEST_RESULTS_DIR,
  use: {
    screenshot: "off",
    trace: "off",
    video: "off",
  },
  metadata: {
    screenshotDir: SCREENSHOT_DIR,
  },
  projects: [
    {
      name: E2E_PROJECTS.default,
      use: {
        ...devices["Desktop Chrome"],
      },
    },
    {
      name: E2E_PROJECTS.dark,
      use: {
        ...devices["Desktop Chrome"],
      },
    },
    {
      name: E2E_PROJECTS.english,
      use: {
        ...devices["Desktop Chrome"],
      },
    },
    {
      name: E2E_PROJECTS.englishDark,
      use: {
        ...devices["Desktop Chrome"],
      },
    },
  ],
});
