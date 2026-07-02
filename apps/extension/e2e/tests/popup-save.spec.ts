import { test, expect } from "../fixtures";
import { createBookmarkFixture, createCategoryFixture } from "../helpers/factories";
import { attachStepScreenshot, openControlledPopupPage } from "../helpers/pages";
import {
  getBookmarks,
  resetExtensionData,
  seedBookmarks,
  seedCategories,
} from "../helpers/storage";

const CURRENT_PAGE = {
  tabId: 9001,
  url: "https://popup.e2e.test/article",
  title: "Popup Source Page",
  content: {
    url: "https://popup.e2e.test/article",
    title: "Popup Source Page",
    content: "",
    htmlContent: "",
    textContent: "",
    excerpt: "",
    favicon: "",
  },
};

test.describe("POPUP 当前页保存流程", () => {
  test.beforeEach(async ({ extensionWorker, e2eVariant }) => {
    await resetExtensionData(extensionWorker, { settings: e2eVariant.settings });
  });

  test("POPUP-001 保存当前页为新书签", async ({
    context,
    extensionId,
    extensionWorker,
    e2eVariant,
  }, testInfo) => {
    const t = e2eVariant.text;
    await seedCategories(extensionWorker, [
      createCategoryFixture({ id: "cat-popup", name: "弹窗分类" }),
    ]);
    await seedBookmarks(extensionWorker, [
      createBookmarkFixture({
        id: "bm-existing-tag-a",
        url: "https://tags.example.com/a",
        title: "已有标签 A",
        tags: ["existing-a"],
      }),
      createBookmarkFixture({
        id: "bm-existing-tag-b",
        url: "https://tags.example.com/b",
        title: "已有标签 B",
        tags: ["existing-b"],
      }),
    ]);

    const popup = await openControlledPopupPage(context, extensionId, CURRENT_PAGE);
    await expect(popup.getByLabel(t("标题", "Title"))).toHaveValue("Popup Source Page");
    await attachStepScreenshot(popup, testInfo, "POPUP-001-读取当前页");

    await popup.getByLabel(t("标题", "Title")).fill("");
    await expect(
      popup.getByRole("button", { name: /保存书签|Save Bookmark/ }),
    ).toBeDisabled();
    await attachStepScreenshot(popup, testInfo, "POPUP-001-标题为空禁用保存");

    await popup.getByLabel(t("标题", "Title")).fill("Popup 保存结果");
    await popup.getByLabel(t("摘要", "Summary")).fill("通过 popup 保存的描述");
    await popup.getByRole("combobox").click();
    await popup.getByText("弹窗分类", { exact: true }).click();
    await popup.getByPlaceholder(t("输入标签后回车", "Enter tag and press Enter")).fill("popup");
    await popup.keyboard.press("Enter");
    await attachStepScreenshot(popup, testInfo, "POPUP-001-保存前表单");
    await popup.getByRole("button", { name: /保存书签|Save Bookmark/ }).click();

    await expect
      .poll(async () => getBookmarks(extensionWorker))
      .toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            url: CURRENT_PAGE.url,
            title: "Popup 保存结果",
            description: "通过 popup 保存的描述",
            categoryId: "cat-popup",
            tags: expect.arrayContaining(["popup"]),
          }),
        ]),
      );
  });

  test("POPUP-002 已收藏页面进入更新态并可删除", async ({
    context,
    extensionId,
    extensionWorker,
    e2eVariant,
  }, testInfo) => {
    const t = e2eVariant.text;
    await seedBookmarks(extensionWorker, [
      createBookmarkFixture({
        id: "bm-popup-existing",
        url: CURRENT_PAGE.url,
        title: "旧 popup 标题",
        description: "旧描述",
        tags: ["old"],
      }),
    ]);

    let popup = await openControlledPopupPage(context, extensionId, CURRENT_PAGE);
    await expect(popup.getByRole("button", { name: /更新书签|Update Bookmark/ })).toBeVisible();
    await attachStepScreenshot(popup, testInfo, "POPUP-002-已收藏更新态");
    await popup.getByLabel(t("标题", "Title")).fill("更新后的 popup 标题");
    await popup.getByLabel(t("摘要", "Summary")).fill("更新后的描述");
    await attachStepScreenshot(popup, testInfo, "POPUP-002-更新前表单");
    await popup.getByRole("button", { name: /更新书签|Update Bookmark/ }).click();

    await expect.poll(async () => getBookmarks(extensionWorker)).toEqual([
      expect.objectContaining({
        id: "bm-popup-existing",
        url: CURRENT_PAGE.url,
        title: "更新后的 popup 标题",
        description: "更新后的描述",
      }),
    ]);

    popup = await openControlledPopupPage(context, extensionId, CURRENT_PAGE);
    popup.on("dialog", (dialog) => dialog.accept());
    await attachStepScreenshot(popup, testInfo, "POPUP-002-删除前更新态");
    await popup.getByRole("button", { name: t("删除", "Delete"), exact: true }).click();

    await expect.poll(async () => getBookmarks(extensionWorker)).toEqual([]);
  });
});
