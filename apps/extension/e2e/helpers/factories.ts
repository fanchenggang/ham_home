import type {
  BookmarkEmbedding,
  LocalBookmark,
  LocalCategory,
  PinnedItem,
  TabGroupRule,
  Workspace,
  WorkspaceCategory,
  WorkspaceTabPage,
} from "../../types";

const now = 1_735_689_600_000;

export function createCategoryFixture(
  overrides: Partial<LocalCategory> = {},
): LocalCategory {
  const id = overrides.id ?? "cat-dev";
  return {
    id,
    name: "开发工具",
    parentId: null,
    order: 0,
    createdAt: now,
    ...overrides,
  };
}

export function createBookmarkFixture(
  overrides: Partial<LocalBookmark> = {},
): LocalBookmark {
  const id = overrides.id ?? "bm-dev-docs";
  return {
    id,
    url: "https://example.com/dev-docs",
    title: "Dev Docs",
    description: "Developer documentation",
    content: "Developer documentation content",
    categoryId: null,
    tags: ["docs"],
    favicon: "",
    hasSnapshot: false,
    createdAt: now,
    updatedAt: now,
    ...overrides,
  };
}

export function createWorkspaceCategoryFixture(
  overrides: Partial<WorkspaceCategory> = {},
): WorkspaceCategory {
  return {
    id: overrides.id ?? "wcat-project",
    name: "项目",
    parentId: null,
    order: 0,
    createdAt: now,
    ...overrides,
  };
}

export function createWorkspacePageFixture(
  overrides: Partial<WorkspaceTabPage> = {},
): WorkspaceTabPage {
  const id = overrides.id ?? "page-hamhome";
  const url = overrides.url ?? "https://example.com/hamhome";
  return {
    id,
    title: "HamHome Project",
    url,
    domain: new URL(url).hostname,
    favicon: "",
    pinned: false,
    windowId: 1,
    index: 0,
    ...overrides,
  };
}

export function createWorkspaceFixture(
  overrides: Partial<Workspace> = {},
): Workspace {
  const id = overrides.id ?? "ws-hamhome";
  return {
    id,
    name: "HamHome 工作区",
    description: "项目调研页面",
    categoryId: null,
    tags: ["project"],
    pages: [createWorkspacePageFixture()],
    tabGroups: [],
    isRestored: false,
    convertedToBookmarks: false,
    createdAt: now,
    updatedAt: now,
    ...overrides,
  };
}

export function createTabGroupRuleFixture(
  overrides: Partial<TabGroupRule> = {},
): TabGroupRule {
  const timestamp = now;
  return {
    id: overrides.id ?? "rule-docs",
    name: "文档分组",
    enabled: true,
    matchType: "urlContains",
    matchCondition: "contains",
    pattern: "docs",
    groupTitle: "文档",
    color: "blue",
    collapsed: false,
    order: 0,
    createdAt: timestamp,
    updatedAt: timestamp,
    ...overrides,
  };
}

export function createPinnedItemFixture(
  overrides: Partial<PinnedItem> = {},
): PinnedItem {
  return {
    id: "bookmark_bm-dev-docs",
    type: "bookmark",
    targetId: "bm-dev-docs",
    pinnedAt: now,
    order: now,
    ...overrides,
  };
}

export function createEmbeddingFixture(
  bookmarkId: string,
  overrides: Partial<BookmarkEmbedding> = {},
): BookmarkEmbedding {
  return {
    bookmarkId,
    modelKey: "custom:e2e-embedding-model",
    dim: 3,
    vector: new Float32Array([0.1, 0.2, 0.3]).buffer,
    checksum: `checksum-${bookmarkId}`,
    createdAt: now,
    updatedAt: now,
    ...overrides,
  };
}

export function createLibraryFixtures() {
  const categories = [
    createCategoryFixture({ id: "cat-dev", name: "开发工具", order: 0 }),
    createCategoryFixture({ id: "cat-design", name: "设计参考", order: 1 }),
  ];
  const bookmarks = [
    createBookmarkFixture({
      id: "bm-react",
      title: "React Docs",
      url: "https://react.dev/reference/react",
      description: "React reference",
      categoryId: "cat-dev",
      tags: ["react", "docs"],
      createdAt: now - 1_000,
      updatedAt: now - 1_000,
    }),
    createBookmarkFixture({
      id: "bm-mdn",
      title: "MDN Web APIs",
      url: "https://developer.mozilla.org/docs/Web/API",
      description: "Browser APIs",
      categoryId: "cat-dev",
      tags: ["web", "docs"],
      hasSnapshot: true,
      createdAt: now - 2_000,
      updatedAt: now - 2_000,
    }),
    createBookmarkFixture({
      id: "bm-figma",
      title: "Figma Design",
      url: "https://figma.com/community",
      description: "Design inspiration",
      categoryId: "cat-design",
      tags: ["design"],
      createdAt: now - 3_000,
      updatedAt: now - 3_000,
    }),
    createBookmarkFixture({
      id: "bm-openai",
      title: "OpenAI Docs",
      url: "https://platform.openai.com/docs",
      description: "AI platform",
      categoryId: null,
      tags: ["ai", "docs"],
      createdAt: now - 4_000,
      updatedAt: now - 4_000,
    }),
    createBookmarkFixture({
      id: "bm-hamhome",
      title: "HamHome Repo",
      url: "https://github.com/example/hamhome",
      description: "Bookmark manager",
      categoryId: "cat-dev",
      tags: ["project"],
      createdAt: now - 5_000,
      updatedAt: now - 5_000,
    }),
    createBookmarkFixture({
      id: "bm-news",
      title: "Tech News",
      url: "https://news.example.com",
      description: "Daily technology news",
      categoryId: null,
      tags: ["news"],
      createdAt: now - 6_000,
      updatedAt: now - 6_000,
    }),
  ];
  return { categories, bookmarks };
}
