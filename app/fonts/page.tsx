"use client";

import React, { useState, useMemo } from "react";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { Input } from "@/components/ui/Input";
import { fonts, loadFontCSS } from "@/data/fonts";
import { cn } from "@/lib/utils/cn";
import { Heart, Search } from "lucide-react";
import type { FontDefinition } from "@/types/template";

export default function FontsPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FontDefinition["category"] | "all">("all");
  const [preview, setPreview] = useState("The quick brown fox jumps over the lazy dog.");
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  const filtered = useMemo(() => {
    return fonts.filter((f) => {
      const matchesSearch = f.name.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = filter === "all" || f.category === filter;
      return matchesSearch && matchesCategory;
    });
  }, [search, filter]);

  const categories = ["all", "serif", "sans-serif", "display", "handwriting", "monospace"] as const;

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <PageWrapper>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-2">Fonts</h1>
          <p className="text-text-secondary">Browse and preview all 40+ fonts</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" />
            <input
              type="text"
              placeholder="Search fonts..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-10 pl-9 pr-4 bg-surface border border-border rounded-standard text-sm text-text-primary placeholder:text-text-secondary focus:outline-none focus:border-accent"
            />
          </div>
          <input
            type="text"
            value={preview}
            onChange={(e) => setPreview(e.target.value)}
            placeholder="Type to preview..."
            className="h-10 px-4 bg-surface border border-border rounded-standard text-sm text-text-primary focus:outline-none focus:border-accent w-full sm:w-64"
          />
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={cn(
                "px-3 py-1.5 rounded-full text-sm font-medium transition-colors border",
                filter === cat
                  ? "bg-accent text-background border-accent"
                  : "bg-surface text-text-secondary border-border hover:text-text-primary"
              )}
            >
              {cat === "all" ? "All Fonts" : cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((font) => {
            loadFontCSS(font.family);
            return (
              <div
                key={font.id}
                className="p-4 rounded-card bg-surface border border-border hover:border-accent/50 transition-colors group"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="text-sm font-medium text-text-primary">{font.name}</div>
                    <div className="text-xs text-text-secondary mt-0.5">{font.category} · {font.weights.length} weights</div>
                  </div>
                  <button
                    onClick={() => toggleFavorite(font.id)}
                    className={cn(
                      "p-1.5 rounded transition-colors",
                      favorites.has(font.id) ? "text-accent" : "text-text-secondary hover:text-text-primary"
                    )}
                  >
                    <Heart size={16} className={cn(favorites.has(font.id) && "fill-accent")} />
                  </button>
                </div>
                <div
                  className="text-lg text-text-primary truncate"
                  style={{ fontFamily: font.family, fontWeight: 400 }}
                >
                  {preview || font.name}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </PageWrapper>
  );
}
