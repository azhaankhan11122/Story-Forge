"use client";

import React, { useEffect, useState } from "react";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { Button } from "@/components/ui/Button";
import { Slider } from "@/components/ui/Slider";
import { useSettingsStore } from "@/store/settingsStore";
import { getSettings, saveSettings, resetSettings } from "@/lib/storage/settings";
import { clearAllStories, exportStoriesBackup, importStoriesBackup } from "@/lib/storage/stories";
import { toast } from "sonner";
import { cn } from "@/lib/utils/cn";
import { Download, Upload, Trash2, Sun, Moon, Monitor, Palette } from "lucide-react";

export default function SettingsPage() {
  const settings = useSettingsStore();
  const [isLoaded, setIsLoaded] = useState(false);
  const [backupText, setBackupText] = useState("");

  useEffect(() => {
    async function load() {
      await settings.loadSettings();
      setIsLoaded(true);
    }
    load();
  }, [settings]);

  const handleUpdate = async (partial: Parameters<typeof settings.updateSettings>[0]) => {
    await settings.updateSettings(partial);
    toast.success("Settings saved");
  };

  const handleExport = async () => {
    const json = await exportStoriesBackup();
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `storyforge-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Backup exported");
  };

  const handleImport = async () => {
    try {
      const count = await importStoriesBackup(backupText);
      toast.success(`Imported ${count} stories`);
      setBackupText("");
    } catch {
      toast.error("Invalid backup file");
    }
  };

  const handleClearAll = async () => {
    if (!confirm("Are you sure you want to delete ALL stories? This cannot be undone.")) return;
    await clearAllStories();
    toast.success("All stories deleted");
  };

  const themeOptions = [
    { id: "light", label: "Light", icon: <Sun size={16} /> },
    { id: "dark", label: "Dark", icon: <Moon size={16} /> },
    { id: "system", label: "System", icon: <Monitor size={16} /> },
  ] as const;

  const ratioOptions = ["9:16", "1:1", "4:5", "16:9", "4:3"] as const;

  if (!isLoaded) {
    return (
      <PageWrapper>
        <div className="max-w-3xl mx-auto px-4 py-8">
          <div className="animate-pulse h-8 bg-surface-2 rounded w-48 mb-6" />
          <div className="animate-pulse h-64 bg-surface-2 rounded" />
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold tracking-tight mb-8">Settings</h1>

        <div className="space-y-8">
          <section>
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Palette size={18} /> Appearance
            </h2>
            <div className="grid grid-cols-3 gap-3">
              {themeOptions.map((t) => (
                <button
                  key={t.id}
                  onClick={() => handleUpdate({ theme: t.id })}
                  className={cn(
                    "flex flex-col items-center gap-2 p-4 rounded-card border transition-colors",
                    settings.theme === t.id ? "border-accent bg-accent/10 text-accent" : "border-border bg-surface hover:border-text-secondary"
                  )}
                >
                  {t.icon}
                  <span className="text-sm font-medium">{t.label}</span>
                </button>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-4">Editor Defaults</h2>
            <div className="space-y-4 bg-surface rounded-card p-4 border border-border">
              <div>
                <label className="text-sm text-text-secondary mb-2 block">Default Canvas Ratio</label>
                <div className="flex gap-2">
                  {ratioOptions.map((r) => (
                    <button
                      key={r}
                      onClick={() => handleUpdate({ defaultRatio: r })}
                      className={cn(
                        "px-3 py-1.5 rounded text-sm font-medium border transition-colors",
                        settings.defaultRatio === r ? "border-accent text-accent bg-accent/10" : "border-border text-text-secondary hover:text-text-primary"
                      )}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm text-text-secondary mb-2 block">Autosave Interval (seconds)</label>
                <Slider
                  value={settings.autosaveInterval}
                  min={5}
                  max={120}
                  step={5}
                  onChange={(v) => handleUpdate({ autosaveInterval: v })}
                />
              </div>

              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={settings.showGrid}
                    onChange={(e) => handleUpdate({ showGrid: e.target.checked })}
                    className="rounded border-border accent-accent"
                  />
                  Show grid by default
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={settings.showRulers}
                    onChange={(e) => handleUpdate({ showRulers: e.target.checked })}
                    className="rounded border-border accent-accent"
                  />
                  Show rulers by default
                </label>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-4">Export</h2>
            <div className="bg-surface rounded-card p-4 border border-border space-y-4">
              <div>
                <label className="text-sm text-text-secondary mb-2 block">Default Export Quality</label>
                <div className="flex gap-2">
                  {([1, 2, 3] as const).map((q) => (
                    <button
                      key={q}
                      onClick={() => handleUpdate({ defaultExportQuality: q })}
                      className={cn(
                        "px-3 py-1.5 rounded text-sm font-medium border transition-colors",
                        settings.defaultExportQuality === q ? "border-accent text-accent bg-accent/10" : "border-border text-text-secondary hover:text-text-primary"
                      )}
                    >
                      {q === 1 ? "Standard (1x)" : q === 2 ? "High (2x)" : "Ultra HD (3x)"}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-4">Data</h2>
            <div className="bg-surface rounded-card p-4 border border-border space-y-4">
              <div className="flex gap-2">
                <Button variant="secondary" onClick={handleExport}>
                  <Download size={14} className="mr-1" /> Export Backup
                </Button>
                <Button variant="danger" onClick={handleClearAll}>
                  <Trash2 size={14} className="mr-1" /> Clear All Stories
                </Button>
              </div>
              <div>
                <label className="text-sm text-text-secondary mb-2 block">Import Backup</label>
                <textarea
                  value={backupText}
                  onChange={(e) => setBackupText(e.target.value)}
                  placeholder="Paste backup JSON here..."
                  rows={4}
                  className="w-full px-3 py-2 bg-surface-2 border border-border rounded text-sm text-text-primary focus:outline-none focus:border-accent resize-none"
                />
                <div className="mt-2">
                  <Button variant="secondary" size="sm" onClick={handleImport} disabled={!backupText}>
                    <Upload size={14} className="mr-1" /> Import
                  </Button>
                </div>
              </div>
            </div>
          </section>

          <div className="pt-4">
            <Button variant="secondary" onClick={() => { resetSettings(); toast.success("Settings reset to defaults"); }}>
              Reset to Defaults
            </Button>
          </div>

          <div className="text-xs text-text-secondary pt-4 border-t border-border">
            StoryForge v1.0.0 · Local storage only · No data leaves your device
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
