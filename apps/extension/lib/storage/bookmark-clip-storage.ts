import { nanoid } from "nanoid";
import type { BookmarkClip, CreateBookmarkClipInput } from "@/types";

const clipsItem = storage.defineItem<BookmarkClip[]>("local:bookmarkClips", {
  fallback: [],
});

class BookmarkClipStorage {
  async getAllClips(): Promise<BookmarkClip[]> {
    return clipsItem.getValue();
  }

  async getClipsByBookmark(bookmarkId: string): Promise<BookmarkClip[]> {
    const clips = await clipsItem.getValue();
    return clips
      .filter((clip) => clip.bookmarkId === bookmarkId && !clip.isDeleted)
      .sort((a, b) => b.createdAt - a.createdAt);
  }

  async addClip(
    bookmarkId: string,
    input: CreateBookmarkClipInput,
  ): Promise<BookmarkClip> {
    const clips = await clipsItem.getValue();
    const now = Date.now();
    const clip: BookmarkClip = {
      ...input,
      id: nanoid(),
      bookmarkId,
      createdAt: now,
      updatedAt: now,
    };
    await clipsItem.setValue([...clips, clip]);
    return clip;
  }

  async updateClip(
    id: string,
    updates: Partial<Pick<BookmarkClip, "text" | "note" | "targetUrl">>,
  ): Promise<BookmarkClip> {
    const clips = await clipsItem.getValue();
    const index = clips.findIndex((clip) => clip.id === id);
    if (index < 0) throw new Error("剪藏不存在");

    const updated = { ...clips[index], ...updates, updatedAt: Date.now() };
    const next = [...clips];
    next[index] = updated;
    await clipsItem.setValue(next);
    return updated;
  }

  async deleteClip(id: string): Promise<void> {
    const clips = await clipsItem.getValue();
    await clipsItem.setValue(
      clips.map((clip) =>
        clip.id === id
          ? { ...clip, isDeleted: true, updatedAt: Date.now() }
          : clip,
      ),
    );
  }

  async deleteByBookmark(bookmarkId: string): Promise<void> {
    const clips = await clipsItem.getValue();
    await clipsItem.setValue(
      clips.filter((clip) => clip.bookmarkId !== bookmarkId),
    );
  }

  async deleteByBookmarks(bookmarkIds: string[]): Promise<void> {
    if (bookmarkIds.length === 0) return;
    const idSet = new Set(bookmarkIds);
    const clips = await clipsItem.getValue();
    await clipsItem.setValue(
      clips.filter((clip) => !idSet.has(clip.bookmarkId)),
    );
  }

  async importRawClip(clip: BookmarkClip): Promise<void> {
    const clips = await clipsItem.getValue();
    const index = clips.findIndex((item) => item.id === clip.id);
    const next = [...clips];
    if (index >= 0) next[index] = clip;
    else next.push(clip);
    await clipsItem.setValue(next);
  }

  async importRawClips(clips: BookmarkClip[]): Promise<void> {
    await clipsItem.setValue(clips);
  }

  watch(callback: (clips: BookmarkClip[]) => void): () => void {
    return clipsItem.watch((value) => callback(value ?? []));
  }
}

export const bookmarkClipStorage = new BookmarkClipStorage();
