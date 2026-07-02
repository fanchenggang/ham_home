import { defineConfig, devices } from "@playwright/test";
import path from "path";
import { E2E_PROJECTS } from "./helpers/variants";

/**
 * Playwright E2E 配置 - HamHome 浏览器扩展
 *
 * 设计要点：
 * 1. 测试对象是“已构建产物”（.output/chrome-mv3），而非源码，确保测得的是真实打包后的扩展。
 * 2. 通过 globalSetup 在跑测试前自动构建扩展，避免忘记 build 导致测旧代码。
 * 3. 浏览器扩展必须以「持久化上下文 + 加载扩展参数」启动，相关逻辑收敛在 fixtures.ts。
 * 4. 报告默认输出 HTML（带截图/trace），满足“带截图的测试报告”诉求。
 */
export default defineConfig({
  // 测试用例目录
  testDir: "./tests",
  testMatch: "**/*.spec.ts",

  // 构建扩展（产物缺失时）后再开始测试
  globalSetup: "./global-setup.ts",

  // 单个用例超时（扩展首屏 + 存储初始化可能略慢）
  timeout: 60_000,
  expect: { timeout: 10_000 },

  // 本地默认串行，便于稳定截图；CI 上禁止 test.only 漏提交
  fullyParallel: false,
  workers: 1,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,

  // 报告：HTML（带截图）+ 终端 list
  reporter: [
    ["list"],
    ["html", { outputFolder: "playwright-report", open: "never" }],
  ],

  // 失败用例的产物输出目录
  outputDir: "./test-results",

  use: {
    // 失败时保留截图与 trace，HTML 报告中可直接查看
    screenshot: "only-on-failure",
    trace: "retain-on-failure",
    video: "retain-on-failure",
  },

  projects: [
    {
      name: E2E_PROJECTS.default,
      testIgnore: "**/tab-auto-group-desktop.spec.ts",
      use: {
        ...devices["Desktop Chrome"],
      },
    },
    {
      name: E2E_PROJECTS.english,
      testIgnore: "**/tab-auto-group-desktop.spec.ts",
      use: {
        ...devices["Desktop Chrome"],
      },
    },
    {
      name: E2E_PROJECTS.dark,
      testIgnore: "**/tab-auto-group-desktop.spec.ts",
      use: {
        ...devices["Desktop Chrome"],
      },
    },
    {
      name: E2E_PROJECTS.desktop,
      testMatch: "**/tab-auto-group-desktop.spec.ts",
      use: {
        ...devices["Desktop Chrome"],
      },
    },
  ],
});

/** 构建产物（Chrome MV3）目录，供 fixtures 加载扩展使用 */
export const CHROME_MV3_DIR = path.resolve(__dirname, "../.output/chrome-mv3");
