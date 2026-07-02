import { test, expect, extPageUrl } from "../fixtures";
import {
  E2E_EXTENSION_CONFIG,
  shouldInjectE2EExtensionConfig,
} from "../e2e.config";

/**
 * 示例 E2E 用例：扩展主页面（app.html）能正常加载并渲染。
 *
 * 这是测试基建的“冒烟用例”，用于验证：
 *   - 扩展能被正确加载（拿到 extensionId）；
 *   - 主页面能打开且 React 应用挂载成功；
 *   - 侧边栏品牌「HamHome」正常显示。
 *
 * 后续可在 tests/ 下按页面/功能继续补充用例，无需改动基建。
 */
test.describe("扩展主页面 app.html", () => {
  test("自动注入 AI、向量与变体基础配置", async ({
    context,
    extensionId,
    e2eVariant,
  }) => {
    test.skip(
      !shouldInjectE2EExtensionConfig(),
      "E2E_INJECT_AI_CONFIG=0 时跳过自动注入断言。",
    );

    const page = await context.newPage();
    await page.goto(extPageUrl(extensionId, "app.html"));

    const config = await page.evaluate(async () => {
      return chrome.storage.sync.get(["aiConfig", "embeddingConfig", "settings"]);
    });

    expect(config.aiConfig).toEqual(E2E_EXTENSION_CONFIG.aiConfig);
    expect(config.embeddingConfig).toEqual(E2E_EXTENSION_CONFIG.embeddingConfig);
    expect(config.settings).toMatchObject(e2eVariant.settings);
  });

  test("能加载扩展并渲染主界面", async ({
    context,
    extensionId,
    e2eVariant,
  }) => {
    // 1) 扩展已加载，拿到合法的扩展 ID
    expect(extensionId).toMatch(/^[a-z]{32}$/);

    // 2) 打开扩展主页面
    const page = await context.newPage();
    await page.goto(extPageUrl(extensionId, "app.html"));

    // 3) React 根节点挂载并渲染出内容
    const root = page.locator("#root");
    await expect(root).toBeVisible();
    await expect(root).not.toBeEmpty();
    if (e2eVariant.name === "dark") {
      await expect(page.locator("html")).toHaveClass(/dark/);
    }

    // 4) 侧边栏品牌名可见（稳定的业务断言点）
    await expect(page.getByText("HamHome").first()).toBeVisible();

    // 5) 截图并附加到 HTML 报告（带截图的测试报告）
    const screenshot = await page.screenshot({ fullPage: true });
    await test.info().attach("app-page-初始界面", {
      body: screenshot,
      contentType: "image/png",
    });
  });
});
