export type ExtensionScreenshotId =
  | "popupSave"
  | "popupQuickPanel"
  | "bookmarkLibrary"
  | "bookmarkBulkActions"
  | "contentPanel"
  | "aiAgent"
  | "workspaces"
  | "tabGroups"
  | "importExportSync";

export interface ExtensionScreenshotCopy {
  title: string;
  alt: string;
}

export interface ExtensionScreenshotMeta {
  file: string;
  zh: ExtensionScreenshotCopy;
  en: ExtensionScreenshotCopy;
  aspect: "popup" | "desktop";
}

export const EXTENSION_SCREENSHOTS: Record<ExtensionScreenshotId, ExtensionScreenshotMeta> = {
  popupSave: {
    file: "01-popup-save.png",
    aspect: "popup",
    zh: {
      title: "页内快速保存",
      alt: "HamHome 页内快速保存浮窗截图",
    },
    en: {
      title: "In-page Quick Save",
      alt: "HamHome in-page quick save panel screenshot",
    },
  },
  popupQuickPanel: {
    file: "09-popup-quick-panel.png",
    aspect: "popup",
    zh: {
      title: "快捷面板",
      alt: "HamHome 扩展快捷面板截图",
    },
    en: {
      title: "Quick Panel",
      alt: "HamHome extension quick panel screenshot",
    },
  },
  bookmarkLibrary: {
    file: "02-bookmark-library.png",
    aspect: "desktop",
    zh: {
      title: "书签库",
      alt: "HamHome 书签库截图",
    },
    en: {
      title: "Bookmark Library",
      alt: "HamHome bookmark library screenshot",
    },
  },
  bookmarkBulkActions: {
    file: "03-bookmark-bulk-actions.png",
    aspect: "desktop",
    zh: {
      title: "批量整理",
      alt: "HamHome 批量整理书签截图",
    },
    en: {
      title: "Bulk Actions",
      alt: "HamHome bulk bookmark actions screenshot",
    },
  },
  contentPanel: {
    file: "04-content-panel.png",
    aspect: "desktop",
    zh: {
      title: "网页内面板",
      alt: "HamHome 网页内书签面板截图",
    },
    en: {
      title: "In-page Panel",
      alt: "HamHome in-page bookmark panel screenshot",
    },
  },
  aiAgent: {
    file: "05-ai-agent.png",
    aspect: "desktop",
    zh: {
      title: "AI Agent",
      alt: "HamHome AI Agent 插件咨询与管理截图",
    },
    en: {
      title: "AI Agent",
      alt: "HamHome AI Agent extension assistant screenshot",
    },
  },
  workspaces: {
    file: "06-workspaces.png",
    aspect: "desktop",
    zh: {
      title: "工作空间",
      alt: "HamHome 工作空间截图",
    },
    en: {
      title: "Workspaces",
      alt: "HamHome workspaces screenshot",
    },
  },
  tabGroups: {
    file: "07-tab-groups.png",
    aspect: "desktop",
    zh: {
      title: "Tab 分组规则",
      alt: "HamHome Tab 分组规则截图",
    },
    en: {
      title: "Tab Group Rules",
      alt: "HamHome Tab Group rules screenshot",
    },
  },
  importExportSync: {
    file: "08-import-export-sync.png",
    aspect: "desktop",
    zh: {
      title: "导入导出与同步",
      alt: "HamHome 导入导出与同步截图",
    },
    en: {
      title: "Import, Export, and Sync",
      alt: "HamHome import, export, and sync screenshot",
    },
  },
};

export function getExtensionScreenshotSrc(
  id: ExtensionScreenshotId,
  options: { isEn: boolean; isDark: boolean },
): string {
  const locale = options.isEn ? "en" : "zh";
  const theme = options.isDark ? "dark" : "light";
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

  return `${basePath}/screenshots/extension/${locale}-${theme}/${EXTENSION_SCREENSHOTS[id].file}`;
}
