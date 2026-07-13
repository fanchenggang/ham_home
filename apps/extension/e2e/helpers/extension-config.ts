import type { Worker } from "@playwright/test";
import {
  E2E_EXTENSION_CONFIG,
  shouldInjectE2EExtensionConfig,
} from "../e2e.config";

export async function injectE2EExtensionConfig(worker: Worker): Promise<void> {
  if (!shouldInjectE2EExtensionConfig()) return;

  await worker.evaluate(async (config) => {
    await chrome.storage.sync.set({
      aiConfig: config.aiConfig,
      embeddingConfig: config.embeddingConfig,
    });
  }, E2E_EXTENSION_CONFIG);
}
