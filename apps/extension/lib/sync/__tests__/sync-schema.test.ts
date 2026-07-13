import { describe, expect, it } from "vitest";
import { RemoteTabGroupConfigFileSchema } from "../sync-schema";

describe("RemoteTabGroupConfigFileSchema", () => {
  it("fills domain auto grouping defaults for older remote configs", () => {
    const parsed = RemoteTabGroupConfigFileSchema.parse({
      rules: [],
      autoGroupSettings: {
        aiAutoGroupEnabled: true,
        aiAutoGroupInstructions: "按项目分组",
        updatedAt: 1000,
      },
    });

    expect(parsed.autoGroupSettings).toEqual({
      aiAutoGroupEnabled: true,
      aiAutoGroupInstructions: "按项目分组",
      domainAutoGroupEnabled: false,
      updatedAt: 1000,
    });
  });
});
