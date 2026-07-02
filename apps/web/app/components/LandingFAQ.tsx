import React, { useState } from 'react';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@ui/components/accordion';
import { cn } from '@ui/lib/utils';

interface LandingFAQProps {
  isEn: boolean;
}

type FAQCategory = 'general' | 'privacy' | 'ai' | 'sync';

const categories: { id: FAQCategory; labelEn: string; labelZh: string }[] = [
  { id: 'general', labelEn: 'GENERAL', labelZh: '通用' },
  { id: 'privacy', labelEn: 'PRIVACY & DATA', labelZh: '隐私与数据' },
  { id: 'ai', labelEn: 'AI FEATURES', labelZh: 'AI 功能' },
  { id: 'sync', labelEn: 'SYNC & BACKUP', labelZh: '同步与备份' },
];

const faqs: Record<FAQCategory, { qEn: string; aEn: string; qZh: string; aZh: string }[]> = {
  general: [
    {
      qEn: 'What is HamHome?',
      aEn: 'HamHome is an AI browser workspace. It combines bookmark capture, page snapshots, semantic search, an Agent that understands and operates HamHome, saved tab workspaces, native Tab Group automation, import/export, and WebDAV migration.',
      qZh: '什么是 HamHome？',
      aZh: 'HamHome 是一个 AI 浏览器工作台，整合了书签收藏、网页快照、语义搜索、能理解并操作插件的 Agent、标签页工作空间、原生 Tab Group 自动化、导入导出和 WebDAV 迁移。'
    },
    {
      qEn: 'Which browsers are supported?',
      aEn: 'HamHome supports Chrome / Chromium and Microsoft Edge with Manifest V3 builds. Firefox builds are also provided; native Tab Group automation depends on the browser API support available in Firefox.',
      qZh: '支持哪些浏览器？',
      aZh: 'HamHome 支持 Chrome / Chromium 和 Microsoft Edge 的 Manifest V3 构建，也提供 Firefox 构建；原生 Tab Group 自动化取决于 Firefox 当前可用的浏览器 API 支持。'
    },
    {
      qEn: 'Is this only a bookmark manager?',
      aEn: 'No. Bookmarks are the long-term layer, but HamHome also manages current browsing sessions through workspaces and Tab Group rules. You can save open tabs, restore selected pages, and convert useful workspace pages into bookmarks later.',
      qZh: '它只是一个书签管理器吗？',
      aZh: '不是。书签是长期归档层，HamHome 也通过工作空间和 Tab 分组规则管理当前浏览会话。你可以保存打开的标签页，稍后恢复选中页面，再把有价值的工作空间页面转成正式书签。'
    }
  ],
  privacy: [
    {
      qEn: 'Where is my data stored?',
      aEn: 'Primary data is stored locally in browser storage and IndexedDB. That includes bookmarks, categories, settings, snapshots, AI cache, vector data, workspaces, and rules.',
      qZh: '我的数据存储在哪里？',
      aZh: '主要数据保存在浏览器存储和 IndexedDB 中，包括书签、分类、设置、快照、AI 缓存、向量数据、工作空间和规则。'
    },
    {
      qEn: 'Are my private sites sent to AI?',
      aEn: 'You can configure privacy domains and use automatic privacy detection so sensitive sites skip AI analysis. AI keys, Base URLs, privacy domains, WebDAV credentials, and browser shortcuts are manually configured by the user.',
      qZh: '我的私人网站内容会发送给 AI 吗？',
      aZh: '你可以配置隐私域名并启用自动隐私检测，让敏感站点跳过 AI 分析。API Key、Base URL、隐私域名、WebDAV 凭据和浏览器快捷键都由用户手动配置。'
    },
    {
      qEn: 'Can the Agent change sensitive settings?',
      aEn: 'No. The Agent can explain settings, open relevant extension views, inspect safe status, and adjust safe non-sensitive options, but it does not read or fill API keys, Base URLs, privacy domains, sync credentials, or browser shortcuts.',
      qZh: 'Agent 能修改敏感设置吗？',
      aZh: '不能。Agent 可以解释设置含义、打开相关插件页面、检查安全状态，并在安全白名单内调整非敏感开关，但不会读取或代填 API Key、Base URL、隐私域名、同步凭据或浏览器快捷键。'
    }
  ],
  ai: [
    {
      qEn: 'Do I need to pay for AI features?',
      aEn: 'HamHome uses a Bring Your Own Key model. You connect your own provider account or local endpoint and pay providers directly for usage.',
      qZh: '我需要为 AI 功能付费吗？',
      aZh: 'HamHome 采用自带密钥模式。你接入自己的 Provider 账号或本地端点，并直接向 Provider 支付实际使用费用。'
    },
    {
      qEn: 'Which AI providers are supported?',
      aEn: 'Chat providers include OpenAI, Anthropic, Google Gemini, Azure OpenAI, DeepSeek, Groq, Mistral, Moonshot/Kimi, Zhipu/GLM, Tencent Hunyuan, NVIDIA NIM, SiliconFlow, Ollama, and custom OpenAI-compatible APIs. Embeddings are configured separately for semantic search.',
      qZh: '支持哪些 AI Provider？',
      aZh: '聊天模型支持 OpenAI、Anthropic、Google Gemini、Azure OpenAI、DeepSeek、Groq、Mistral、Moonshot/Kimi、智谱/GLM、腾讯混元、NVIDIA NIM、SiliconFlow、Ollama 和自定义 OpenAI 兼容 API。语义搜索的 Embedding 会单独配置。'
    },
    {
      qEn: 'What is new about the Agent UI?',
      aEn: 'The current Agent UI has a floating launcher, session switching, visible process steps, context cards, suggestion chips, extension navigation, and safe action execution. The landing page now reflects that global Agent surface.',
      qZh: '新版 Agent UI 有什么变化？',
      aZh: '当前 Agent UI 包含悬浮入口、会话切换、可见执行过程、上下文卡片、建议操作、插件页面导航和安全动作执行，落地页现在展示的也是这一套全局 Agent 形态。'
    }
  ],
  sync: [
    {
      qEn: 'Can I sync my data across multiple devices?',
      aEn: 'Yes. WebDAV sync writes structured HamHome data under /HamHomeSync, including settings, bookmarks and bookmark text content, categories, workspaces, workspace categories, Tab Group rules, and auto-group settings.',
      qZh: '我可以在多个设备之间同步我的数据吗？',
      aZh: '可以。WebDAV 会在 /HamHomeSync 下同步结构化数据，包括设置、书签与书签正文、分类、工作空间、工作空间分类、Tab 分组规则和自动分组设置。'
    },
    {
      qEn: 'Are local snapshots synced through WebDAV?',
      aEn: 'The current WebDAV sync focuses on structured data and bookmark text content. Local HTML/Markdown snapshot blobs remain local unless you export them or send Markdown-style notes through the Obsidian workflow.',
      qZh: '本地快照会通过 WebDAV 同步吗？',
      aZh: '当前 WebDAV 同步重点是结构化数据和书签正文。本地 HTML/Markdown 快照 Blob 默认仍在本机，除非你导出它们，或通过 Obsidian 工作流发送 Markdown 风格笔记。'
    },
    {
      qEn: 'Can I move data back to the browser bookmark bar?',
      aEn: 'Yes. HamHome can write organized bookmarks back to the browser bookmark bar, with options for root folder, clear-first behavior, and duplicate skipping.',
      qZh: '可以把数据写回浏览器书签栏吗？',
      aZh: '可以。HamHome 支持把整理后的书签写回浏览器书签栏，并可配置根文件夹、是否先清空目标区域和是否跳过重复项。'
    }
  ]
};

export function LandingFAQ({ isEn }: LandingFAQProps) {
  const [activeCategory, setActiveCategory] = useState<FAQCategory>('general');

  const title = isEn ? 'Frequently asked questions' : '常见问题';
  const currentCategoryData = categories.find((c) => c.id === activeCategory);
  const currentCategoryLabel = isEn ? currentCategoryData?.labelEn : currentCategoryData?.labelZh;

  return (
    <section className="mx-auto w-full px-4 py-16 sm:px-6 lg:px-8 lg:py-24 container border-t border-border/10">
      <div className="w-full">
        {/* 标题 */}
        <h2 className="text-4xl md:text-5xl font-semibold mb-16 tracking-tight">
          {title}
        </h2>

        <div className="flex flex-col md:flex-row gap-12 md:gap-24">
          {/* 左侧分类导航 */}
          <div className="md:w-1/4 flex-shrink-0">
            <div className="flex md:flex-col gap-2 overflow-x-auto pb-4 md:pb-0 md:sticky md:top-24 scrollbar-none">
              {categories.map((category) => {
                const isActive = activeCategory === category.id;
                const label = isEn ? category.labelEn : category.labelZh;
                return (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={cn(
                      "flex items-center text-left py-2 px-3 text-sm font-medium transition-colors whitespace-nowrap rounded-md",
                      isActive 
                        ? "text-foreground" 
                        : "text-muted-foreground hover:text-foreground/80 hover:bg-muted/30"
                    )}
                  >
                    {/* Github style green indicator */}
                    <span 
                      className={cn(
                        "w-2 h-2 mr-3 rounded-sm transition-colors",
                        isActive ? "bg-primary" : "bg-transparent"
                      )} 
                    />
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 右侧问题列表 */}
          <div className="md:w-3/4 flex-1">
            <h3 className="text-sm font-semibold text-muted-foreground mb-6 uppercase tracking-wider">
              {currentCategoryLabel}
            </h3>
            
            <Accordion type="single" collapsible className="w-full" defaultValue="item-0">
              {faqs[activeCategory].map((faq, index) => {
                const q = isEn ? faq.qEn : faq.qZh;
                const a = isEn ? faq.aEn : faq.aZh;
                
                return (
                  <AccordionItem 
                    key={`${activeCategory}-${index}`} 
                    value={`item-${index}`}
                    className="border-border/10 border-b last:border-0"
                  >
                    <AccordionTrigger className="text-left text-lg py-6 hover:no-underline hover:text-primary transition-colors [&_svg]:text-primary">
                      {q}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground text-base leading-relaxed pb-6 pr-8">
                      {a}
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
          </div>
        </div>
      </div>
    </section>
  );
}
