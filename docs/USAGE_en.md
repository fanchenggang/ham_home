<p>
  <img src="../logo.png" alt="HamHome" width="280" />
</p>

# HamHome Usage Guide

This guide focuses on everyday use of the HamHome browser extension. For build and development commands, see [README.md](../README.md).

The screenshots below are generated from the extension screenshot test suite and reflect the current in-product flows.

## Quick Tour

| Save current page | Manage your library |
| :--: | :--: |
| ![Save current page](../apps/extension/output/screenshots/en-light/01-popup-save.png) | ![Bookmark library](../apps/extension/output/screenshots/en-light/02-bookmark-library.png) |
| Search with Agent | Restore workspaces |
| ![AI Agent search](../apps/extension/output/screenshots/en-light/05-ai-agent.png) | ![Workspaces](../apps/extension/output/screenshots/en-light/06-workspaces.png) |
| Automate Tab Groups | Import, export, and sync |
| ![Tab Group rules](../apps/extension/output/screenshots/en-light/07-tab-groups.png) | ![Import export and sync](../apps/extension/output/screenshots/en-light/08-import-export-sync.png) |

## First Setup

1. Install HamHome from the browser store or a GitHub Release package.
2. Open the HamHome app from the extension icon, context menu, or the page opened after installation.
3. In `Settings -> General`, choose language, theme, panel side, auto-save snapshot, omnibox search, and browser shortcuts.
4. In `Settings -> AI`, choose a provider, model, API key, Base URL, advanced options, and preset tags. Click the connection test before relying on AI features.
5. Optional: enable `Embedding` in `Settings -> AI` if you want semantic search. Configure an embedding provider/model, test it, then run an incremental or full vector rebuild.
6. Optional: in `Settings -> Storage`, configure WebDAV if you want multi-device sync.

AI features are optional. You can save, edit, search, import, export, and organize bookmarks manually without configuring an AI provider.

## Main Entry Points

- **Popup save panel**: click the extension icon, use the context menu item `Save to HamHome`, or use the suggested shortcut `Ctrl+Shift+X` / `Command+Shift+X`.
- **Main app**: use the context menu item `Open HamHome`, the quick action in the popup, or open the extension app page.
- **In-page bookmark panel**: move to the configured screen edge and click the trigger, or use `Ctrl+Shift+L` / `Command+Shift+L`.
- **Save current window as workspace**: use the context menu item, the Workspaces page button, or `Ctrl+Shift+Y` / `Command+Shift+Y`.
- **Address bar search**: type `ham`, press Space/Tab, then enter a query. This searches bookmarks and workspaces when omnibox search is enabled.

Browser shortcuts are controlled by the browser. Use `chrome://extensions/shortcuts`, `edge://extensions/shortcuts`, or the Firefox add-ons shortcut settings if you want to change them.

## Save a Bookmark

![Save panel](../apps/extension/output/screenshots/en-light/01-popup-save.png)

Open the save panel on the page you want to capture. HamHome reads the page title, URL, metadata, readable text, and favicon when available.

In the save panel you can:

- Edit title and description.
- Choose a category and add tags.
- Request AI suggestions for summary/category/tags.
- Save or skip a local snapshot.
- If snapshot saving is enabled, also sync a Markdown-style note to Obsidian.
- Update or delete the bookmark if the current URL is already saved.

Snapshot and Obsidian behavior:

- HTML/Markdown snapshots are stored locally in IndexedDB.
- Obsidian sync opens an `obsidian://new` URL and writes notes under the `HamHome` folder by default.
- Obsidian sync needs Obsidian installed and the Obsidian URL scheme enabled.
- If the generated note is unchanged, HamHome can skip duplicate Obsidian writes.

## Browse and Organize Bookmarks

![Bookmark library](../apps/extension/output/screenshots/en-light/02-bookmark-library.png)

The bookmark library is the main place for reviewing, filtering, editing, and cleaning up saved items.

Useful workflows:

- Search by title, URL, description, content, category, tag, domain, or time range.
- Switch between dense management views and visual cards where available.
- Edit title, URL, description, category, and tags.
- Open, copy, delete, or restore bookmarks depending on their state.
- View, download, update, delete, or sync snapshots.
- Use custom filters from `Settings -> General` to save repeated search conditions.

Bulk actions are available after selecting bookmarks.

![Bulk bookmark actions](../apps/extension/output/screenshots/en-light/03-bookmark-bulk-actions.png)

Bulk workflows include:

- Add or remove tags.
- Move selected bookmarks to a category.
- Delete selected bookmarks.
- Re-run AI analysis on selected bookmarks.
- Sync selected snapshots to Obsidian when snapshots are available.

## Categories and Tags

Use `Categories` to build the stable hierarchy of your bookmark library. Categories support hierarchy and icons.

Recommended setup:

- Create a few top-level categories first.
- Add child categories only for areas you use frequently.
- Use preset category templates if you are starting from scratch.
- Use AI-generated categories if you want HamHome to propose a structure from your scenario.

Use `Tags` for cross-cutting topics. The Tags page shows tag usage and a tag cloud, while preset tags in AI settings help keep AI-generated tags consistent.

## Search, Semantic Search, and AI Agent

![AI Agent search](../apps/extension/output/screenshots/en-light/05-ai-agent.png)

HamHome supports three search layers:

- **Keyword search**: exact or partial matches against title, URL, description, content, tags, and categories.
- **Semantic search**: natural-language retrieval using embeddings and local vector storage.
- **AI Agent search**: conversational search that can call HamHome search tools, explain results, and show clickable sources.

For semantic search:

1. Open `Settings -> AI`.
2. Enable `Embedding`.
3. Choose provider, API key/Base URL if needed, model, dimensions if supported, and batch size.
4. Test the embedding connection.
5. Run an incremental rebuild for missing vectors or a full rebuild after changing models.

If AI search returns poor results, check vector coverage, confirm that older imported bookmarks have descriptions/content, and try combining natural language with category/tag filters.

## In-page Panel

![In-page content panel](../apps/extension/output/screenshots/en-light/04-content-panel.png)

The in-page panel lets you search and open saved bookmarks without leaving the current website.

You can:

- Open it from the edge trigger.
- Toggle it with the browser shortcut.
- Choose left or right position in `Settings -> General`.
- Search bookmarks and open results in a new tab.
- Jump to settings or the main HamHome app from panel actions.

The panel only responds while the page is visible and focused, so it does not keep opening on inactive tabs.

## Workspaces

![Workspaces](../apps/extension/output/screenshots/en-light/06-workspaces.png)

Workspaces are for temporary or repeatable browsing contexts: research sessions, project tabs, planning flows, or any group of pages you want to restore later.

You can:

- Save the current window as a workspace.
- Include page order, URL, title, domain, favicon, pinned state, and native Tab Group metadata.
- Add a name, description, workspace category, and workspace tags.
- Restore all or selected pages into the current window or a new window.
- Skip duplicate URLs during restore.
- Drag current tabs into a workspace.
- Drag pages between workspaces or between saved Tab Groups.
- Edit page title/URL or save a workspace page as a normal bookmark.

Workspace categories are separate from bookmark categories. Use them for project/session organization, not long-term knowledge taxonomy.

## Tab Group Automation

![Tab Group rules](../apps/extension/output/screenshots/en-light/07-tab-groups.png)

The `Tab Groups` page manages native browser Tab Group automation.

Manual rules:

- Rule matching supports domain, URL text, title, case-insensitive title, and regex conditions.
- Conditions include contains, equals, starts with, ends with, and regex.
- Each rule has a target group title, color, enabled state, collapsed state, and order.
- You can add multiple matchers to a rule. If any matcher hits, the tab joins the target group.

Fallback automation:

- **AI auto grouping**: when no manual rule matches, HamHome can send URL, title, page metadata, existing group names, and your custom grouping instructions to the configured AI provider.
- **Domain auto grouping**: when no manual rule matches, HamHome can group by the root domain, such as `docs.example.com` -> `example`.
- AI fallback and domain fallback are mutually exclusive.
- Manual rules always run first.

Notes:

- Chromium browsers use `chrome.tabGroups` to apply groups automatically.
- Pinned tabs are skipped.
- Tabs restored from a workspace are suppressed briefly so restore does not immediately re-group them.
- Firefox can store rules, but automatic native Tab Group execution depends on browser API support.

## Import, Export, Browser Bookmarks, and WebDAV

![Import export and sync](../apps/extension/output/screenshots/en-light/08-import-export-sync.png)

Use `Import / Export` when migrating, backing up, or bridging between HamHome and browser-native bookmarks.

Import options:

- Import a HamHome JSON backup.
- Import a standard browser bookmark HTML file from Chrome, Firefox, or Edge.
- Import directly from the browser bookmarks API.
- Preserve browser folder structure as HamHome categories.
- Or let AI analyze imported bookmarks and generate summaries/categories/tags. This is mutually exclusive with preserving folder structure.
- Optionally fetch page content during import for better AI analysis. This is slower.
- Long HTML import tasks can be cancelled and resumed from stored progress.

Export options:

- JSON export is the full HamHome backup format. It includes bookmarks, categories, workspaces, workspace categories, Tab Group rules, and auto-group settings.
- HTML export generates a readable bookmark page.
- Browser sync writes HamHome bookmarks back to the browser bookmark bar. You can create/use a `HamHome` root folder, clear the target area first, and skip duplicates globally.

WebDAV sync lives in `Settings -> Storage`.

It syncs structured data under `/HamHomeSync`:

- Settings.
- Bookmark metadata and bookmark text content.
- Bookmark categories.
- Workspaces and workspace categories.
- Tab Group rules and auto-group settings.

It does not sync local snapshot blobs as full WebDAV snapshot files. Use JSON export or Obsidian sync when you need to move snapshot/note content.

WebDAV behavior:

- Manual sync is available from the Storage tab.
- Background sync runs periodically.
- Local bookmark changes schedule a delayed sync.
- Remote sync uses a lock to reduce multi-device conflicts.
- `Clear Remote Data` deletes the `/HamHomeSync` remote directory. Make sure you have a backup before using it.

## Privacy and Data Boundaries

HamHome is local-first, but some optional features intentionally call external services you configure.

Local by default:

- Bookmarks, categories, settings, workspaces, Tab Group rules, AI cache, vector data, and snapshots are stored in browser storage/IndexedDB.

May leave your browser only when enabled:

- AI analysis may send page URL, title, excerpt/content, category names, and tags to your chosen AI provider.
- Embedding search sends bookmark/query text to your embedding provider while vectors are built or searched.
- WebDAV sends structured sync data to your WebDAV server.
- Obsidian sync opens an Obsidian URL with generated note content or clipboard handoff.

The Agent will not read or fill API keys, Base URLs, privacy domains, WebDAV credentials, Obsidian-sensitive values, or browser shortcut settings. Configure those manually in settings.

Use privacy domains and automatic privacy detection for sites that should never be analyzed by AI.

## Troubleshooting

### AI says it is not configured

Open `Settings -> AI`, choose provider/model, fill the API key and Base URL if needed, then run the connection test. Ollama does not require an API key but still needs a reachable local endpoint.

### Semantic search returns few results

Enable Embedding, test the embedding provider, rebuild vectors, and check vector coverage. Imported bookmarks with only title/URL may need page content fetching or AI re-analysis.

### WebDAV sync does nothing

Confirm sync is enabled, URL/username/password are filled, and manual sync is not disabled. Check the displayed sync status and error message in `Settings -> Storage`.

### Storage keeps growing

Snapshots and vectors are the usual causes. Use `Settings -> Storage` to inspect bookmark, workspace, snapshot, and vector data. You can clear snapshots or vectors separately, or export a backup before clearing business data.

### Tab Groups are not applied

Confirm the browser supports `chrome.tabGroups`, the rule is enabled, the tab is not pinned, and no earlier rule has matched. For AI grouping, verify AI settings and make sure domain auto grouping is not enabled at the same time.
