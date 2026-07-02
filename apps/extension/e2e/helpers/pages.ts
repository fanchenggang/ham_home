import type { BrowserContext, Page, TestInfo } from "@playwright/test";
import { extPageUrl, expect } from "../fixtures";
import type { PageContent } from "../../types";

export interface ControlledPopupPage {
  tabId: number;
  url: string;
  title: string;
  content: PageContent;
}

export async function openAppPage(
  context: BrowserContext,
  extensionId: string,
  route = "all",
): Promise<Page> {
  const page = await context.newPage();
  await page.goto(extPageUrl(extensionId, `app.html#${route}`));
  await expect(page.locator("#root")).toBeVisible();
  return page;
}

export async function openPopupPage(
  context: BrowserContext,
  extensionId: string,
): Promise<Page> {
  const page = await context.newPage();
  await page.goto(extPageUrl(extensionId, "popup.html"));
  await expect(page.locator("#root")).toBeVisible();
  return page;
}

export async function openControlledPopupPage(
  context: BrowserContext,
  extensionId: string,
  currentPage: ControlledPopupPage,
): Promise<Page> {
  const page = await context.newPage();
  await page.addInitScript(({ currentPage: injectedPage }) => {
    const tab = {
      id: injectedPage.tabId,
      url: injectedPage.url,
      title: injectedPage.title,
      active: true,
      currentWindow: true,
    };

    const patchTabsApi = (api: any) => {
      if (!api?.tabs) return;
      api.tabs.query = (
        _query: unknown,
        callback?: (tabs: unknown[]) => void,
      ) => {
        callback?.([tab]);
        return Promise.resolve([tab]);
      };
      api.tabs.sendMessage = (
        _tabId: number,
        _message: unknown,
        optionsOrCallback?: unknown,
        maybeCallback?: (content: unknown) => void,
      ) => {
        const callback =
          typeof optionsOrCallback === "function"
            ? optionsOrCallback
            : maybeCallback;
        callback?.(injectedPage.content);
        return Promise.resolve(injectedPage.content);
      };
    };

    patchTabsApi((globalThis as any).chrome);
    patchTabsApi((globalThis as any).browser);
  }, { currentPage });

  await page.goto(extPageUrl(extensionId, "popup.html"));
  await expect(page.locator("#root")).toBeVisible();
  return page;
}

export async function attachPageScreenshot(
  page: Page,
  testInfo: TestInfo,
  name: string,
): Promise<void> {
  await testInfo.attach(name, {
    body: await page.screenshot({ fullPage: true }),
    contentType: "image/png",
  });
}

export async function attachStepScreenshot(
  page: Page,
  testInfo: TestInfo,
  name: string,
): Promise<void> {
  await page.waitForLoadState("domcontentloaded");
  await page.waitForTimeout(100);
  await attachPageScreenshot(page, testInfo, `关键节点-${name}`);
}

export async function expectHash(page: Page, hash: string): Promise<void> {
  await expect
    .poll(() => page.evaluate(() => window.location.hash))
    .toBe(hash.startsWith("#") ? hash : `#${hash}`);
}

export async function clickByText(page: Page, text: string): Promise<void> {
  await page.getByText(text, { exact: true }).first().click();
}

export async function setHiddenFileInput(
  page: Page,
  selector: string,
  file: {
    name: string;
    mimeType: string;
    buffer: Buffer;
  },
): Promise<void> {
  await page.setInputFiles(selector, file);
}
