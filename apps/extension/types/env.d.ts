/**
 * 开发态预置配置的环境变量声明
 *
 * 变量写在 apps/extension/.env.local（已 gitignore），仅在 `wxt dev` 下生效，
 * 生产构建时相关代码会被 `import.meta.env.DEV` 判定为死代码移除。
 * 说明与示例见 .env.example 与 docs/dev-config-preset.md。
 */
interface ImportMetaEnv {
  /** 即使已有配置也强制覆盖（默认只在配置为空时写入） */
  readonly WXT_DEV_PRESET_FORCE?: string;

  // AI 模型配置
  readonly WXT_DEV_AI_PROVIDER?: string;
  readonly WXT_DEV_AI_API_KEY?: string;
  readonly WXT_DEV_AI_BASE_URL?: string;
  readonly WXT_DEV_AI_MODEL?: string;

  // Embedding（语义搜索）配置
  readonly WXT_DEV_EMBEDDING_ENABLED?: string;
  readonly WXT_DEV_EMBEDDING_PROVIDER?: string;
  readonly WXT_DEV_EMBEDDING_API_KEY?: string;
  readonly WXT_DEV_EMBEDDING_BASE_URL?: string;
  readonly WXT_DEV_EMBEDDING_MODEL?: string;

  // 常用设置
  readonly WXT_DEV_LANGUAGE?: string;
  readonly WXT_DEV_THEME?: string;
  readonly WXT_DEV_AUTO_SAVE_SNAPSHOT?: string;

  // WebDAV 同步
  readonly WXT_DEV_WEBDAV_ENABLED?: string;
  readonly WXT_DEV_WEBDAV_URL?: string;
  readonly WXT_DEV_WEBDAV_USERNAME?: string;
  readonly WXT_DEV_WEBDAV_PASSWORD?: string;
}
