import pLimit from "p-limit";
import { bookmarkStorage } from "@/lib/storage/bookmark-storage";
import { bookmarkHealthStorage } from "@/lib/storage/bookmark-health-storage";
import {
  appendLocalIssueCodes,
  buildDuplicateIssueMap,
  classifyHttpStatus,
  normalizeHealthUrl,
} from "@/lib/health/bookmark-health-utils";
import type { BookmarkHealthRecord, LocalBookmark } from "@/types";

const REQUEST_TIMEOUT_MS = 12_000;
const SCAN_CONCURRENCY = 4;

async function fetchForHealth(url: string, signal: AbortSignal): Promise<Response> {
  const head = await fetch(url, {
    method: "HEAD",
    redirect: "follow",
    cache: "no-store",
    credentials: "omit",
    signal,
  });
  if (head.status !== 405 && head.status !== 501) return head;

  const response = await fetch(url, {
    method: "GET",
    headers: { Range: "bytes=0-0" },
    redirect: "follow",
    cache: "no-store",
    credentials: "omit",
    signal,
  });
  void response.body?.cancel();
  return response;
}

export class BookmarkHealthService {
  async checkBookmark(bookmark: LocalBookmark): Promise<BookmarkHealthRecord> {
    const checkedAt = Date.now();
    const normalizedSource = normalizeHealthUrl(bookmark.url);
    if (!normalizedSource) {
      return {
        bookmarkId: bookmark.id,
        sourceUrl: bookmark.url,
        checkedAt,
        status: "unsupported",
        issueCodes: ["unsupported_protocol"],
      };
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
    const startedAt = performance.now();
    try {
      const response = await fetchForHealth(bookmark.url, controller.signal);
      const finalUrl = response.url || bookmark.url;
      const redirected =
        response.redirected || normalizeHealthUrl(finalUrl) !== normalizedSource;
      const status = classifyHttpStatus(response.status, redirected);
      return {
        bookmarkId: bookmark.id,
        sourceUrl: bookmark.url,
        checkedAt,
        status,
        httpStatus: response.status,
        finalUrl: redirected ? finalUrl : undefined,
        issueCodes:
          status === "healthy" ? [] : [status === "redirected" ? "redirected" : status],
        responseTimeMs: Math.round(performance.now() - startedAt),
      };
    } catch (error) {
      const timedOut = controller.signal.aborted;
      return {
        bookmarkId: bookmark.id,
        sourceUrl: bookmark.url,
        checkedAt,
        status: "network_error",
        issueCodes: [timedOut ? "timeout" : "network_error"],
        responseTimeMs: Math.round(performance.now() - startedAt),
        error: error instanceof Error ? error.message : String(error),
      };
    } finally {
      clearTimeout(timeout);
    }
  }

  async scan(bookmarkIds?: string[]): Promise<BookmarkHealthRecord[]> {
    const allBookmarks = await bookmarkStorage.getBookmarks();
    const requestedIds = bookmarkIds ? new Set(bookmarkIds) : null;
    const bookmarks = requestedIds
      ? allBookmarks.filter((bookmark) => requestedIds.has(bookmark.id))
      : allBookmarks;
    const duplicateIssues = buildDuplicateIssueMap(allBookmarks);
    const limit = pLimit(SCAN_CONCURRENCY);

    return Promise.all(
      bookmarks.map((bookmark) =>
        limit(async () => {
          const checked = appendLocalIssueCodes(
            await this.checkBookmark(bookmark),
            bookmark,
            duplicateIssues,
          );
          await bookmarkHealthStorage.set(checked);
          return checked;
        }),
      ),
    );
  }
}

export const bookmarkHealthService = new BookmarkHealthService();
