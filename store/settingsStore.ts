"use client";

import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import type { AppSettings } from "@/types/story";
import { getSettings, saveSettings } from "@/lib/storage/settings";

interface SettingsState extends AppSettings {
  isLoaded: boolean;
  loadSettings: () => Promise<void>;
  updateSettings: (settings: Partial<AppSettings>) => Promise<void>;
  resetSettings: () => Promise<void>;
}

const defaultSettings: AppSettings = {
  theme: "dark",
  defaultRatio: "9:16",
  defaultExportQuality: 2,
  showGrid: false,
  showRulers: true,
  autosaveInterval: 30,
  snapToGuides: true,
};

export const useSettingsStore = create<SettingsState>()(
  immer((set, get) => ({
    ...defaultSettings,
    isLoaded: false,

    loadSettings: async () => {
      try {
        const settings = await getSettings();
        set((state) => {
          Object.assign(state, settings, { isLoaded: true });
        });
      } catch {
        set((state) => {
          Object.assign(state, defaultSettings, { isLoaded: true });
        });
      }
    },

    updateSettings: async (partial) => {
      const current = { ...get(), ...partial } as AppSettings;
      await saveSettings(current);
      set((state) => {
        Object.assign(state, partial);
      });
    },

    resetSettings: async () => {
      await saveSettings(defaultSettings);
      set((state) => {
        Object.assign(state, defaultSettings);
      });
    },
  }))
);
