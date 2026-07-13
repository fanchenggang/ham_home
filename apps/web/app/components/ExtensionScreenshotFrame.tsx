"use client";

import { cn } from "@hamhome/ui";
import {
  EXTENSION_SCREENSHOTS,
  getExtensionScreenshotSrc,
  type ExtensionScreenshotId,
} from "./extensionScreenshots";

interface ExtensionScreenshotFrameProps {
  id: ExtensionScreenshotId;
  isEn: boolean;
  isDark: boolean;
  caption?: string;
  priority?: boolean;
  className?: string;
  imageClassName?: string;
}

export function ExtensionScreenshotFrame({
  id,
  isEn,
  isDark,
  caption,
  priority = false,
  className,
  imageClassName,
}: ExtensionScreenshotFrameProps) {
  const meta = EXTENSION_SCREENSHOTS[id];
  const copy = isEn ? meta.en : meta.zh;
  const src = getExtensionScreenshotSrc(id, { isEn, isDark });

  return (
    <figure
      className={cn(
        "group w-full max-w-full overflow-hidden rounded-2xl border border-border/70 bg-background/70 shadow-2xl shadow-black/10 ring-1 ring-white/50 transition-transform duration-300 hover:-translate-y-1 dark:ring-white/10",
        className,
      )}
    >
      <div className="flex items-center justify-between border-b border-border/60 bg-muted/40 px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-[#ff5b5b]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#ffc247]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#34c759]" />
        </div>
        <figcaption className="min-w-0 truncate text-xs font-semibold text-muted-foreground">
          {caption || copy.title}
        </figcaption>
      </div>
      <div
        className={cn(
          "relative bg-[#f7f2eb] dark:bg-[#171412]",
          meta.aspect === "popup" ? "aspect-[23/38]" : "aspect-[3/2]",
        )}
      >
        <img
          src={src}
          alt={copy.alt}
          loading={priority ? "eager" : "lazy"}
          className={cn(
            "h-full w-full object-cover object-top",
            meta.aspect === "popup" && "object-contain p-3",
            imageClassName,
          )}
        />
      </div>
    </figure>
  );
}
