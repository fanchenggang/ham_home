import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ExternalLink,
  Highlighter,
  Image as ImageIcon,
  Link as LinkIcon,
  Loader2,
  StickyNote,
  Trash2,
} from "lucide-react";
import {
  Badge,
  Button,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  Textarea,
  confirm,
  toast,
} from "@hamhome/ui";
import { bookmarkClipStorage } from "@/lib/storage/bookmark-clip-storage";
import { bookmarkHealthStorage } from "@/lib/storage/bookmark-health-storage";
import { bookmarkScreenshotStorage } from "@/lib/storage/bookmark-screenshot-storage";
import { useBookmarkScreenshotUrl } from "@/hooks/useBookmarkScreenshot";
import type { BookmarkClip, BookmarkHealthRecord, LocalBookmark } from "@/types";

interface BookmarkDetailSheetProps {
  bookmark: LocalBookmark | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function BookmarkDetailSheet({
  bookmark,
  open,
  onOpenChange,
}: BookmarkDetailSheetProps) {
  const { t } = useTranslation(["bookmark", "common"]);
  const [clips, setClips] = useState<BookmarkClip[]>([]);
  const [health, setHealth] = useState<BookmarkHealthRecord | null>(null);
  const [note, setNote] = useState("");
  const [savingNote, setSavingNote] = useState(false);
  const { url: screenshotUrl, loading: screenshotLoading } =
    useBookmarkScreenshotUrl(open ? (bookmark?.id ?? null) : null, "image", open);

  const load = useCallback(async () => {
    if (!bookmark) return;
    const [nextClips, nextHealth] = await Promise.all([
      bookmarkClipStorage.getClipsByBookmark(bookmark.id),
      bookmarkHealthStorage.get(bookmark.id),
    ]);
    setClips(nextClips);
    setHealth(nextHealth?.sourceUrl === bookmark.url ? nextHealth : null);
  }, [bookmark]);

  useEffect(() => {
    if (!open || !bookmark) return;
    void load();
    const unwatchClips = bookmarkClipStorage.watch(() => void load());
    const unwatchHealth = bookmarkHealthStorage.watch(() => void load());
    return () => {
      unwatchClips();
      unwatchHealth();
    };
  }, [bookmark, load, open]);

  const addNote = useCallback(async () => {
    if (!bookmark || !note.trim()) return;
    setSavingNote(true);
    try {
      await bookmarkClipStorage.addClip(bookmark.id, {
        type: "note",
        note: note.trim(),
        sourceUrl: bookmark.url,
        sourceTitle: bookmark.title,
      });
      setNote("");
      await load();
    } finally {
      setSavingNote(false);
    }
  }, [bookmark, load, note]);

  const deleteClip = useCallback(
    async (clip: BookmarkClip) => {
      const accepted = await confirm({
        title: t("bookmark:detail.clipDeleteTitle"),
        description: t("bookmark:detail.clipDeleteDesc"),
        confirmText: t("common:common.delete"),
        cancelText: t("common:common.cancel"),
        variant: "destructive",
      });
      if (!accepted) return;
      await bookmarkClipStorage.deleteClip(clip.id);
      await load();
    },
    [load, t],
  );

  const deleteScreenshot = useCallback(async () => {
    if (!bookmark) return;
    const accepted = await confirm({
      title: t("bookmark:detail.screenshotDeleteTitle"),
      description: t("bookmark:detail.screenshotDeleteDesc"),
      confirmText: t("common:common.delete"),
      cancelText: t("common:common.cancel"),
      variant: "destructive",
    });
    if (!accepted) return;
    await bookmarkScreenshotStorage.delete(bookmark.id);
    toast.success(t("bookmark:detail.screenshotDeleted"));
    onOpenChange(false);
  }, [bookmark, onOpenChange, t]);

  const visibleIssues = useMemo(() => {
    if (!health) return [];
    const ignored = new Set(health.ignoredIssueCodes ?? []);
    return health.issueCodes.filter((issue) => !ignored.has(issue));
  }, [health]);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full gap-0 overflow-hidden p-0 sm:max-w-2xl">
        <SheetHeader className="border-b px-6 py-5 pr-12">
          <SheetTitle className="truncate">{bookmark?.title ?? ""}</SheetTitle>
          <SheetDescription className="truncate">{bookmark?.url ?? ""}</SheetDescription>
        </SheetHeader>

        {bookmark && (
          <div className="min-h-0 flex-1 space-y-7 overflow-y-auto p-6">
            <section className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold">{t("bookmark:detail.screenshot")}</h3>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => window.open(bookmark.url, "_blank")}
                  >
                    <ExternalLink className="mr-1.5 h-4 w-4" />
                    {t("bookmark:bookmark.open")}
                  </Button>
                  {screenshotUrl && (
                    <Button variant="ghost" size="icon" className="text-destructive" onClick={() => void deleteScreenshot()}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
              <div className="flex min-h-52 items-center justify-center overflow-hidden rounded-2xl border bg-muted/40">
                {screenshotUrl ? (
                  <img
                    src={screenshotUrl}
                    alt={bookmark.title}
                    className="max-h-[440px] w-full object-contain object-top"
                  />
                ) : screenshotLoading ? (
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                ) : (
                  <div className="max-w-sm p-8 text-center">
                    <ImageIcon className="mx-auto h-8 w-8 text-muted-foreground/40" />
                    <p className="mt-3 text-sm font-medium">{t("bookmark:detail.noScreenshot")}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {t("bookmark:detail.noScreenshotDesc")}
                    </p>
                  </div>
                )}
              </div>
            </section>

            <section className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold">
                  {t("bookmark:detail.clips", { count: clips.length })}
                </h3>
              </div>
              <div className="flex gap-2">
                <Textarea
                  value={note}
                  onChange={(event) => setNote(event.target.value)}
                  placeholder={t("bookmark:detail.notePlaceholder")}
                  className="min-h-20 resize-none"
                />
                <Button className="self-end" disabled={!note.trim() || savingNote} onClick={() => void addNote()}>
                  {savingNote && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {t("bookmark:detail.addNote")}
                </Button>
              </div>
              {clips.length === 0 ? (
                <div className="rounded-xl border border-dashed p-6 text-center text-sm text-muted-foreground">
                  {t("bookmark:detail.noClips")}
                </div>
              ) : (
                <div className="space-y-2">
                  {clips.map((clip) => (
                    <ClipCard key={clip.id} clip={clip} onDelete={() => void deleteClip(clip)} />
                  ))}
                </div>
              )}
            </section>

            <section className="space-y-3">
              <h3 className="text-sm font-semibold">{t("bookmark:detail.health")}</h3>
              {health ? (
                <div className="rounded-xl border p-4">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">
                      {t(`bookmark:healthCenter.status.${health.status}`)}
                    </Badge>
                    {health.httpStatus && (
                      <span className="text-xs text-muted-foreground">HTTP {health.httpStatus}</span>
                    )}
                  </div>
                  {visibleIssues.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {visibleIssues.map((issue) => (
                        <Badge key={issue} variant="secondary" className="font-normal">
                          {issue.startsWith("duplicate_url:")
                            ? t("bookmark:healthCenter.issues.duplicate_url")
                            : t(`bookmark:healthCenter.issues.${issue}`, { defaultValue: issue })}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <p className="rounded-xl border border-dashed p-5 text-sm text-muted-foreground">
                  {t("bookmark:detail.healthUnchecked")}
                </p>
              )}
            </section>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}

function ClipCard({ clip, onDelete }: { clip: BookmarkClip; onDelete: () => void }) {
  const { t } = useTranslation("bookmark");
  const Icon =
    clip.type === "highlight"
      ? Highlighter
      : clip.type === "image"
        ? ImageIcon
        : clip.type === "link"
          ? LinkIcon
          : StickyNote;
  return (
    <article className="rounded-xl border bg-card p-4">
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 text-primary" />
        <span className="text-xs font-medium">
          {t(`savePanel.clip.types.${clip.type}`)}
        </span>
        <span className="ml-auto text-[11px] text-muted-foreground">
          {new Date(clip.createdAt).toLocaleString()}
        </span>
        <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-destructive" onClick={onDelete}>
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </div>
      {clip.text && (
        <blockquote className="mt-3 border-l-2 border-primary/40 pl-3 text-sm leading-6">
          {clip.text}
        </blockquote>
      )}
      {clip.type === "image" && clip.imageSourceUrl && (
        <img src={clip.imageSourceUrl} alt="" className="mt-3 max-h-48 rounded-lg object-contain" />
      )}
      {clip.targetUrl && (
        <a href={clip.targetUrl} target="_blank" rel="noreferrer" className="mt-3 block truncate text-sm text-primary hover:underline">
          {clip.targetUrl}
        </a>
      )}
      {clip.note && <p className="mt-3 whitespace-pre-wrap text-sm text-muted-foreground">{clip.note}</p>}
    </article>
  );
}
