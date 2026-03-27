# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

HamHome - AI-Powered Bookmark Manager for Modern Browsers. A pnpm + Turborepo monorepo with workspace packages.

## Common Commands

```bash
pnpm install          # Install dependencies (Node 18+, pnpm 9)
pnpm dev             # Run all dev tasks
pnpm build           # Build all workspaces
pnpm lint            # Run lint tasks

# Extension (package name: hamhome)
pnpm --filter hamhome dev           # Dev server (Chrome)
pnpm --filter hamhome dev:firefox   # Firefox dev
pnpm --filter hamhome dev:edge       # Edge dev
pnpm --filter hamhome build          # Build Chrome extension
pnpm --filter hamhome build:all     # Build for all browsers
pnpm --filter hamhome zip:all        # Package as zip

# Web (package name: web)
pnpm --filter web dev
pnpm --filter web build
```

## Architecture

```
apps/
  extension/   # WXT-based browser extension (main product)
  web/         # Next.js product/marketing site
packages/
  ai/          # AI chains, embeddings, LLM integration
  api/         # API layer
  db/          # Database utilities
  i18n/        # Internationalization
  parser/      # HTML/content parsing
  storage/     # Storage abstractions
  types/       # Shared TypeScript types
  ui/          # Shared UI components
  utils/       # Utility functions
```

## Key Conventions

- **Strict TypeScript** with `"strict": true`
- **React 19** with function components only
- **Components**: Props MUST be explicitly typed; keep under 150 lines; no API calls in components
- **Hooks**: Handle business logic/state; return objects (not arrays); one responsibility per hook
- **Services**: All network/IO in service modules; no fetch in components/hooks
- **Path aliases**: `@/*`, `@ui/*`, `@hamhome/*`
- **Components**: Use `useContentUI()` hook for content script portal logic
- **Documentation**: Update `<package>/docs/components.md` when creating/changing components

## Commit Style

Conventional Commits: `feat(scope): summary`, `fix: summary`, `perf: summary`

## Default Language

Respond in **Chinese (简体中文)** for user-facing replies.
