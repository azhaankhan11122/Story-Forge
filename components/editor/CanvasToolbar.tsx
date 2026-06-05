"use client";

import React from "react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils/cn";
import {
  ImagePlus,
  Type,
  Sticker,
  Filter,
  SlidersHorizontal,
  Paintbrush,
} from "lucide-react";
import type { ToolType } from "@/types/editor";

interface CanvasToolbarProps {
  activeTool: string | null;
  onToolClick: (tool: string) => void;
}

const tools: { id: ToolType["id"]; label: string; icon: React.ReactNode }[] = [
  { id: "image", label: "Image", icon: <ImagePlus size={18} /> },
  { id: "text", label: "Text", icon: <Type size={18} /> },
  { id: "sticker", label: "Stickers", icon: <Sticker size={18} /> },
  { id: "filter", label: "Filter", icon: <Filter size={18} /> },
  { id: "adjust", label: "Adjust", icon: <SlidersHorizontal size={18} /> },
];

export const CanvasToolbar: React.FC<CanvasToolbarProps> = ({ activeTool, onToolClick }) => {
  return (
    <div className="flex items-center justify-center gap-1 px-4 py-2 border-t border-border bg-surface">
      {tools.map((tool) => (
        <button
          key={tool.id}
          onClick={() => onToolClick(tool.id!)}
          className={cn(
            "flex flex-col items-center gap-1 px-3 py-2 rounded-standard text-xs transition-colors",
            activeTool === tool.id
              ? "text-accent bg-accent/10"
              : "text-text-secondary hover:text-text-primary hover:bg-surface-2"
          )}
        >
          {tool.icon}
          <span className="text-[10px]">{tool.label}</span>
        </button>
      ))}
    </div>
  );
};
