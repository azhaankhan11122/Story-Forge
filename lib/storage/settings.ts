import type { AppSettings } from "@/types/story";

let settingsStore: ReturnType<typeof import("localforage").default["createInstance"]> | null = null;

async function getSettingsStore() {
  if (!settingsStore) {
    const { default: localforage } = await import("localforage");
    settingsStore = localforage.createInstance({
      name: "storyforge",
      storeName: "settings",
    });
  }
  return settingsStore;
}

const DEFAULT_SETTINGS: AppSettings = {
  theme: "dark",
  defaultRatio: "9:16",
  defaultExportQuality: 2,
  showGrid: false,
  showRulers: true,
  autosaveInterval: 30,
  snapToGuides: true,
};

export async function getSettings(): Promise<AppSettings> {
  const store = await getSettingsStore();
  const stored = await store.getItem<AppSettings>("app");
  return stored ?? DEFAULT_SETTINGS;
}

export async function saveSettings(settings: AppSettings): Promise<void> {
  const store = await getSettingsStore();
  await store.setItem("app", settings);
}

export async function resetSettings(): Promise<void> {
  await saveSettings(DEFAULT_SETTINGS);
}
