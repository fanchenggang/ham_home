import type {
  AgentProcessStep,
  AnalysisResult,
  BookmarkEmbedding,
  ChatMessage,
  CustomFilter,
  LocalBookmark,
  LocalCategory,
  PinnedItem,
  Source,
  TabGroupRule,
  Workspace,
  WorkspaceCategory,
  WorkspaceTabGroup,
  WorkspaceTabPage,
} from "../../types";
import type { ControlledPopupPage } from "../helpers/pages";

export const SCREENSHOT_BASE_TIME = new Date(
  "2026-06-15T09:30:00+08:00",
).getTime();

const day = 24 * 60 * 60 * 1000;

export const DEMO_CATEGORIES: LocalCategory[] = [
  category("cat-ai", "AI Research", null, 0, "AI"),
  category("cat-frontend", "Frontend", null, 1, "FE"),
  category("cat-react", "React", "cat-frontend", 0, "R"),
  category("cat-design", "Design Systems", null, 2, "DS"),
  category("cat-product", "Product Strategy", null, 3, "PM"),
  category("cat-ops", "Ops & Growth", null, 4, "OP"),
  category("cat-writing", "Writing", null, 5, "WR"),
  category("cat-data", "Data & Analytics", null, 6, "DA"),
];

const bookmarkSeed: Array<
  Pick<LocalBookmark, "title" | "url" | "description" | "categoryId" | "tags"> & {
    content?: string;
  }
> = [
  {
    title: "OpenAI Platform Docs",
    url: "https://platform.openai.com/docs",
    description: "API guides, model capabilities, tool calling, and production patterns.",
    categoryId: "cat-ai",
    tags: ["ai", "docs", "api"],
  },
  {
    title: "Anthropic Prompt Engineering Guide",
    url: "https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/overview",
    description: "Practical prompt patterns for reliable agent behavior and evaluation.",
    categoryId: "cat-ai",
    tags: ["ai", "prompting", "evals"],
  },
  {
    title: "React Server Components Deep Dive",
    url: "https://react.dev/reference/rsc/server-components",
    description: "Architecture notes for streaming server-rendered React applications.",
    categoryId: "cat-react",
    tags: ["react", "architecture", "frontend"],
  },
  {
    title: "Next.js App Router Patterns",
    url: "https://nextjs.org/docs/app",
    description: "Routing, data fetching, caching, and deployment guidance for app router.",
    categoryId: "cat-react",
    tags: ["nextjs", "react", "frontend"],
  },
  {
    title: "MDN Web APIs Reference",
    url: "https://developer.mozilla.org/docs/Web/API",
    description: "Browser API reference for storage, workers, DOM, and networking.",
    categoryId: "cat-frontend",
    tags: ["web", "docs", "browser"],
  },
  {
    title: "Web.dev Performance Learn",
    url: "https://web.dev/learn/performance",
    description: "Modern performance metrics and optimization techniques for web apps.",
    categoryId: "cat-frontend",
    tags: ["performance", "frontend", "web"],
  },
  {
    title: "Figma Variables and Modes",
    url: "https://help.figma.com/hc/en-us/articles/15339657135383-Guide-to-variables-in-Figma",
    description: "Design token workflows for themes, density, and semantic variables.",
    categoryId: "cat-design",
    tags: ["design", "tokens", "figma"],
  },
  {
    title: "Material Design Components",
    url: "https://m3.material.io/components",
    description: "Interaction patterns, component states, and accessibility guidance.",
    categoryId: "cat-design",
    tags: ["design-system", "ui", "accessibility"],
  },
  {
    title: "Linear Product Principles",
    url: "https://linear.app/method",
    description: "Product team rituals, roadmap quality, and issue triage practices.",
    categoryId: "cat-product",
    tags: ["product", "roadmap", "team"],
  },
  {
    title: "Stripe Billing Documentation",
    url: "https://docs.stripe.com/billing",
    description: "Subscription lifecycle, invoices, metering, and pricing implementation.",
    categoryId: "cat-ops",
    tags: ["billing", "saas", "ops"],
  },
  {
    title: "Vercel Observability Guide",
    url: "https://vercel.com/docs/observability",
    description: "Runtime logs, traces, web vitals, and operational monitoring.",
    categoryId: "cat-ops",
    tags: ["ops", "monitoring", "vercel"],
  },
  {
    title: "GitHub Actions Workflow Syntax",
    url: "https://docs.github.com/actions/using-workflows/workflow-syntax-for-github-actions",
    description: "CI workflow configuration, matrices, permissions, and reusable jobs.",
    categoryId: "cat-ops",
    tags: ["github", "ci", "automation"],
  },
  {
    title: "PostHog Product Analytics",
    url: "https://posthog.com/docs/product-analytics",
    description: "Funnels, cohorts, retention, and feature insight setup.",
    categoryId: "cat-data",
    tags: ["analytics", "product", "growth"],
  },
  {
    title: "Amplitude North Star Playbook",
    url: "https://amplitude.com/north-star",
    description: "Metric design and product-led growth measurement frameworks.",
    categoryId: "cat-data",
    tags: ["metrics", "growth", "analytics"],
  },
  {
    title: "Write the Docs Guide",
    url: "https://www.writethedocs.org/guide/",
    description: "Documentation structure, audience framing, and maintenance workflows.",
    categoryId: "cat-writing",
    tags: ["writing", "docs", "communication"],
  },
  {
    title: "Nielsen Norman UX Research",
    url: "https://www.nngroup.com/articles/",
    description: "Research-backed UX articles on navigation, forms, and product usability.",
    categoryId: "cat-product",
    tags: ["ux", "research", "product"],
  },
  {
    title: "Cloudflare Workers Runtime",
    url: "https://developers.cloudflare.com/workers/runtime-apis/",
    description: "Edge runtime APIs, storage, queues, and deployment patterns.",
    categoryId: "cat-ops",
    tags: ["cloudflare", "edge", "serverless"],
  },
  {
    title: "Supabase Row Level Security",
    url: "https://supabase.com/docs/guides/database/postgres/row-level-security",
    description: "Security policies and schema design for multi-tenant applications.",
    categoryId: "cat-data",
    tags: ["database", "security", "postgres"],
  },
  {
    title: "TanStack Query Docs",
    url: "https://tanstack.com/query/latest/docs/framework/react/overview",
    description: "Server state management, caching, mutations, and optimistic updates.",
    categoryId: "cat-react",
    tags: ["react", "state", "frontend"],
  },
  {
    title: "Tailwind CSS Container Queries",
    url: "https://tailwindcss.com/docs/responsive-design",
    description: "Responsive layout strategies with utility classes and design tokens.",
    categoryId: "cat-frontend",
    tags: ["css", "tailwind", "responsive"],
  },
  {
    title: "Radix UI Primitives",
    url: "https://www.radix-ui.com/primitives",
    description: "Accessible primitives for dialogs, menus, popovers, and form controls.",
    categoryId: "cat-design",
    tags: ["ui", "accessibility", "react"],
  },
  {
    title: "OpenTelemetry Browser Instrumentation",
    url: "https://opentelemetry.io/docs/languages/js/",
    description: "Tracing and telemetry patterns for JavaScript applications.",
    categoryId: "cat-ops",
    tags: ["observability", "javascript", "ops"],
  },
  {
    title: "LlamaIndex Agent Workflows",
    url: "https://docs.llamaindex.ai/en/stable/",
    description: "Retrieval, tool use, memory, and agent orchestration examples.",
    categoryId: "cat-ai",
    tags: ["rag", "agents", "ai"],
  },
  {
    title: "LangChain Retrieval Concepts",
    url: "https://python.langchain.com/docs/concepts/retrieval/",
    description: "Retriever design, indexing, chunking, and document workflows.",
    categoryId: "cat-ai",
    tags: ["rag", "retrieval", "ai"],
  },
  {
    title: "Product Hunt Launch Checklist",
    url: "https://www.producthunt.com/launch",
    description: "Launch page preparation, positioning, and community follow-up.",
    categoryId: "cat-product",
    tags: ["launch", "growth", "marketing"],
  },
  {
    title: "Intercom Onboarding Messages",
    url: "https://www.intercom.com/blog/user-onboarding/",
    description: "Lifecycle messaging and activation flows for SaaS products.",
    categoryId: "cat-product",
    tags: ["onboarding", "growth", "saas"],
  },
  {
    title: "SQLite Query Planner",
    url: "https://www.sqlite.org/queryplanner.html",
    description: "Indexes, scan strategies, and practical query performance notes.",
    categoryId: "cat-data",
    tags: ["database", "sqlite", "performance"],
  },
  {
    title: "Prisma Schema Relations",
    url: "https://www.prisma.io/docs/orm/prisma-schema/data-model/relations",
    description: "Data model relations, cascading behavior, and query ergonomics.",
    categoryId: "cat-data",
    tags: ["database", "orm", "typescript"],
  },
  {
    title: "Storybook Design System Tutorial",
    url: "https://storybook.js.org/tutorials/design-systems-for-developers/",
    description: "Component documentation, visual review, and design system workflow.",
    categoryId: "cat-design",
    tags: ["storybook", "design-system", "frontend"],
  },
  {
    title: "A11y Project Checklist",
    url: "https://www.a11yproject.com/checklist/",
    description: "Accessibility checks for semantics, keyboard support, and content.",
    categoryId: "cat-design",
    tags: ["accessibility", "checklist", "ui"],
  },
  {
    title: "Sentry Performance Monitoring",
    url: "https://docs.sentry.io/product/performance/",
    description: "Transaction tracing, spans, and performance issue triage.",
    categoryId: "cat-ops",
    tags: ["sentry", "monitoring", "performance"],
  },
  {
    title: "Kubernetes Deployment Basics",
    url: "https://kubernetes.io/docs/concepts/workloads/controllers/deployment/",
    description: "Rollouts, replicas, health checks, and workload management.",
    categoryId: "cat-ops",
    tags: ["kubernetes", "infra", "ops"],
  },
  {
    title: "GitLab Handbook Remote Work",
    url: "https://handbook.gitlab.com/handbook/company/culture/all-remote/",
    description: "Remote collaboration, documentation culture, and async rituals.",
    categoryId: "cat-writing",
    tags: ["remote", "writing", "team"],
  },
  {
    title: "Basecamp Shape Up",
    url: "https://basecamp.com/shapeup",
    description: "Product shaping, appetite, betting tables, and delivery cycles.",
    categoryId: "cat-product",
    tags: ["product", "planning", "writing"],
  },
  {
    title: "Observable Plot Examples",
    url: "https://observablehq.com/plot/",
    description: "Exploratory data visualization examples for dashboards and reports.",
    categoryId: "cat-data",
    tags: ["visualization", "analytics", "dashboard"],
  },
  {
    title: "Playwright Browser Testing",
    url: "https://playwright.dev/docs/intro",
    description: "Reliable browser automation for screenshots, e2e tests, and traces.",
    categoryId: "cat-frontend",
    tags: ["testing", "automation", "browser"],
  },
  {
    title: "TypeScript Handbook",
    url: "https://www.typescriptlang.org/docs/handbook/intro.html",
    description: "Type system fundamentals, generics, narrowing, and project config.",
    categoryId: "cat-frontend",
    tags: ["typescript", "frontend", "docs"],
  },
  {
    title: "OpenAI Evals Design Notes",
    url: "https://github.com/openai/evals",
    description: "Evaluation harness patterns for regression testing model behavior.",
    categoryId: "cat-ai",
    tags: ["evals", "ai", "testing"],
  },
  {
    title: "HELM Benchmark",
    url: "https://crfm.stanford.edu/helm/latest/",
    description: "Model benchmark taxonomy and reporting dimensions.",
    categoryId: "cat-ai",
    tags: ["benchmark", "evals", "ai"],
  },
  {
    title: "Growth Loops Field Guide",
    url: "https://www.reforge.com/blog/growth-loops",
    description: "Acquisition and retention loops for product-led teams.",
    categoryId: "cat-product",
    tags: ["growth", "strategy", "product"],
  },
  {
    title: "Obsidian URI Reference",
    url: "https://help.obsidian.md/Extending+Obsidian/Obsidian+URI",
    description: "URI schemes for creating, opening, and syncing notes.",
    categoryId: "cat-writing",
    tags: ["obsidian", "notes", "workflow"],
  },
];

export const DEMO_BOOKMARKS: LocalBookmark[] = bookmarkSeed.map((item, index) =>
  bookmark(index, item),
);

export const DEMO_CUSTOM_FILTERS: CustomFilter[] = [
  {
    id: "filter-ai-research",
    name: "AI research queue",
    conditions: [{ field: "tags", operator: "contains", value: "ai" }],
    createdAt: SCREENSHOT_BASE_TIME - 20 * day,
    updatedAt: SCREENSHOT_BASE_TIME - 2 * day,
  },
  {
    id: "filter-launch-ready",
    name: "Launch and growth",
    conditions: [{ field: "tags", operator: "contains", value: "growth" }],
    createdAt: SCREENSHOT_BASE_TIME - 18 * day,
    updatedAt: SCREENSHOT_BASE_TIME - day,
  },
];

export const DEMO_PINNED_ITEMS: PinnedItem[] = [
  pinned("bookmark", "bm-00", 0),
  pinned("bookmark", "bm-02", 1),
  pinned("category", "cat-ai", 2),
  pinned("category", "cat-react", 3),
];

export const DEMO_WORKSPACE_CATEGORIES: WorkspaceCategory[] = [
  workspaceCategory("wcat-build", "Build Sprint", 0, "SP"),
  workspaceCategory("wcat-research", "Research", 1, "RS"),
  workspaceCategory("wcat-launch", "Launch", 2, "LN"),
];

const workspaceGroups: WorkspaceTabGroup[] = [
  { id: 101, title: "Product", color: "blue", windowId: 1 },
  { id: 102, title: "Engineering", color: "purple", windowId: 1 },
  { id: 103, title: "Research", color: "green", windowId: 1 },
];

export const DEMO_WORKSPACES: Workspace[] = [
  workspace("ws-ai-launch", "AI Bookmark Launch Plan", "wcat-launch", 0, [
    page("OpenAI platform release notes", "https://platform.openai.com/docs/changelog", 101, 0),
    page("Product Hunt launch guide", "https://www.producthunt.com/launch", 101, 1),
    page("Growth loops field guide", "https://www.reforge.com/blog/growth-loops", 101, 2),
    page("OpenAI evals repository", "https://github.com/openai/evals", 103, 3),
    page("LangChain retrieval concepts", "https://python.langchain.com/docs/concepts/retrieval/", 103, 4),
    page("PostHog product analytics", "https://posthog.com/docs/product-analytics", 101, 5),
  ]),
  workspace("ws-react-redesign", "React UI Redesign", "wcat-build", 1, [
    page("React Server Components", "https://react.dev/reference/rsc/server-components", 102, 0),
    page("Next.js app router docs", "https://nextjs.org/docs/app", 102, 1),
    page("Radix UI primitives", "https://www.radix-ui.com/primitives", 102, 2),
    page("Material components", "https://m3.material.io/components", 101, 3),
    page("A11y project checklist", "https://www.a11yproject.com/checklist/", 101, 4),
    page("Storybook design systems", "https://storybook.js.org/tutorials/design-systems-for-developers/", 102, 5),
  ]),
  workspace("ws-data-ops", "Data & Ops Review", "wcat-research", 2, [
    page("SQLite query planner", "https://www.sqlite.org/queryplanner.html", 103, 0),
    page("Supabase row level security", "https://supabase.com/docs/guides/database/postgres/row-level-security", 103, 1),
    page("Sentry performance", "https://docs.sentry.io/product/performance/", 102, 2),
    page("OpenTelemetry JS", "https://opentelemetry.io/docs/languages/js/", 102, 3),
    page("Cloudflare Workers runtime", "https://developers.cloudflare.com/workers/runtime-apis/", 102, 4),
  ]),
];

export const DEMO_TAB_GROUP_RULES: TabGroupRule[] = [
  tabRule("rule-ai-openai", "AI Research", "AI Lab", "purple", "domain", "contains", "openai.com", 0),
  tabRule("rule-ai-rag", "AI Research", "AI Lab", "purple", "urlContains", "contains", "retrieval", 1),
  tabRule("rule-react-docs", "Frontend Build", "Frontend", "blue", "domain", "contains", "react.dev", 2),
  tabRule("rule-next-docs", "Frontend Build", "Frontend", "blue", "domain", "contains", "nextjs.org", 3),
  tabRule("rule-design-ui", "Design Review", "Design", "pink", "urlContains", "contains", "design", 4),
  tabRule("rule-design-a11y", "Design Review", "Design", "pink", "domain", "contains", "a11yproject.com", 5),
  tabRule("rule-ops-monitoring", "Ops Console", "Ops", "green", "urlContains", "contains", "monitoring", 6),
  tabRule("rule-ops-github", "Ops Console", "Ops", "green", "domain", "contains", "github.com", 7),
  tabRule("rule-growth", "Growth Reads", "Growth", "orange", "urlContains", "contains", "growth", 8),
];

export const DEMO_AI_SOURCES: Source[] = [
  source(1, DEMO_BOOKMARKS[0], 0.92),
  source(2, DEMO_BOOKMARKS[22], 0.87),
  source(3, DEMO_BOOKMARKS[23], 0.81),
  source(4, DEMO_BOOKMARKS[36], 0.76),
];

export const DEMO_AGENT_STEPS: AgentProcessStep[] = [
  step("step-scope", "message", "Understand request", "Find AI, RAG, and evaluation bookmarks", "completed", 0),
  step("step-search", "tool", "search_bookmarks", "Hybrid search across title, tags, summary, and embeddings", "completed", 1),
  step("step-rank", "tool", "rank_sources", "Grouped 18 candidates into 4 focused sources", "completed", 2),
];

export const DEMO_AGENT_MESSAGES: ChatMessage[] = [
  {
    role: "user",
    content: "Find the best bookmarks for planning an AI search feature.",
    timestamp: SCREENSHOT_BASE_TIME - 3 * 60 * 1000,
  },
  {
    role: "assistant",
    content:
      "Start with the OpenAI Platform Docs for model and tool-calling constraints, then pair it with the LlamaIndex and LangChain retrieval references for RAG architecture. For quality gates, keep the OpenAI Evals repository in the same workspace so implementation and regression checks stay connected.",
    timestamp: SCREENSHOT_BASE_TIME - 2 * 60 * 1000,
    sources: DEMO_AI_SOURCES,
    steps: DEMO_AGENT_STEPS,
  },
];

export const POPUP_CURRENT_PAGE: ControlledPopupPage = {
  tabId: 9101,
  url: "https://react.dev/blog/2026/ai-assisted-workflows",
  title: "AI-assisted React Workflows",
  content: {
    url: "https://react.dev/blog/2026/ai-assisted-workflows",
    title: "AI-assisted React Workflows",
    content:
      "<article><h1>AI-assisted React Workflows</h1><p>Teams are using agents to organize research, summarize design decisions, and keep release notes connected to implementation tasks.</p></article>",
    htmlContent:
      "<article><h1>AI-assisted React Workflows</h1><p>Teams are using agents to organize research, summarize design decisions, and keep release notes connected to implementation tasks.</p></article>",
    textContent:
      "Teams are using agents to organize research, summarize design decisions, and keep release notes connected to implementation tasks.",
    excerpt:
      "A practical guide to using AI-assisted workflows in React product teams.",
    favicon: favicon("https://react.dev"),
    metadata: {
      siteName: "React",
      description:
        "A practical guide to using AI-assisted workflows in React product teams.",
    },
    isReaderable: true,
  },
};

export const POPUP_AI_ANALYSIS: AnalysisResult = {
  title: "AI-assisted React Workflows",
  summary:
    "A practical workflow note on using AI agents to summarize research, organize implementation context, and keep React product teams aligned.",
  category: "React",
  tags: ["react", "ai", "workflow", "frontend"],
};

export function demoEmbeddings(): BookmarkEmbedding[] {
  return DEMO_BOOKMARKS.slice(0, 28).map((bookmarkItem, index) => ({
    bookmarkId: bookmarkItem.id,
    modelKey: "custom:e2e-embedding-model",
    dim: 3,
    vector: new Float32Array([0.1 + index / 100, 0.2, 0.3]).buffer,
    checksum: `screenshot-checksum-${bookmarkItem.id}`,
    createdAt: SCREENSHOT_BASE_TIME - index * 1000,
    updatedAt: SCREENSHOT_BASE_TIME - index * 1000,
  }));
}

export function demoSnapshotHtml(bookmarkItem: LocalBookmark): string {
  return `<!doctype html><html><head><title>${bookmarkItem.title}</title></head><body><article><h1>${bookmarkItem.title}</h1><p>${bookmarkItem.description}</p></article></body></html>`;
}

function category(
  id: string,
  name: string,
  parentId: string | null,
  order: number,
  icon?: string,
): LocalCategory {
  return {
    id,
    name,
    parentId,
    order,
    icon,
    createdAt: SCREENSHOT_BASE_TIME - (order + 40) * day,
  };
}

function bookmark(
  index: number,
  item: Pick<LocalBookmark, "title" | "url" | "description" | "categoryId" | "tags"> & {
    content?: string;
  },
): LocalBookmark {
  return {
    id: `bm-${String(index).padStart(2, "0")}`,
    url: item.url,
    title: item.title,
    description: item.description,
    content:
      item.content ??
      `${item.title}\n\n${item.description}\n\nTags: ${item.tags.join(", ")}`,
    categoryId: item.categoryId,
    tags: item.tags,
    favicon: favicon(item.url),
    hasSnapshot: index < 12,
    createdAt: SCREENSHOT_BASE_TIME - (index + 1) * day,
    updatedAt: SCREENSHOT_BASE_TIME - index * 60 * 60 * 1000,
  };
}

function workspaceCategory(
  id: string,
  name: string,
  order: number,
  icon?: string,
): WorkspaceCategory {
  return {
    id,
    name,
    icon,
    parentId: null,
    order,
    createdAt: SCREENSHOT_BASE_TIME - (order + 20) * day,
  };
}

function workspace(
  id: string,
  name: string,
  categoryId: string,
  order: number,
  pages: WorkspaceTabPage[],
): Workspace {
  return {
    id,
    name,
    description: `Saved research set with ${pages.length} focused pages.`,
    categoryId,
    tags: order === 0 ? ["launch", "ai", "research"] : order === 1 ? ["react", "ui"] : ["ops", "data"],
    pages,
    tabGroups: workspaceGroups,
    isRestored: order === 1,
    restoredAt: order === 1 ? SCREENSHOT_BASE_TIME - 2 * day : undefined,
    convertedToBookmarks: false,
    createdAt: SCREENSHOT_BASE_TIME - (order + 4) * day,
    updatedAt: SCREENSHOT_BASE_TIME - order * day,
  };
}

function page(
  title: string,
  url: string,
  tabGroupId: number,
  index: number,
): WorkspaceTabPage {
  return {
    id: `page-${slug(title)}`,
    title,
    url,
    domain: new URL(url).hostname,
    favicon: favicon(url),
    pinned: index === 0,
    windowId: 1,
    index,
    tabGroupId,
    bookmarkRecommendation: index < 3 ? "recommended" : undefined,
  };
}

function tabRule(
  id: string,
  name: string,
  groupTitle: string,
  color: TabGroupRule["color"],
  matchType: TabGroupRule["matchType"],
  matchCondition: NonNullable<TabGroupRule["matchCondition"]>,
  pattern: string,
  order: number,
): TabGroupRule {
  return {
    id,
    name,
    enabled: order !== 8,
    matchType,
    matchCondition,
    pattern,
    groupTitle,
    color,
    collapsed: false,
    order,
    createdAt: SCREENSHOT_BASE_TIME - (order + 6) * day,
    updatedAt: SCREENSHOT_BASE_TIME - order * 60 * 60 * 1000,
  };
}

function pinned(type: PinnedItem["type"], targetId: string, order: number): PinnedItem {
  const timestamp = SCREENSHOT_BASE_TIME - order * 1000;
  return {
    id: `${type}_${targetId}`,
    type,
    targetId,
    pinnedAt: timestamp,
    order: timestamp,
  };
}

function step(
  id: string,
  type: AgentProcessStep["type"],
  title: string,
  content: string,
  status: AgentProcessStep["status"],
  offset: number,
): AgentProcessStep {
  return {
    id,
    type,
    title,
    content,
    status,
    timestamp: SCREENSHOT_BASE_TIME - offset * 1000,
  };
}

function source(index: number, bookmarkItem: LocalBookmark, score: number): Source {
  return {
    index,
    bookmarkId: bookmarkItem.id,
    title: bookmarkItem.title,
    url: bookmarkItem.url,
    score,
    keywordScore: score - 0.06,
    semanticScore: score,
    matchReason: "Matches AI search planning and retrieval workflow tags.",
  };
}

function favicon(url: string): string {
  const { origin } = new URL(url);
  return `https://www.google.com/s2/favicons?domain_url=${encodeURIComponent(origin)}&sz=64`;
}

function slug(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 48);
}
