"use client";

import React, { useState } from "react";
import { stickers } from "@/data/stickers";
import { cn } from "@/lib/utils/cn";

interface EmojiPickerProps {
  onSelect: (content: string) => void;
}

export const EmojiPicker: React.FC<EmojiPickerProps> = ({ onSelect }) => {
  const [activeCategory, setActiveCategory] = useState("emoji");
  const category = stickers.find((c) => c.id === activeCategory);

  return (
    <div className="space-y-3">
      <div className="flex gap-1 overflow-x-auto pb-1">
        {stickers.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={cn(
              "px-2 py-1 rounded text-xs font-medium whitespace-nowrap transition-colors",
              activeCategory === cat.id ? "bg-accent text-background" : "bg-surface-2 text-text-secondary"
            )}
          >
            {cat.name}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-5 gap-1 max-h-48 overflow-y-auto">
        {category?.items.map((item) => (
          <button
            key={item.id}
            onClick={() => onSelect(item.content)}
            className="aspect-square flex items-center justify-center rounded hover:bg-surface-2 text-2xl transition-colors"
            title={item.name}
          >
            {item.content}
          </button>
        ))}
      </div>
    </div>
  );
};
