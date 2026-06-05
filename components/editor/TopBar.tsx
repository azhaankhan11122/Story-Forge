"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils/cn";
import { ArrowLeft, Undo2, Redo2, Download, ZoomIn, ZoomOut, Grid3x3, Ruler } from "lucide-react";

interface TopBarProps {
  storyName: string;
  onNameChange: (name: string) => void;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  onExport: () => void;
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  showGrid: boolean;
  onToggleGrid: () => void;
  showRulers: boolean;
  onToggleRulers: () => void;
  savedStatus: string;
}

export const TopBar: React.FC<TopBarProps> = ({
  storyName,
  onNameChange,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  onExport,
  zoom,
  onZoomIn,
  onZoomOut,
  showGrid,
  onToggleGrid,
  showRulers,
  onToggleRulers,
  savedStatus,
}) => {
  const router = useRouter();

  return (
    <div className="h-12 flex items-center px-4 border-b border-border bg-surface/80 backdrop-blur-sm gap-4">
      <button
        onClick={() => router.push("/")}
        className="flex items-center gap-1 text-text-secondary hover:text-text-primary transition-colors"
      >
        <ArrowLeft size={16} />
        <span className="text-sm hidden sm:inline">Back</span>
      </button>

      <input
        type="text"
        value={storyName}
        onChange={(e) => onNameChange(e.target.value)}
        className="bg-transparent border-none text-sm font-medium text-text-primary focus:outline-none focus:ring-1 focus:ring-accent rounded px-2 py-1 w-48 sm:w-64"
      />

      <div className="ml-auto flex items-center gap-2">
        <span className="text-[10px] text-text-secondary hidden sm:inline">{savedStatus}</span>

        <div className="flex items-center gap-1">
          <button onClick={onZoomOut} className="p-1.5 rounded hover:bg-surface-2 text-text-secondary hover:text-text-primary">
            <ZoomOut size={14} />
          </button>
          <span className="text-xs text-text-secondary w-12 text-center">{Math.round(zoom * 100)}%</span>
          <button onClick={onZoomIn} className="p-1.5 rounded hover:bg-surface-2 text-text-secondary hover:text-text-primary">
            <ZoomIn size={14} />
          </button>
        </div>

        <button
          onClick={onToggleGrid}
          className={cn("p-1.5 rounded hover:bg-surface-2", showGrid ? "text-accent" : "text-text-secondary")}
        >
          <Grid3x3 size={14} />
        </button>

        <button
          onClick={onToggleRulers}
          className={cn("p-1.5 rounded hover:bg-surface-2", showRulers ? "text-accent" : "text-text-secondary")}
        >
          <Ruler size={14} />
        </button>

        <div className="h-4 w-px bg-border mx-1" />

        <button onClick={onUndo} disabled={!canUndo} className="p-1.5 rounded hover:bg-surface-2 text-text-secondary hover:text-text-primary disabled:opacity-30">
          <Undo2 size={14} />
        </button>
        <button onClick={onRedo} disabled={!canRedo} className="p-1.5 rounded hover:bg-surface-2 text-text-secondary hover:text-text-primary disabled:opacity-30">
          <Redo2 size={14} />
        </button>

        <Button variant="primary" size="sm" onClick={onExport}>
          <Download size={14} className="mr-1" /> Export
        </Button>
      </div>
    </div>
  );
};
