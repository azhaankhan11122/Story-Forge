import type * as fabric from "fabric";

export type CanvasRatio = "9:16" | "1:1" | "4:5" | "16:9" | "4:3";

export interface CanvasDimensions {
  width: number;
  height: number;
  ratio: CanvasRatio;
}

export interface EditorState {
  currentStoryId: string | null;
  currentPageIndex: number;
  selectedIds: string[];
  zoom: number;
  isDragging: boolean;
  isPanning: boolean;
  showGrid: boolean;
  showRulers: boolean;
  snapToGuides: boolean;
  backgroundColor: string;
  backgroundGradient: import("./story").Gradient | null;
}

export interface HistoryEntry {
  id: string;
  pageIndex: number;
  canvasJSON: string;
  timestamp: number;
}

export interface ToolType {
  id: "image" | "text" | "sticker" | "filter" | "adjust" | "background" | null;
  label: string;
  icon: string;
}

export interface TextStyle {
  fontFamily: string;
  fontSize: number;
  fontWeight: string;
  fontStyle: "normal" | "italic";
  letterSpacing: number;
  lineHeight: number;
  textAlign: "left" | "center" | "right" | "justify";
  fill: string;
  backgroundColor: string | null;
  textDecoration: string;
  opacity: number;
  textTransform: "none" | "uppercase" | "lowercase";
}

export interface ImageAdjustments {
  brightness: number;
  contrast: number;
  saturation: number;
  blur: number;
  sharpness: number;
  vignette: number;
  grain: number;
  temperature: number;
  fade: number;
}

export interface FilterPreset {
  id: string;
  name: string;
  matrix: number[];
}

export interface LayerInfo {
  id: string;
  type: string;
  name: string;
  visible: boolean;
  locked: boolean;
  index: number;
  thumbnail?: string;
}

export type ExportFormat = "png" | "jpg" | "pdf" | "svg";
export type ExportQuality = 1 | 2 | 3;

export interface ExportOptions {
  format: ExportFormat;
  quality: ExportQuality;
  pages: number[] | "all";
}

export interface KeyboardShortcut {
  key: string;
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  meta?: boolean;
  action: () => void;
  description: string;
}
