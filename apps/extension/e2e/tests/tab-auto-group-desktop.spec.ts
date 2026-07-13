import { test, expect, extPageUrl } from "../fixtures";
import {
  attachDesktopScreenshot,
  desktopScreenshotStrictEnabled,
  desktopScreenshotTestEnabled,
} from "../helpers/desktop-screenshot";

const TEST_URL_MARKER = "hamhome-tab-group-e2e";
const GROUP_TITLE = "E2E分组";

test.describe("Tab 自动分组整窗截图 @desktop", () => {
  test.skip(
    !desktopScreenshotTestEnabled(),
    "需要 HEADED=1 E2E_DESKTOP_SCREENSHOT=1 才能截取浏览器整窗。",
  );

  test("命中规则后在浏览器标签栏生成分组并附加整窗截图", async ({
    context,
    extensionId,
  }) => {
    const appPage = await context.newPage();
    await appPage.goto(extPageUrl(extensionId, "app.html#tab-groups"));

    const now = Date.now();
    await appPage.evaluate(
      async ({ marker, groupTitle, timestamp }) => {
        await chrome.storage.sync.set({
          tabGroupRules: [
            {
              id: `e2e-tab-rule-${timestamp}`,
              name: "E2E Tab 自动分组",
              enabled: true,
              matchType: "urlContains",
              matchCondition: "contains",
              pattern: marker,
              groupTitle,
              color: "blue",
              collapsed: false,
              order: 0,
              createdAt: timestamp,
              updatedAt: timestamp,
            },
          ],
          tabGroupAutoGroupSettings: {
            aiAutoGroupEnabled: false,
            aiAutoGroupInstructions: "",
            domainAutoGroupEnabled: false,
            updatedAt: timestamp,
          },
        });
      },
      { marker: TEST_URL_MARKER, groupTitle: GROUP_TITLE, timestamp: now },
    );

    const targetPage = await context.newPage();
    await targetPage.goto(
      `data:text/html;charset=utf-8,${encodeURIComponent(`
        <!doctype html>
        <html lang="zh-CN">
          <head><title>HamHome Tab Group E2E</title></head>
          <body><main>${TEST_URL_MARKER}</main></body>
        </html>
      `)}#${TEST_URL_MARKER}`,
    );

    await expect
      .poll(
        () =>
          appPage.evaluate(async ({ marker, groupTitle }) => {
            const tabs = await chrome.tabs.query({ currentWindow: true });
            const target = tabs.find((tab) => tab.url?.includes(marker));
            if (
              !target?.groupId ||
              target.groupId === chrome.tabGroups.TAB_GROUP_ID_NONE
            ) {
              return null;
            }

            const groups = await chrome.tabGroups.query({
              windowId: target.windowId,
            });
            const group = groups.find((item) => item.id === target.groupId);
            if (!group) return null;

            return {
              title: group.title,
              color: group.color,
              collapsed: group.collapsed,
              matched: group.title === groupTitle,
            };
          }, { marker: TEST_URL_MARKER, groupTitle: GROUP_TITLE }),
        { timeout: 15_000 },
      )
      .toEqual({
        title: GROUP_TITLE,
        color: "blue",
        collapsed: false,
        matched: true,
      });

    await targetPage.bringToFront();
    const screenshotPath = await attachDesktopScreenshot(test.info(), {
      name: "tab-auto-group-browser-window",
      required: desktopScreenshotStrictEnabled(),
    });
    if (!screenshotPath) {
      test.info().annotations.push({
        type: "desktop-screenshot",
        description: "当前环境无法通过 macOS screencapture 获取整窗截图。",
      });
    }
  });
});
