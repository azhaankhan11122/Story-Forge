"use client";

import React from "react";
import { EmojiPicker } from "@/components/editor/panels/EmojiPicker";
import { shapeItems } from "@/data/categories";
import { cn } from "@/lib/utils/cn";

interface StickerToolProps {
  onAddEmoji: (content: string) => void;
  onAddShape: (shape: string) => void;
}

export const StickerTool: React.FC<StickerToolProps> = ({ onAddEmoji, onAddShape }) => {
  return (
    <div className="space-y-4">
      <div>
        <label className="text-xs text-text-secondary mb-2 block">Emoji & Stickers</label>
        <EmojiPicker onSelect={onAddEmoji} />
      </div>
      <div>
        <label className="text-xs text-text-secondary mb-2 block">Shapes</label>
        <div className="grid grid-cols-4 gap-2">
          {shapeItems.map((shape) => (
            <button
              key={shape.id}
              onClick={() => onAddShape(shape.content)}
              className={cn("aspect-square rounded border border-border bg-surface-2 hover:border-accent hover:text-accent transition-colors flex items-center justify-center text-xs text-text-secondary")}
            >
              {shape.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
