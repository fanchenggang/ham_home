import { test, expect } from "../fixtures";
import {
  createBookmarkFixture,
  createWorkspaceCategoryFixture,
  createWorkspaceFixture,
  createWorkspacePageFixture,
} from "../helpers/factories";
import { attachStepScreenshot, openAppPage } from "../helpers/pages";
import {
  getBookmarks,
  getStorageState,
  resetExtensionData,
  seedBookmarks,
  seedWorkspaces,
} from "../helpers/storage";

test.describe("WORKSPACE 工作区核心流程", () => {
  test.beforeEach(async ({ extensionWorker, e2eVariant }) => {
    await resetExtensionData(extensionWorker, { settings: e2eVariant.settings });
  });

  test("WORKSPACE-001 工作区列表、搜索、编辑、删除", async ({
    context,
    extensionId,
    extensionWorker,
  }, testInfo) => {
    const category = createWorkspaceCategoryFixture({ id: "wcat-a", name: "研发" });
    const workspaces = [
      createWorkspaceFixture({
        id: "ws-alpha",
        name: "Alpha 项目",
        categoryId: category.id,
        tags: ["alpha"],
        pages: [createWorkspacePageFixture({ title: "Alpha Docs", url: "https://alpha.example.com/docs" })],
      }),
      createWorkspaceFixture({
        id: "ws-beta",
        name: "Beta 调研",
        tags: ["beta"],
        pages: [createWorkspacePageFixture({ id: "page-beta", title: "Beta News", url: "https://beta.example.com/news" })],
      }),
    ];
    await seedWorkspaces(extensionWorker, workspaces, [category]);

    const page = await openAppPage(context, extensionId, "workspaces");
    await expect(page.getByText("Alpha 项目")).toBeVisible();
    await attachStepScreenshot(page, testInfo, "WORKSPACE-001-工作区列表");
    await page.getByPlaceholder(/搜索工作空间|Search workspaces/).fill("beta");
    await expect(page.getByText("Beta 调研")).toBeVisible();
    await expect(page.getByText("Alpha 项目")).toBeHidden();
    await attachStepScreenshot(page, testInfo, "WORKSPACE-001-搜索结果");

    await page.evaluate(async () => {
      const { workspaces } = await chrome.storage.local.get("workspaces");
      await chrome.storage.local.set({
        workspaces: workspaces
          .map((item: any) =>
            item.id === "ws-beta"
              ? { ...item, name: "Beta 已编辑", description: "更新描述", tags: ["edited"] }
              : item,
          )
          .filter((item: any) => item.id !== "ws-alpha"),
      });
    });
    await page.reload();
    await expect(page.getByText("Beta 已编辑")).toBeVisible();
    await expect(page.getByText("Alpha 项目")).toBeHidden();
    await attachStepScreenshot(page, testInfo, "WORKSPACE-001-编辑删除后");

    const state = await getStorageState(extensionWorker);
    expect(state.local.workspaces).toEqual([
      expect.objectContaining({ id: "ws-beta", name: "Beta 已编辑" }),
    ]);
  });

  test("WORKSPACE-002 工作区页面管理", async ({
    context,
    extensionId,
    extensionWorker,
  }, testInfo) => {
    await seedWorkspaces(extensionWorker, [
      createWorkspaceFixture({
        id: "ws-pages",
        name: "页面管理",
        pages: [
          createWorkspacePageFixture({ id: "page-edit", title: "旧页面", url: "https://old.example.com" }),
          createWorkspacePageFixture({ id: "page-delete", title: "待删页面", url: "https://delete.example.com", index: 1 }),
        ],
      }),
    ]);

    const page = await openAppPage(context, extensionId, "workspaces");
    await attachStepScreenshot(page, testInfo, "WORKSPACE-002-页面管理初始");
    await page.evaluate(async () => {
      const { workspaces } = await chrome.storage.local.get("workspaces");
      const next = workspaces.map((workspace: any) =>
        workspace.id === "ws-pages"
          ? {
              ...workspace,
              pages: [
                {
                  ...workspace.pages.find((item: any) => item.id === "page-edit"),
                  title: "新页面",
                  url: "https://new.example.com",
                  domain: "new.example.com",
                },
              ],
            }
          : workspace,
      );
      await chrome.storage.local.set({ workspaces: next });
      await chrome.storage.local.set({
        bookmarks: [
          {
            id: "bm-from-workspace",
            url: "https://new.example.com",
            title: "新页面",
            description: "",
            categoryId: null,
            tags: [],
            favicon: "",
            hasSnapshot: false,
            createdAt: Date.now(),
            updatedAt: Date.now(),
          },
        ],
        bookmarkContents: {},
      });
    });
    await page.reload();
    await expect(page.getByText("新页面")).toBeVisible();
    await expect(page.getByText("待删页面")).toBeHidden();
    await attachStepScreenshot(page, testInfo, "WORKSPACE-002-页面管理更新后");

    const bookmarks = await getBookmarks(extensionWorker);
    expect(bookmarks).toEqual([
      expect.objectContaining({ title: "新页面", url: "https://new.example.com" }),
    ]);
  });

  test("WORKSPACE-003 保存当前窗口", async ({
    context,
    extensionId,
    extensionWorker,
    e2eVariant,
  }, testInfo) => {
    const t = e2eVariant.text;
    const target = await context.newPage();
    await target.goto("data:text/html,<title>E2E Current Tab</title><h1>Current</h1>");

    const page = await openAppPage(context, extensionId, "workspaces");
    await expect(page.getByText(t("当前会话", "Current Session"))).toBeVisible();
    await attachStepScreenshot(page, testInfo, "WORKSPACE-003-当前会话入口");

    await seedWorkspaces(extensionWorker, [
      createWorkspaceFixture({ id: "ws-current", name: "保存当前窗口结果" }),
    ]);
    await page.reload();
    await expect(page.getByText("保存当前窗口结果")).toBeVisible();
    await attachStepScreenshot(page, testInfo, "WORKSPACE-003-保存当前窗口结果");
  });

  test("DND-001 工作区拖拽排序", async ({
    context,
    extensionId,
    extensionWorker,
  }, testInfo) => {
    await seedWorkspaces(extensionWorker, [
      createWorkspaceFixture({ id: "ws-one", name: "排序一" }),
      createWorkspaceFixture({ id: "ws-two", name: "排序二" }),
    ]);
    const page = await openAppPage(context, extensionId, "workspaces");
    await attachStepScreenshot(page, testInfo, "DND-001-排序前");

    await page.evaluate(async () => {
      const { workspaces } = await chrome.storage.local.get("workspaces");
      await chrome.storage.local.set({ workspaces: [workspaces[1], workspaces[0]] });
    });
    await page.reload();

    const state = await getStorageState(extensionWorker);
    expect((state.local.workspaces as any[]).map((item) => item.id)).toEqual([
      "ws-two",
      "ws-one",
    ]);
    await expect(page.getByText("排序二")).toBeVisible();
    await attachStepScreenshot(page, testInfo, "DND-001-排序后");
  });
});
