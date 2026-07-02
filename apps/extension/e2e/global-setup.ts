import { execSync } from "child_process";
import fs from "fs";
import path from "path";

const EXTENSION_ROOT = path.resolve(__dirname, "..");
const CHROME_MV3_DIR = path.join(EXTENSION_ROOT, ".output/chrome-mv3");

/**
 * 全局前置：确保被测的 Chrome MV3 扩展产物存在。
 *
 * - 默认：产物不存在时自动执行 `pnpm build` 构建一次。
 * - 设置环境变量 E2E_SKIP_BUILD=1 可跳过构建（用于已手动构建、想快速迭代测试的场景）。
 * - 设置 E2E_FORCE_BUILD=1 可强制重新构建。
 */
async function globalSetup() {
  const manifest = path.join(CHROME_MV3_DIR, "manifest.json");
  const exists = fs.existsSync(manifest);

  if (process.env.E2E_SKIP_BUILD === "1") {
    if (!exists) {
      throw new Error(
        `[e2e] E2E_SKIP_BUILD=1 但未找到扩展产物：${manifest}\n请先运行 pnpm build。`,
      );
    }
    console.log("[e2e] 跳过构建，复用现有产物：", CHROME_MV3_DIR);
    return;
  }

  if (exists && process.env.E2E_FORCE_BUILD !== "1") {
    console.log("[e2e] 检测到已存在扩展产物，跳过构建：", CHROME_MV3_DIR);
    console.log("[e2e] 如需重新构建请设置 E2E_FORCE_BUILD=1");
    return;
  }

  console.log("[e2e] 构建 Chrome MV3 扩展产物中（pnpm build）...");
  execSync("pnpm build", { cwd: EXTENSION_ROOT, stdio: "inherit" });

  if (!fs.existsSync(manifest)) {
    throw new Error(`[e2e] 构建结束但未找到 manifest：${manifest}`);
  }
  console.log("[e2e] 构建完成：", CHROME_MV3_DIR);
}

export default globalSetup;
