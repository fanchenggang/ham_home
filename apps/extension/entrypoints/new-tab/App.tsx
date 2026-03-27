import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export function NewTabApp() {
  const { t } = useTranslation();
  const [bookmarks, setBookmarks] = useState<any[]>([]);

  useEffect(() => {
    // 加载收藏夹数据
    chrome.storage.local.get(["bookmarks"], (result) => {
      if (result.bookmarks) {
        setBookmarks(result.bookmarks);
      }
    });
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground p-4">
      <h1 className="text-2xl font-bold mb-4">{t("newTab.title", "HamHome 新标签页")}</h1>
      <p className="text-muted-foreground">
        {t("newTab.description", "快速访问您的收藏夹")}
      </p>
      {/* 在这里添加您的自定义新标签页 UI */}
    </div>
  );
}
