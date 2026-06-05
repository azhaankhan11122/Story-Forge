"use client";

import React, { useState, useMemo } from "react";
import { fonts, loadFontCSS } from "@/data/fonts";
import { Input } from "@/components/ui/Input";
import { cn } from "@/lib/utils/cn";
import type { FontDefinition } from "@/types/template";

interface FontPickerProps {
  selectedFont: string;
  onSelect: (fontFamily: string) => void;
}

export const FontPicker: React.FC<FontPickerProps> = ({ selectedFont, onSelect }) => {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FontDefinition["category"] | "all">("all");

  const filtered = useMemo(() => {
    return fonts.filter((f) => {
      const matchesSearch = f.name.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = filter === "all" || f.category === filter;
      return matchesSearch && matchesCategory;
    });
  }, [search, filter]);

  const categories = ["all", "serif", "sans-serif", "display", "handwriting", "monospace"] as const;

  return (
    <div className="space-y-3">
      <Input
        placeholder="Search fonts..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full"
      />
      <div className="flex flex-wrap gap-1">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={cn(
              "px-2 py-1 rounded text-xs font-medium transition-colors",
              filter === cat ? "bg-accent text-background" : "bg-surface-2 text-text-secondary hover:text-text-primary"
            )}
          >
            {cat === "all" ? "All" : cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>
      <div className="max-h-64 overflow-y-auto space-y-1 pr-1">
        {filtered.map((font) => (
          <button
            key={font.id}
            onClick={() => {
              loadFontCSS(font.family);
              onSelect(font.family);
            }}
            className={cn(
              "w-full text-left px-3 py-2 rounded text-sm transition-colors",
              selectedFont === font.family
                ? "bg-accent/20 text-accent border border-accent/30"
                : "bg-surface-2 text-text-primary hover:bg-border"
            )}
            style={{ fontFamily: font.family }}
          >
            <span className="block truncate">{font.name}</span>
            <span className="block text-xs text-text-secondary mt-0.5" style={{ fontFamily: "Inter" }}>
              {font.category} · {font.weights.length} weights
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};
