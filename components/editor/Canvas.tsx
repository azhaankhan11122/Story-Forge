"use client";

import React, { useRef } from "react";
import { cn } from "@/lib/utils/cn";
import type { CanvasRatio } from "@/types/editor";

interface CanvasProps {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  containerRef: React.RefObject<HTMLDivElement | null>;
  isReady: boolean;
  zoom: number;
  showGrid: boolean;
  showRulers: boolean;
  ratio: CanvasRatio;
}

export const Canvas: React.FC<CanvasProps> = ({
  canvasRef,
  containerRef,
  isReady,
  zoom,
  showGrid,
  showRulers,
  ratio,
}) => {
  return (
    <div
      ref={containerRef}
      className={cn(
        "relative w-full h-full overflow-hidden bg-background flex items-center justify-center",
        showGrid && "canvas-grid"
      )}
    >
      {showRulers && (
        <div className="absolute top-0 left-0 right-0 h-6 bg-surface border-b border-border text-[10px] text-text-secondary flex items-center justify-between px-4 pointer-events-none">
          <span>0</span>
          <span>{ratio === "9:16" ? "1080" : ratio === "1:1" ? "1080" : "1920"}</span>
        </div>
      )}
      {showRulers && (
        <div className="absolute top-0 left-0 bottom-0 w-6 bg-surface border-r border-border text-[10px] text-text-secondary flex flex-col items-center justify-between py-4 pointer-events-none writing-vertical">
          <span>0</span>
          <span className="rotate-180">{ratio === "9:16" ? "1920" : ratio === "1:1" ? "1080" : "1080"}</span>
        </div>
      )}
      <div className={cn("relative", showRulers && "ml-6 mt-6")}>
        <div className="absolute inset-0 pointer-events-none ring-1 ring-white/10" />
        <canvas ref={canvasRef} className="block" />
      </div>
    </div>
  );
};
