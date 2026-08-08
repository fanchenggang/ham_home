import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
  TagInput as SharedTagInput,
  type TagInputProps,
} from "@hamhome/ui-business/common";

export type { TagInputProps };

/**
 * 标签输入框
 * 共享组件的默认文案是中文硬编码，这里统一注入 i18n 文案，
 * 避免英文界面漏出「个标签」这类中文片段
 */
export function TagInput({ labels, ...props }: TagInputProps) {
  const { t } = useTranslation("bookmark");

  const localizedLabels = useMemo(
    () => ({
      maxTags: (count: number) => t("savePanel.maxTags", { count }),
      tagCount: (count: number, max: number) =>
        t("savePanel.tagCount", { count, max }),
      removeTag: (tag: string) => t("savePanel.removeTag", { tag }),
      ...labels,
    }),
    [t, labels],
  );

  return <SharedTagInput {...props} labels={localizedLabels} />;
}
