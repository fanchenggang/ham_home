import { expect, test } from "../fixtures";
import { openControlledPopupPage } from "../helpers/pages";
import {
  POPUP_CURRENT_PAGE,
} from "./screenshot-data";
import {
  APP_VIEWPORT,
  CONTENT_VIEWPORT,
  POPUP_VIEWPORT,
  SHOWCASE_PAGE_HTML,
  assertScreenshotData,
  captureElementScreenshot,
  captureScreenshot,
  openExtensionAppPage,
  prepareScreenshotState,
  stabilizeForScreenshot,
} from "./screenshot-utils";

test.describe("marketing screenshots", () => {
  test("generates required showcase screenshots", async ({
    context,
    extensionId,
    extensionWorker,
    e2eVariant,
  }, testInfo) => {
    await prepareScreenshotState(extensionWorker, e2eVariant);
    await assertScreenshotData(extensionWorker);

    const popup = await openControlledPopupPage(
      context,
      extensionId,
      POPUP_CURRENT_PAGE,
    );
    await popup.setViewportSize(POPUP_VIEWPORT);
    await expect(popup.getByLabel(/标题|Title/)).toHaveValue(
      /AI-assisted React Workflows/,
    );
    await expect(popup.getByText(/react/i).first()).toBeVisible();
    await captureElementScreenshot(
      popup,
      popup.locator("#root > div"),
      testInfo,
      e2eVariant,
      "01-popup-save",
    );

    const library = await openExtensionAppPage(context, extensionId, "all");
    await library.setViewportSize(APP_VIEWPORT);
    await expect(library.getByText("OpenAI Platform Docs")).toBeVisible();
    await expect(library.getByText("React Server Components Deep Dive")).toBeVisible();
    await captureScreenshot(library, testInfo, e2eVariant, "02-bookmark-library");

    const bulk = await openExtensionAppPage(context, extensionId, "all");
    await bulk.setViewportSize(APP_VIEWPORT);
    await expect(bulk.getByText("OpenAI Platform Docs")).toBeVisible();
    const checkboxes = bulk.getByRole("checkbox");
    for (let index = 0; index < 4; index += 1) {
      await checkboxes.nth(index).click();
    }
    await expect(
      bulk.getByText(/selected|已选择|已选中|已选择\s*\d+/i).first(),
    ).toBeVisible();
    await captureScreenshot(
      bulk,
      testInfo,
      e2eVariant,
      "03-bookmark-bulk-actions",
    );

    await context.route("https://screenshots.hamhome.test/**", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "text/html; charset=utf-8",
        body: SHOWCASE_PAGE_HTML,
      });
    });
    const contentPage = await context.newPage();
    await contentPage.setViewportSize(CONTENT_VIEWPORT);
    await contentPage.goto("https://screenshots.hamhome.test/research-dashboard");
    await stabilizeForScreenshot(contentPage);
    await contentPage.mouse.move(2, Math.floor(CONTENT_VIEWPORT.height / 2));
    await contentPage.waitForTimeout(350);
    await contentPage.mouse.click(20, Math.floor(CONTENT_VIEWPORT.height / 2));
    await expect(contentPage.getByText("OpenAI Platform Docs").first()).toBeVisible({
      timeout: 10_000,
    });
    await captureScreenshot(contentPage, testInfo, e2eVariant, "04-content-panel");

    const agent = await openExtensionAppPage(context, extensionId, "all");
    await agent.setViewportSize(APP_VIEWPORT);
    await expect(agent.getByLabel(agentOpenLabel(e2eVariant.language))).toBeVisible();
    await agent.getByLabel(agentOpenLabel(e2eVariant.language)).click();
    await expect(agent.getByText("AI search planning").first()).toBeVisible();
    await expect(agent.getByText("Find the best bookmarks").first()).toBeVisible();
    await captureScreenshot(agent, testInfo, e2eVariant, "05-ai-agent");

    const workspaces = await openExtensionAppPage(context, extensionId, "workspaces");
    await workspaces.setViewportSize(APP_VIEWPORT);
    await expect(workspaces.getByText("AI Bookmark Launch Plan")).toBeVisible();
    await expect(workspaces.getByText("React UI Redesign")).toBeVisible();
    await captureScreenshot(workspaces, testInfo, e2eVariant, "06-workspaces");

    const tabGroups = await openExtensionAppPage(context, extensionId, "tab-groups");
    await tabGroups.setViewportSize(APP_VIEWPORT);
    await expect(tabGroups.getByText("AI Research (AI Lab)")).toBeVisible();
    await expect(tabGroups.getByText("Frontend Build (Frontend)")).toBeVisible();
    await captureScreenshot(tabGroups, testInfo, e2eVariant, "07-tab-groups");

    const importExport = await openExtensionAppPage(
      context,
      extensionId,
      "import-export",
    );
    await importExport.setViewportSize(APP_VIEWPORT);
    await expect(importExport.getByText(/42|OpenAI|JSON|HTML/).first()).toBeVisible();
    await importExport
      .getByText(syncBrowserTitle(e2eVariant.language))
      .first()
      .scrollIntoViewIfNeeded();
    await captureScreenshot(importExport, testInfo, e2eVariant, "08-import-export-sync", {
      timeoutMs: 700,
    });
  });
});

function agentOpenLabel(language: string): string | RegExp {
  return language === "en" ? "Open global assistant" : "打开全局助手";
}

function syncBrowserTitle(language: string): string {
  return language === "en"
    ? "Sync to Browser Bookmarks"
    : "同步到浏览器书签栏";
}
