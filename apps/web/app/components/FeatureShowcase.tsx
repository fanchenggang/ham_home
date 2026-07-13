"use client";

import {
  Bot,
  Boxes,
  Brain,
  Layers3,
  LibraryBig,
  PanelLeftOpen,
  Upload,
} from "lucide-react";
import type { ReactNode } from "react";
import { FeatureSection } from "./FeatureSection";
import { ExtensionScreenshotFrame } from "./ExtensionScreenshotFrame";
import type { ExtensionScreenshotId } from "./extensionScreenshots";

interface FeatureShowcaseProps {
  isEn: boolean;
  isDark: boolean;
}

interface ShowcaseFeature {
  id: string;
  icon: ReactNode;
  title: string;
  description: string;
  screenshotIds: ExtensionScreenshotId[];
  bullets: string[];
}

function getShowcaseFeatures(isEn: boolean): ShowcaseFeature[] {
  if (isEn) {
    return [
      {
        id: "ai-save",
        icon: <Brain className="h-5 w-5" />,
        title: "Capture pages with AI, snapshots, and privacy controls",
        description:
          "The popup reads the active page, extracts content, suggests summaries, categories, and tags, and can save local HTML or Markdown snapshots.",
        screenshotIds: ["popupSave", "contentPanel"],
        bullets: [
          "Popup, context menu, shortcut, and in-page panel entry points",
          "Defuddle, Mozilla Readability, and SingleFile-style capture",
          "Private domains and automatic privacy detection can skip AI analysis",
        ],
      },
      {
        id: "bookmark-manage",
        icon: <LibraryBig className="h-5 w-5" />,
        title: "Manage the full bookmark library without losing scanability",
        description:
          "The management view supports category trees, tag filters, custom filters, batch edits, snapshot actions, and AI re-analysis for large collections.",
        screenshotIds: ["bookmarkLibrary", "bookmarkBulkActions"],
        bullets: [
          "Grid and list style management surfaces",
          "Batch tags, category moves, deletes, and AI analysis",
          "Tag cloud, custom filters, snapshots, and storage visibility",
        ],
      },
      {
        id: "agent-control",
        icon: <Bot className="h-5 w-5" />,
        title: "Let the Agent understand and operate HamHome for you",
        description:
          "The Agent can read HamHome's feature and settings context, explain how the extension works, open views, inspect status, run tools, and handle safe configuration changes.",
        screenshotIds: ["aiAgent"],
        bullets: [
          "Understands extension features, settings, status, and saved data",
          "Opens pages, runs supported tools, and shows process traces",
          "Reduces manual setup and navigation; credentials stay manual",
        ],
      },
      {
        id: "workspace-manage",
        icon: <Boxes className="h-5 w-5" />,
        title: "Save open tabs as restorable workspaces",
        description:
          "Workspaces preserve tab order, pinned state, domains, favicons, and native Tab Group metadata, then restore all or selected pages later.",
        screenshotIds: ["workspaces"],
        bullets: [
          "Independent workspace categories and tags",
          "Duplicate detection and bookmark conversion candidates",
          "Restore into current or new windows while skipping duplicate URLs",
        ],
      },
      {
        id: "tab-groups",
        icon: <Layers3 className="h-5 w-5" />,
        title: "Automate native browser Tab Groups",
        description:
          "Create rules by domain, URL, title, case-insensitive title, or regex. Unmatched tabs can fall back to domain grouping or AI grouping.",
        screenshotIds: ["tabGroups"],
        bullets: [
          "Manual rules always run first",
          "Group title, color, collapsed state, order, and match conditions",
          "AI grouping uses metadata, existing group names, and custom instructions",
        ],
      },
      {
        id: "import-export",
        icon: <Upload className="h-5 w-5" />,
        title: "Import, export, sync, and move data on your terms",
        description:
          "Import browser bookmarks, export JSON/HTML backups, write HamHome bookmarks back to the browser bar, and sync structured data through WebDAV.",
        screenshotIds: ["importExportSync"],
        bullets: [
          "JSON backup includes bookmarks, workspaces, and Tab Group config",
          "WebDAV sync covers settings, categories, bookmark text, workspaces, and rules",
          "Obsidian flow can turn Markdown snapshots into notes",
        ],
      },
    ];
  }

  const features: ShowcaseFeature[] = [
    {
      id: "ai-save",
      icon: <Brain className="h-5 w-5" />,
      title: "用 AI、快照和隐私控制保存网页",
      description:
        "保存弹窗会读取当前页面，提取正文与元信息，推荐摘要、分类和标签，并可保存本地 HTML 或 Markdown 快照。",
      screenshotIds: ["popupSave", "contentPanel"],
      bullets: [
        "支持弹窗、右键菜单、快捷键和网页内面板入口",
        "结合 Defuddle、Mozilla Readability 与 SingleFile 风格捕获",
        "隐私域名和自动隐私检测可跳过 AI 分析",
      ],
    },
    {
      id: "bookmark-manage",
      icon: <LibraryBig className="h-5 w-5" />,
      title: "大量书签也能保持可扫读、可批量整理",
      description:
        "管理页支持分类树、标签筛选、自定义筛选器、批量编辑、快照操作和 AI 重新分析，适合长期维护收藏库。",
      screenshotIds: ["bookmarkLibrary", "bookmarkBulkActions"],
      bullets: [
        "网格与列表式管理界面",
        "批量打标签、移动分类、删除与 AI 分析",
        "标签云、自定义筛选、快照和存储占用可见",
      ],
    },
    {
      id: "agent-control",
      icon: <Bot className="h-5 w-5" />,
      title: "让 Agent 理解插件，并替你完成常见操作",
      description:
        "Agent 可以读取 HamHome 的功能与配置上下文，解释插件怎么用，打开页面，检查状态，执行工具，并处理安全白名单内的配置调整。",
      screenshotIds: ["aiAgent"],
      bullets: [
        "理解插件功能、设置项、当前状态和已保存数据",
        "可打开页面、执行支持的工具，并展示过程步骤",
        "减少手动配置和页面跳转，凭据仍由你手动填写",
      ],
    },
    {
      id: "workspace-manage",
      icon: <Boxes className="h-5 w-5" />,
      title: "把打开的标签页保存成可恢复工作空间",
      description:
        "工作空间会保留页面顺序、固定状态、域名、favicon 和原生 Tab Group 信息，稍后可恢复全部或选中页面。",
      screenshotIds: ["workspaces"],
      bullets: [
        "工作空间拥有独立分类和标签",
        "识别重复页面，并推荐适合转为书签的页面",
        "恢复到当前窗口或新窗口时可跳过重复 URL",
      ],
    },
    {
      id: "tab-groups",
      icon: <Layers3 className="h-5 w-5" />,
      title: "自动整理浏览器原生 Tab Group",
      description:
        "可按域名、URL、标题、忽略大小写标题或正则创建规则。未命中时还可选择按根域名或 AI 自动分组。",
      screenshotIds: ["tabGroups"],
      bullets: [
        "手动规则始终优先匹配",
        "可配置组名、颜色、折叠状态、排序和匹配条件",
        "AI 分组会参考页面元数据、已有组名和自定义要求",
      ],
    },
    {
      id: "import-export",
      icon: <Upload className="h-5 w-5" />,
      title: "导入、导出、同步和迁移都由你控制",
      description:
        "可导入浏览器书签、导出 JSON/HTML 备份、反向写回浏览器书签栏，也可以通过 WebDAV 同步结构化数据。",
      screenshotIds: ["importExportSync"],
      bullets: [
        "JSON 备份包含书签、工作空间和 Tab 分组配置",
        "WebDAV 同步设置、分类、书签正文、工作空间和规则",
        "Obsidian 流程可将 Markdown 快照发送为笔记",
      ],
    },
  ];

  return features;
}

export function FeatureShowcase({ isEn, isDark }: FeatureShowcaseProps) {
  const features = getShowcaseFeatures(isEn);

  return (
    <div className="feature-showcase">
      {features.map((feature, index) => (
        <FeatureSection
          key={feature.id}
          id={feature.id}
          icon={feature.icon}
          title={feature.title}
          description={feature.description}
          alternate={index % 2 === 1}
        >
          <div className="grid gap-6 lg:grid-cols-[1fr_340px] lg:items-start">
            <div
              className={
                feature.screenshotIds.length > 1
                  ? "grid gap-4 md:grid-cols-[0.42fr_1fr]"
                  : "grid gap-4"
              }
            >
              {feature.screenshotIds.map((id, screenshotIndex) => (
                <ExtensionScreenshotFrame
                  key={id}
                  id={id}
                  isEn={isEn}
                  isDark={isDark}
                  priority={index === 0 && screenshotIndex === 0}
                  className={feature.screenshotIds.length === 1 ? "w-full" : undefined}
                />
              ))}
            </div>

            <aside className="rounded-2xl border border-border/70 bg-background/65 p-5 shadow-sm backdrop-blur">
              <div className="mb-4 flex items-center gap-2 text-sm font-bold text-[#0f766e] dark:text-[#5eead4]">
                <PanelLeftOpen className="h-4 w-4" />
                {isEn ? "What this reflects in the extension" : "对应插件真实能力"}
              </div>
              <ul className="space-y-3">
                {feature.bullets.map((bullet) => (
                  <li key={bullet} className="flex gap-3 text-sm leading-relaxed text-muted-foreground">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#ff5b24]" />
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            </aside>
          </div>
        </FeatureSection>
      ))}
    </div>
  );
}
