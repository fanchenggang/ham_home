# 开发态配置预置

`wxt dev` 每次都会拉起一个全新的浏览器 profile，扩展存储是空的，调试前得手动去设置页填 AI API Key、
Embedding、WebDAV 等配置。这里支持把这些值写在本地 env 文件里，background 启动时自动写入存储。

## 使用

```bash
cp apps/extension/.env.example apps/extension/.env.local
# 编辑 .env.local 填入自己的 key
pnpm dev:extension
```

启动后 background 控制台会打印实际写入的内容（密钥做了打码）：

```
[DevConfigPreset] 已写入开发预置配置: AI(provider=openai, apiKey=sk-a****1234, model=gpt-4o-mini)
```

## 支持的变量

变量必须以 `WXT_` 开头，否则 WXT 不会把它注入到扩展代码里。

| 变量 | 说明 |
| --- | --- |
| `WXT_DEV_PRESET_FORCE` | 每次启动都强制覆盖已有配置，默认 `false` |
| `WXT_DEV_AI_PROVIDER` | AI provider，取值见 `AIProvider` 类型 |
| `WXT_DEV_AI_API_KEY` | AI API Key |
| `WXT_DEV_AI_BASE_URL` | 自定义端点（ollama / custom / 中转服务） |
| `WXT_DEV_AI_MODEL` | 模型名 |
| `WXT_DEV_EMBEDDING_ENABLED` | 是否开启语义搜索 |
| `WXT_DEV_EMBEDDING_PROVIDER` | Embedding provider |
| `WXT_DEV_EMBEDDING_API_KEY` | Embedding API Key |
| `WXT_DEV_EMBEDDING_BASE_URL` | Embedding 自定义端点 |
| `WXT_DEV_EMBEDDING_MODEL` | Embedding 模型名 |
| `WXT_DEV_LANGUAGE` | 界面语言 `zh` / `en` |
| `WXT_DEV_THEME` | 主题 `light` / `dark` / `system` |
| `WXT_DEV_AUTO_SAVE_SNAPSHOT` | 保存书签时是否默认保存快照 |
| `WXT_DEV_WEBDAV_ENABLED` | 是否开启 WebDAV 同步 |
| `WXT_DEV_WEBDAV_URL` | WebDAV 地址 |
| `WXT_DEV_WEBDAV_USERNAME` | WebDAV 用户名 |
| `WXT_DEV_WEBDAV_PASSWORD` | WebDAV 密码 |

布尔值接受 `true/false`、`1/0`、`yes/no`、`on/off`。

## 写入规则

按配置块判断，只在"这块配置还是空的"时写入，避免覆盖你在界面上改过的值：

| 配置块 | 视为未配置的条件 |
| --- | --- |
| AI | `apiKey` 和 `baseUrl` 都为空 |
| Embedding | `apiKey` 和 `baseUrl` 都为空 |
| 常用设置 | `settings.updatedAt === 0`（从未改过设置） |
| WebDAV | `url` 为空 |

设置 `WXT_DEV_PRESET_FORCE=true` 则每次 background 启动都覆盖写入。

## 安全性

- `.env.local` / `.env` 已在仓库根 `.gitignore` 中忽略，不会被提交；
- 预置逻辑整体包在 `if (!import.meta.env.DEV) return;` 里。生产构建时 `import.meta.env.DEV`
  会被静态替换为 `false`，打包器把整段代码（包括读取环境变量的表达式）当作死代码移除，
  密钥不会进入 `.output` 产物；
- 可以用 `grep -r "sk-" apps/extension/.output/chrome-mv3` 自行验证。

相关文件：

- [`lib/dev/dev-config-preset.ts`](../lib/dev/dev-config-preset.ts) — 预置逻辑
- [`types/env.d.ts`](../types/env.d.ts) — 环境变量类型声明
- [`.env.example`](../.env.example) — 变量示例
