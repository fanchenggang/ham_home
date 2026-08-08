/**
 * 开发态配置预置
 *
 * `wxt dev` 每次都会启动一个全新的浏览器 profile，扩展存储是空的，
 * 导致每次调试前都要手动填 AI API Key、Embedding、WebDAV 等配置。
 * 这里在 background 启动时把 apps/extension/.env.local 里的变量写入扩展存储。
 *
 * 约定：
 * - 变量必须以 `WXT_DEV_` 开头（WXT 的 env 前缀是 WXT_ / VITE_）；
 * - 只在开发构建生效，`import.meta.env.DEV` 在生产构建会被静态替换为 false，
 *   整段逻辑（含变量取值）会被打包器当作死代码移除，密钥不会进入产物；
 * - 默认只在对应配置为空时写入，不覆盖你在界面上改过的值；
 *   需要每次强制覆盖时设置 `WXT_DEV_PRESET_FORCE=true`。
 */
import { configStorage } from "@/lib/storage";
import { syncConfigStorage } from "@/lib/sync/sync-config-storage";
import type {
  AIConfig,
  AIProvider,
  EmbeddingConfig,
  Language,
  LocalSettings,
  ThemeMode,
} from "@/types";
import type { WebDAVConfig } from "@/types/sync";

const LOG_PREFIX = "[DevConfigPreset]";

const AI_PROVIDERS: AIProvider[] = [
  "openai",
  "anthropic",
  "google",
  "azure",
  "deepseek",
  "groq",
  "mistral",
  "moonshot",
  "zhipu",
  "hunyuan",
  "nvidia",
  "siliconflow",
  "ollama",
  "custom",
];

const LANGUAGES: Language[] = ["zh", "en"];
const THEMES: ThemeMode[] = ["light", "dark", "system"];

/**
 * 读取环境变量
 * 必须逐个静态访问 `import.meta.env.X`，打包器才能做替换与死代码消除
 */
function readEnv() {
  return {
    force: parseBoolean(import.meta.env.WXT_DEV_PRESET_FORCE),

    ai: {
      provider: parseEnum(import.meta.env.WXT_DEV_AI_PROVIDER, AI_PROVIDERS, "WXT_DEV_AI_PROVIDER"),
      apiKey: parseString(import.meta.env.WXT_DEV_AI_API_KEY),
      baseUrl: parseString(import.meta.env.WXT_DEV_AI_BASE_URL),
      model: parseString(import.meta.env.WXT_DEV_AI_MODEL),
    },

    embedding: {
      enabled: parseBoolean(import.meta.env.WXT_DEV_EMBEDDING_ENABLED),
      provider: parseEnum(
        import.meta.env.WXT_DEV_EMBEDDING_PROVIDER,
        AI_PROVIDERS,
        "WXT_DEV_EMBEDDING_PROVIDER",
      ),
      apiKey: parseString(import.meta.env.WXT_DEV_EMBEDDING_API_KEY),
      baseUrl: parseString(import.meta.env.WXT_DEV_EMBEDDING_BASE_URL),
      model: parseString(import.meta.env.WXT_DEV_EMBEDDING_MODEL),
    },

    settings: {
      language: parseEnum(import.meta.env.WXT_DEV_LANGUAGE, LANGUAGES, "WXT_DEV_LANGUAGE"),
      theme: parseEnum(import.meta.env.WXT_DEV_THEME, THEMES, "WXT_DEV_THEME"),
      autoSaveSnapshot: parseBoolean(import.meta.env.WXT_DEV_AUTO_SAVE_SNAPSHOT),
    },

    webdav: {
      enabled: parseBoolean(import.meta.env.WXT_DEV_WEBDAV_ENABLED),
      url: parseString(import.meta.env.WXT_DEV_WEBDAV_URL),
      username: parseString(import.meta.env.WXT_DEV_WEBDAV_USERNAME),
      password: parseString(import.meta.env.WXT_DEV_WEBDAV_PASSWORD),
    },
  };
}

type DevPresetEnv = ReturnType<typeof readEnv>;

function parseString(value: string | undefined): string | undefined {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

function parseBoolean(value: string | undefined): boolean | undefined {
  const normalized = parseString(value)?.toLowerCase();
  if (normalized === undefined) return undefined;
  if (["1", "true", "yes", "on"].includes(normalized)) return true;
  if (["0", "false", "no", "off"].includes(normalized)) return false;
  console.warn(`${LOG_PREFIX} 无法解析布尔值:`, value);
  return undefined;
}

function parseEnum<T extends string>(
  value: string | undefined,
  allowed: T[],
  name: string,
): T | undefined {
  const normalized = parseString(value);
  if (normalized === undefined) return undefined;
  if ((allowed as string[]).includes(normalized)) return normalized as T;
  console.warn(
    `${LOG_PREFIX} ${name} 取值无效: ${normalized}，可选值: ${allowed.join(", ")}`,
  );
  return undefined;
}

/** 只保留有值的字段，全部为空时返回 null */
function compact<T extends object>(source: Partial<T>): Partial<T> | null {
  const entries = Object.entries(source).filter(([, value]) => value !== undefined);
  return entries.length > 0 ? (Object.fromEntries(entries) as Partial<T>) : null;
}

/** 日志里隐藏密钥，只保留首尾各 4 位 */
function maskSecret(value: string): string {
  if (value.length <= 8) return "****";
  return `${value.slice(0, 4)}****${value.slice(-4)}`;
}

function describe(patch: Record<string, unknown>): string {
  return Object.entries(patch)
    .map(([key, value]) => {
      const isSecret = /key|password|token/i.test(key);
      const display =
        isSecret && typeof value === "string" ? maskSecret(value) : String(value);
      return `${key}=${display}`;
    })
    .join(", ");
}

async function applyAIConfig(env: DevPresetEnv): Promise<string | null> {
  const patch = compact<AIConfig>(env.ai);
  if (!patch) return null;

  const current = await configStorage.getAIConfig();
  // 已有凭据说明是手动配置过的 profile，默认不覆盖
  const isConfigured = !!current.apiKey || !!current.baseUrl;
  if (isConfigured && !env.force) return null;

  await configStorage.setAIConfig(patch);
  return `AI(${describe(patch)})`;
}

async function applyEmbeddingConfig(env: DevPresetEnv): Promise<string | null> {
  const patch = compact<EmbeddingConfig>(env.embedding);
  if (!patch) return null;

  const current = await configStorage.getEmbeddingConfig();
  const isConfigured = !!current.apiKey || !!current.baseUrl;
  if (isConfigured && !env.force) return null;

  await configStorage.setEmbeddingConfig(patch);
  return `Embedding(${describe(patch)})`;
}

async function applySettings(env: DevPresetEnv): Promise<string | null> {
  const patch = compact<LocalSettings>(env.settings);
  if (!patch) return null;

  const current = await configStorage.getSettings();
  // updatedAt 为 0 表示从未改过设置
  if (current.updatedAt !== 0 && !env.force) return null;

  await configStorage.setSettings(patch);
  return `Settings(${describe(patch)})`;
}

async function applyWebDAVConfig(env: DevPresetEnv): Promise<string | null> {
  const patch = compact<WebDAVConfig>(env.webdav);
  if (!patch) return null;

  const current = await syncConfigStorage.getConfig();
  if (current.url && !env.force) return null;

  await syncConfigStorage.setConfig(patch);
  return `WebDAV(${describe(patch)})`;
}

/**
 * 应用开发态预置配置（仅 dev 构建生效）
 */
export async function applyDevConfigPreset(): Promise<void> {
  if (!import.meta.env.DEV) return;

  try {
    const env = readEnv();

    const results = await Promise.all([
      applyAIConfig(env),
      applyEmbeddingConfig(env),
      applySettings(env),
      applyWebDAVConfig(env),
    ]);

    const applied = results.filter((item): item is string => !!item);
    if (applied.length === 0) return;

    console.log(`${LOG_PREFIX} 已写入开发预置配置: ${applied.join(" | ")}`);
  } catch (error) {
    // 预置失败不应该影响插件启动
    console.warn(`${LOG_PREFIX} 写入开发预置配置失败:`, error);
  }
}
