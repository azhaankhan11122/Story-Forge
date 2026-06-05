"use client";

import React from "react";
import { cn } from "@/lib/utils/cn";
import { Plus, Trash2, Copy } from "lucide-react";
import type { Page } from "@/types/story";

interface PageStripProps {
  pages: Page[];
  currentIndex: number;
  onSelect: (index: number) => void;
  onAdd: () => void;
  onDuplicate: (index: number) => void;
  onDelete: (index: number) => void;
  maxPages?: number;
}

export const PageStrip: React.FC<PageStripProps> = ({
  pages,
  currentIndex,
  onSelect,
  onAdd,
  onDuplicate,
  onDelete,
  maxPages = 10,
}) => {
  return (
    <div className="flex items-center gap-2 px-4 py-2 overflow-x-auto border-t border-border bg-surface">
      {pages.map((page, index) => (
        <div
          key={page.id}
          className={cn(
            "relative flex-shrink-0 w-12 h-16 rounded border cursor-pointer transition-colors overflow-hidden group",
            index === currentIndex ? "border-accent bg-accent/10" : "border-border bg-surface-2 hover:border-text-secondary"
          )}
          onClick={() => onSelect(index)}
        >
          <div className="absolute inset-0 flex items-center justify-center text-[10px] text-text-secondary">
            {index + 1}
          </div>
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-1 transition-opacity">
            <button
              onClick={(e) => { e.stopPropagation(); onDuplicate(index); }}
              className="p-0.5 rounded bg-surface-2 text-text-secondary hover:text-text-primary"
            >
              <Copy size={10} />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); onDelete(index); }}
              className="p-0.5 rounded bg-surface-2 text-text-secondary hover:text-danger"
            >
              <Trash2 size={10} />
            </button>
          </div>
        </div>
      ))}
      {pages.length < maxPages && (
        <button
          onClick={onAdd}
          className="flex-shrink-0 w-12 h-16 rounded border border-dashed border-border flex items-center justify-center text-text-secondary hover:border-accent hover:text-accent transition-colors"
        >
          <Plus size={16} />
        </button>
      )}
      <div className="ml-auto text-xs text-text-secondary flex-shrink-0">
        {currentIndex + 1} / {pages.length}
      </div>
    </div>
  );
};
