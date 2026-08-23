import { getFavicon } from "@hamhome/utils";
import type {
  PageContent,
  SaveFlowClipContext,
  TextQuoteSelector,
} from "@/types";

function getElementPath(node: Node | null): string | undefined {
  const element =
    node instanceof Element ? node : node?.parentElement ?? undefined;
  if (!element) return undefined;

  const parts: string[] = [];
  let current: Element | null = element;
  while (current && current !== document.body && parts.length < 8) {
    let part = current.tagName.toLowerCase();
    if (current.id) {
      part += `#${CSS.escape(current.id)}`;
      parts.unshift(part);
      break;
    }
    const parentElement: Element | null = current.parentElement;
    if (parentElement) {
      const siblings: Element[] = Array.from(parentElement.children).filter(
        (child) => child.tagName === current?.tagName,
      );
      if (siblings.length > 1) part += `:nth-of-type(${siblings.indexOf(current) + 1})`;
    }
    parts.unshift(part);
    current = parentElement;
  }
  return parts.join(" > ") || undefined;
}

function createTextQuoteSelector(exact: string): TextQuoteSelector {
  const selection = window.getSelection();
  const range = selection?.rangeCount ? selection.getRangeAt(0) : null;
  const bodyText = document.body?.innerText ?? "";
  const index = bodyText.indexOf(exact);
  return {
    exact,
    prefix: index >= 0 ? bodyText.slice(Math.max(0, index - 64), index) : undefined,
    suffix:
      index >= 0 ? bodyText.slice(index + exact.length, index + exact.length + 64) : undefined,
    domPath: getElementPath(range?.startContainer ?? null),
  };
}

export function enrichClipContext(
  clip?: SaveFlowClipContext,
): SaveFlowClipContext | undefined {
  if (!clip) return undefined;
  const text = clip.text?.trim() || window.getSelection()?.toString().trim();
  return {
    ...clip,
    text: text || undefined,
    sourceUrl: clip.sourceUrl || window.location.href,
    sourceTitle: clip.sourceTitle || document.title,
    selector:
      clip.type === "highlight" && text
        ? createTextQuoteSelector(text)
        : clip.selector,
  };
}

/**
 * 链接剪藏保存目标链接本身，来源页只保存在 clip 上。
 * 未打开的目标页不复用来源页正文，也不触发截图或快照。
 */
export function applyClipTargetToPageContent(
  pageContent: PageContent,
  clip?: SaveFlowClipContext,
): PageContent {
  if (clip?.type !== "link" || !clip.targetUrl) return pageContent;
  let title = clip.targetUrl;
  try {
    title = new URL(clip.targetUrl).hostname || clip.targetUrl;
  } catch {
    // 保留原始目标地址供用户在保存面板中修正。
  }
  return {
    url: clip.targetUrl,
    title,
    content: "",
    htmlContent: "",
    textContent: "",
    excerpt: "",
    favicon: getFavicon(clip.targetUrl),
    isPrivate: false,
  };
}
