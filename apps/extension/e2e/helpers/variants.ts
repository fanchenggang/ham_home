import type { LocalSettings } from "../../types";

export type E2EVariantName =
  | "default"
  | "english"
  | "dark"
  | "englishDark"
  | "desktop";

export interface E2EVariant {
  name: E2EVariantName;
  language: NonNullable<LocalSettings["language"]>;
  theme: NonNullable<LocalSettings["theme"]>;
  settings: Partial<LocalSettings>;
  text: (zh: string, en: string) => string;
}

export const E2E_PROJECTS = {
  default: "chromium-extension",
  english: "chromium-extension-english",
  dark: "chromium-extension-dark",
  englishDark: "chromium-extension-english-dark",
  desktop: "chromium-extension-desktop",
} as const;

const DEFAULT_SETTINGS: Partial<LocalSettings> = {
  language: "zh",
  theme: "system",
};

const VARIANTS: Record<E2EVariantName, Omit<E2EVariant, "text">> = {
  default: {
    name: "default",
    language: "zh",
    theme: "system",
    settings: DEFAULT_SETTINGS,
  },
  english: {
    name: "english",
    language: "en",
    theme: "light",
    settings: {
      language: "en",
      theme: "light",
    },
  },
  dark: {
    name: "dark",
    language: "zh",
    theme: "dark",
    settings: {
      language: "zh",
      theme: "dark",
    },
  },
  englishDark: {
    name: "englishDark",
    language: "en",
    theme: "dark",
    settings: {
      language: "en",
      theme: "dark",
    },
  },
  desktop: {
    name: "desktop",
    language: "zh",
    theme: "system",
    settings: DEFAULT_SETTINGS,
  },
};

export function resolveE2EVariant(projectName: string): E2EVariant {
  const name = resolveE2EVariantName(projectName);
  const variant = VARIANTS[name];
  return {
    ...variant,
    text: (zh, en) => (variant.language === "en" ? en : zh),
  };
}

function resolveE2EVariantName(projectName: string): E2EVariantName {
  if (projectName === E2E_PROJECTS.english) return "english";
  if (projectName === E2E_PROJECTS.dark) return "dark";
  if (projectName === E2E_PROJECTS.englishDark) return "englishDark";
  if (projectName === E2E_PROJECTS.desktop) return "desktop";
  return "default";
}
