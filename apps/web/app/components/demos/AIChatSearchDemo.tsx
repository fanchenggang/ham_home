"use client";

import { useMemo, useState } from "react";
import {
  AlertCircle,
  Bot,
  CheckCircle2,
  ChevronDown,
  Copy,
  Loader2,
  Plus,
  Send,
  Sparkles,
  Trash2,
  Wrench,
  X,
} from "lucide-react";
import { Button, cn } from "@hamhome/ui";
import type { Bookmark } from "@/data/mock-bookmarks";

interface AIChatSearchDemoProps {
  bookmarks: Bookmark[];
  isEn: boolean;
  className?: string;
  onSourceClick?: (bookmarkId: string) => void;
}

interface AgentStep {
  id: string;
  type: "tool" | "skill" | "message";
  title: string;
  content: string;
  status: "running" | "completed" | "failed";
}

function getTexts(isEn: boolean) {
  return {
    title: isEn ? "HamHome Agent" : "HamHome Agent",
    session: isEn ? "Research cleanup" : "资料整理",
    empty: isEn
      ? "Let the Agent understand HamHome, check safe settings, open extension views, or search bookmarks."
      : "让 Agent 理解 HamHome、检查安全配置、打开插件页面，或搜索书签。",
    placeholder: isEn ? "Tell the Agent what to handle..." : "告诉 Agent 要处理什么...",
    process: isEn ? "Process" : "执行过程",
    sources: isEn ? "Context" : "参考",
    userQuery: isEn
      ? "Check WebDAV status and open Import / Export"
      : "检查 WebDAV 状态，并打开导入导出页面",
    answer: isEn
      ? "WebDAV sync is not configured yet. I can open Import / Export so you can import browser bookmarks, export a JSON backup, or connect WebDAV. I can also open Settings if you want to add credentials manually."
      : "当前还没有配置 WebDAV 同步。我可以打开导入导出页面，方便你导入浏览器书签、导出 JSON 备份或连接 WebDAV。如果要填写凭据，我也可以打开设置页，但凭据需要你手动输入。",
    steps: isEn
      ? [
          { id: "skill", type: "skill" as const, title: "Load HamHome feature guide", content: "Use bookmark and semantic-search guidance", status: "completed" as const },
          { id: "tool", type: "tool" as const, title: "inspect_sync_status", content: "scope: WebDAV, credentials: hidden", status: "completed" as const },
          { id: "message", type: "message" as const, title: "Open extension view", content: "target: Import / Export", status: "completed" as const },
        ]
      : [
          { id: "skill", type: "skill" as const, title: "读取 HamHome 功能指南", content: "使用同步、导入导出与安全边界说明", status: "completed" as const },
          { id: "tool", type: "tool" as const, title: "inspect_sync_status", content: "scope: WebDAV, credentials: hidden", status: "completed" as const },
          { id: "message", type: "message" as const, title: "打开插件页面", content: "target: 导入导出", status: "completed" as const },
        ],
    suggestions: isEn
      ? ["Open Import / Export", "Check WebDAV status", "Open settings", "Search recent bookmarks"]
      : ["打开导入导出", "检查 WebDAV 状态", "打开设置", "搜索最近书签"],
  };
}

function StepIcon({ step }: { step: AgentStep }) {
  if (step.status === "failed") return <AlertCircle className="h-3.5 w-3.5 text-destructive" />;
  if (step.status === "running") return <Loader2 className="h-3.5 w-3.5 animate-spin text-indigo-500" />;
  if (step.type === "tool") return <Wrench className="h-3.5 w-3.5 text-cyan-600 dark:text-cyan-400" />;
  return <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />;
}

export function AIChatSearchDemo({
  bookmarks,
  isEn,
  className,
  onSourceClick,
}: AIChatSearchDemoProps) {
  const texts = useMemo(() => getTexts(isEn), [isEn]);
  const [query, setQuery] = useState("");
  const [showProcess, setShowProcess] = useState(true);
  const sources = useMemo(
    () =>
      bookmarks
        .filter((bookmark) =>
          /react|performance|vercel|web/i.test(
            `${bookmark.title} ${bookmark.description} ${bookmark.tags.join(" ")}`,
          ),
        )
        .slice(0, 3),
    [bookmarks],
  );

  return (
    <section
      className={cn(
        "flex h-[560px] min-h-0 flex-col overflow-hidden rounded-2xl border border-white/20 bg-background/80 shadow-2xl shadow-black/10 backdrop-blur-xl ring-1 ring-black/5 dark:ring-white/10",
        className,
      )}
    >
      <header className="border-b border-white/10 bg-transparent px-4 py-3 dark:border-white/5">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-md">
            <Bot className="h-4 w-4" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-sm font-bold text-transparent">
              {texts.title}
            </div>
            <div className="truncate text-xs font-medium text-muted-foreground/70">
              {texts.session}
            </div>
          </div>
          <Button type="button" variant="ghost" size="icon" className="h-8 w-8 rounded-full">
            <Plus className="h-4 w-4" />
          </Button>
          <Button type="button" variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:text-destructive">
            <Trash2 className="h-4 w-4" />
          </Button>
          <Button type="button" variant="ghost" size="icon" className="h-8 w-8 rounded-full">
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="relative mt-3">
          <select
            value="research"
            onChange={() => undefined}
            className="h-8 w-full appearance-none rounded-lg border border-transparent bg-foreground/5 px-3 pr-8 text-xs font-medium text-foreground outline-none"
          >
            <option value="research">{texts.session}</option>
          </select>
          <ChevronDown className="pointer-events-none absolute right-2.5 top-2 h-4 w-4 text-muted-foreground/70" />
        </div>
      </header>

      <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-4 py-5">
        <div className="flex justify-center">
          <div className="flex max-w-[220px] flex-col items-center gap-3 py-2 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-500/10 text-indigo-500">
              <Sparkles className="h-6 w-6" />
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground">{texts.empty}</p>
          </div>
        </div>

        <div className="flex justify-end">
          <div className="max-w-[88%] rounded-2xl rounded-tr-sm bg-gradient-to-br from-indigo-500 to-blue-600 px-4 py-2.5 text-sm leading-relaxed text-white shadow-sm shadow-indigo-500/20">
            {texts.userQuery}
          </div>
        </div>

        <div className="flex justify-start">
          <div className="max-w-[92%] rounded-2xl rounded-tl-sm border border-indigo-100 bg-gradient-to-br from-indigo-50/80 to-blue-50/80 px-4 py-3 text-sm leading-relaxed text-foreground shadow-sm backdrop-blur-md dark:border-indigo-900/50 dark:from-indigo-950/40 dark:to-blue-950/40">
            <div className="mb-2.5 rounded-xl border border-white/10 bg-background/50 p-2.5 shadow-inner">
              <button
                type="button"
                onClick={() => setShowProcess((prev) => !prev)}
                className="flex w-full items-center justify-between text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/80"
              >
                <span className="flex items-center gap-1.5">
                  <Sparkles className="h-3 w-3 text-indigo-500" />
                  {texts.process}
                </span>
                <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", !showProcess && "-rotate-90")} />
              </button>
              {showProcess && (
                <div className="mt-2.5 space-y-2 border-t border-border/40 pt-2.5">
                  {texts.steps.map((step) => (
                    <div key={step.id} className="grid grid-cols-[18px_1fr] gap-2.5 text-xs">
                      <div className="pt-0.5">
                        <StepIcon step={step} />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="truncate font-medium text-foreground/90">{step.title}</span>
                          <span className="shrink-0 rounded-full bg-foreground/5 px-1.5 py-0.5 text-[9px] uppercase tracking-wider text-muted-foreground">
                            {step.status}
                          </span>
                        </div>
                        <p className="mt-1 truncate text-[11px] text-muted-foreground/90">{step.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <p>{texts.answer}</p>
            {sources.length > 0 && (
              <div className="mt-3.5 space-y-2">
                <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/80">
                  {texts.sources}
                </div>
                <div className="flex flex-col gap-1.5">
                  {sources.map((source, index) => (
                    <button
                      key={source.id}
                      type="button"
                      onClick={() => onSourceClick?.(source.id)}
                      className="group block w-full rounded-xl border border-border/50 bg-background/50 px-3 py-2 text-left text-xs transition-all hover:border-indigo-500/30 hover:bg-indigo-50/50 dark:hover:bg-indigo-500/10"
                    >
                      <span className="line-clamp-1 font-medium text-foreground/90 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                        {index + 1}. {source.title}
                      </span>
                      <span className="mt-0.5 line-clamp-1 text-[11px] text-muted-foreground/70">
                        {source.url}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 px-4 pb-3">
        {texts.suggestions.map((suggestion) => (
          <button
            key={suggestion}
            type="button"
            onClick={() => setQuery(suggestion)}
            className="rounded-full border border-border/60 bg-background/50 px-3 py-1.5 text-[11px] font-medium text-muted-foreground/80 shadow-sm backdrop-blur-sm transition-all hover:-translate-y-0.5 hover:border-indigo-500/30 hover:text-indigo-600 hover:shadow dark:hover:text-indigo-400"
          >
            {suggestion === (isEn ? "Copy all links" : "复制所有链接") ? (
              <span className="inline-flex items-center gap-1.5">
                <Copy className="h-3 w-3" />
                {suggestion}
              </span>
            ) : (
              suggestion
            )}
          </button>
        ))}
      </div>

      <form
        onSubmit={(event) => event.preventDefault()}
        className="border-t border-white/10 bg-background/50 p-3 backdrop-blur-md dark:border-white/5"
      >
        <div className="flex items-end gap-2">
          <textarea
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            rows={1}
            className="max-h-32 min-h-[44px] flex-1 resize-none rounded-xl border border-transparent bg-muted/50 px-4 py-3 text-sm leading-relaxed outline-none transition-all placeholder:text-muted-foreground/60 focus:border-indigo-500/30 focus:bg-background focus:ring-2 focus:ring-indigo-500/20"
            placeholder={texts.placeholder}
          />
          <Button
            type="submit"
            size="icon"
            className="h-11 w-11 shrink-0 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 text-white shadow-md"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </section>
  );
}
