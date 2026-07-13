import { test, expect } from "../fixtures";
import { createTabGroupRuleFixture } from "../helpers/factories";
import { attachStepScreenshot, openAppPage } from "../helpers/pages";
import {
  getStorageState,
  resetExtensionData,
  seedTabGroupRules,
} from "../helpers/storage";

test.describe("TABGROUP 分组规则", () => {
  test.beforeEach(async ({ extensionWorker, e2eVariant }) => {
    await resetExtensionData(extensionWorker, { settings: e2eVariant.settings });
  });

  test("TABGROUP-001 创建 Tab 分组规则", async ({
    context,
    extensionId,
    extensionWorker,
    e2eVariant,
  }, testInfo) => {
    const t = e2eVariant.text;
    const page = await openAppPage(context, extensionId, "tab-groups");
    await page.getByRole("button", { name: /新建规则|New Rule/ }).click();
    await page.getByRole("button", { name: /创建规则|Create Rule/ }).click();
    await expect(page.getByText(/请填写规则名称|Please fill in the rule name/)).toBeVisible();
    await attachStepScreenshot(page, testInfo, "TABGROUP-001-必填校验");

    await page.getByLabel(t("规则名称", "Rule Name")).fill("E2E 规则");
    await page.getByLabel(t("分组名称", "Group Name")).fill("E2E 分组");
    await page.getByPlaceholder("github.com").fill("example.com/docs");
    await page.getByRole("button", { name: /创建规则|Create Rule/ }).click();
    await expect(page.getByText("E2E 规则 (E2E 分组)")).toBeVisible();
    await attachStepScreenshot(page, testInfo, "TABGROUP-001-规则创建后");

    const state = await getStorageState(extensionWorker);
    expect(state.sync.tabGroupRules).toEqual([
      expect.objectContaining({
        name: "E2E 规则",
        groupTitle: "E2E 分组",
        pattern: "example.com/docs",
      }),
    ]);
  });

  test("TABGROUP-002 编辑、开关、删除规则", async ({
    context,
    extensionId,
    extensionWorker,
  }, testInfo) => {
    await seedTabGroupRules(extensionWorker, [
      createTabGroupRuleFixture({ id: "rule-a", name: "规则 A", groupTitle: "分组 A" }),
      createTabGroupRuleFixture({ id: "rule-b", name: "规则 A", groupTitle: "分组 A", pattern: "blog" }),
    ]);

    const page = await openAppPage(context, extensionId, "tab-groups");
    await expect(page.getByText("规则 A (分组 A)")).toBeVisible();
    await attachStepScreenshot(page, testInfo, "TABGROUP-002-规则初始状态");

    await page.evaluate(async () => {
      const { tabGroupRules } = await chrome.storage.sync.get("tabGroupRules");
      await chrome.storage.sync.set({
        tabGroupRules: tabGroupRules.map((item: any) => ({
          ...item,
          enabled: false,
          name: "规则已编辑",
          groupTitle: "分组已编辑",
        })),
      });
    });
    await page.reload();
    await expect(page.getByText("规则已编辑 (分组已编辑)")).toBeVisible();
    await attachStepScreenshot(page, testInfo, "TABGROUP-002-规则编辑后");

    await page.evaluate(async () => {
      await chrome.storage.sync.set({ tabGroupRules: [] });
    });
    await page.reload();
    await expect(page.getByText(/暂无分组规则|No grouping rules yet/)).toBeVisible();
    await attachStepScreenshot(page, testInfo, "TABGROUP-002-规则删除后");

    const state = await getStorageState(extensionWorker);
    expect(state.sync.tabGroupRules).toEqual([]);
  });

  test("TABGROUP-003 默认自动分组策略互斥", async ({
    context,
    extensionId,
    extensionWorker,
    e2eVariant,
  }, testInfo) => {
    const page = await openAppPage(context, extensionId, "tab-groups");
    await expect(page.getByText(e2eVariant.text("默认自动分组", "Default Auto Grouping"))).toBeVisible();

    const aiSwitch = page.getByTestId("ai-auto-group-switch");
    const domainSwitch = page.getByTestId("domain-auto-group-switch");
    const instructions = page.getByTestId("ai-auto-group-instructions");

    await domainSwitch.click();
    await expect(domainSwitch).toBeChecked();
    await expect(aiSwitch).toBeDisabled();
    await expect(instructions).toBeDisabled();
    await attachStepScreenshot(page, testInfo, "TABGROUP-003-按域名自动分组开启");

    let state = await getStorageState(extensionWorker);
    expect(state.sync.tabGroupAutoGroupSettings).toEqual(
      expect.objectContaining({
        aiAutoGroupEnabled: false,
        domainAutoGroupEnabled: true,
      }),
    );

    await domainSwitch.click();
    await aiSwitch.click();
    await expect(aiSwitch).toBeChecked();
    await expect(domainSwitch).toBeDisabled();
    await expect(instructions).toBeEnabled();
    await attachStepScreenshot(page, testInfo, "TABGROUP-003-AI自动分组开启");

    state = await getStorageState(extensionWorker);
    expect(state.sync.tabGroupAutoGroupSettings).toEqual(
      expect.objectContaining({
        aiAutoGroupEnabled: true,
        domainAutoGroupEnabled: false,
      }),
    );
  });
});
